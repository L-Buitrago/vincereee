import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CopyCheck, Inbox, X } from "lucide-react";

type Notification = {
  id: string;
  user_email: string;
  title: string;
  body: string;
  read: boolean;
  type: string;
  created_at: string;
};

export default function NotificationBell() {
  const { user } = useAuth();
  const { isAdmin } = useOrganization();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAdmin || !user?.email) return;

    // Generate notification sound using Web Audio API
    const playNotificationSound = () => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // First tone
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc1.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.12); // G5
        gain1.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(audioCtx.currentTime);
        osc1.stop(audioCtx.currentTime + 0.4);

        // Second tone (slightly delayed)
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain2.gain.setValueAtTime(0, audioCtx.currentTime);
        gain2.gain.setValueAtTime(0.25, audioCtx.currentTime + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(audioCtx.currentTime + 0.15);
        osc2.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        // Audio not available
      }
    };

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications' as any)
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data as any as Notification[]);
      }
    };

    fetchNotifications();

    const channel = supabase.channel(`notifications_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_email=eq.${user.email}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as any as Notification, ...prev]);
            playNotificationSound();
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new as any as Notification : n));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email, user?.id, isAdmin]);

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    
    await supabase
      .from('notifications' as any)
      .update({ read: true })
      .eq('id', id);
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    await supabase
      .from('notifications' as any)
      .update({ read: true })
      .in('id', unreadIds);
  };

  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    await supabase
      .from('notifications' as any)
      .delete()
      .eq('id', id);
  };

  if (!isAdmin) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-border bg-card hover:bg-muted transition-all duration-300 text-muted-foreground hover:text-foreground shadow-sm"
      >
        <Bell className="w-5 h-5 shadow-inner" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-background animate-pulse"></span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-85 bg-card border border-border rounded-2xl shadow-2xl z-[60] overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="text-foreground font-bold text-sm tracking-tight">Notificações</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-sky-500 flex items-center gap-1.5 transition-all"
                >
                  <CopyCheck className="w-3.5 h-3.5" />
                  Marcar lidas
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground/40">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Inbox className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-sm font-medium">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map(notif => (
                    <motion.div 
                      key={notif.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={() => {
                        if (!notif.read) markAsRead(notif.id);
                      }}
                      className={`p-5 transition-all cursor-pointer hover:bg-muted/50 border-l-4 ${
                        !notif.read ? 'bg-sky-500/[0.03] border-sky-500' : 'border-transparent opacity-80'
                      }`}
                    >
                      <div className="flex gap-4 relative group/item">
                        <div className="flex-1 pr-6">
                          <p className={`text-sm ${!notif.read ? 'text-foreground font-bold' : 'text-muted-foreground/80 font-medium'}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-1.5 pr-2 line-clamp-2 leading-relaxed">
                            {notif.body}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 px-2 py-0.5 rounded-md bg-muted/50">
                              {new Date(notif.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="text-[9px] font-medium text-muted-foreground/30">
                              {new Date(notif.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => deleteNotification(e, notif.id)}
                          className="absolute right-0 top-0 p-1.5 opacity-0 group-hover/item:opacity-100 hover:bg-red-500/10 rounded-lg transition-all text-muted-foreground/30 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 bg-muted/10 border-t border-border text-center">
               <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors">
                 Ver histórico completo
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
