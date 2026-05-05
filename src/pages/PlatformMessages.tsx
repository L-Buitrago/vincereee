import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Send, User, Search, Plus, MessageSquare, Check, CheckCheck, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DirectConversation = {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message: string | null;
  last_message_at: string;
  other_user_name?: string;
  other_user_id?: string;
  category?: 'direct' | 'support';
};

type DirectMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
};

type UserProfile = {
  user_id: string;
  full_name: string | null;
};

export default function PlatformMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<DirectConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<DirectConversation | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [profilesCache, setProfilesCache] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const startChatParam = searchParams.get('startChat');
  const initialTab = searchParams.get('tab') as 'direct' | 'support' || 'direct';
  const categoryParam = searchParams.get('category') as 'direct' | 'support';
  const [activeTab, setActiveTab] = useState<'direct' | 'support'>(initialTab);
  const [lastDirectConv, setLastDirectConv] = useState<DirectConversation | null>(null);
  const [lastSupportConv, setLastSupportConv] = useState<DirectConversation | null>(null);
  const [hasProcessedStartChat, setHasProcessedStartChat] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);


  // Load profiles cache
  const loadProfileName = useCallback(async (userId: string) => {
    if (profilesCache[userId]) return profilesCache[userId];
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) setProfilesCache((prev) => ({ ...prev, [userId]: data.full_name || "Usuário" }));
    return data?.full_name || "Usuário";
  }, [profilesCache]);

  // Generate notification sound using Web Audio API
  const playNotificationSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
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
  }, []);

  // Load conversations
  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("direct_conversations" as any)
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("last_message_at", { ascending: false });

      if (!error && data) {
        const convs = data as any as DirectConversation[];
        // Load other user names in parallel
        await Promise.all(convs.map(async (conv) => {
          const otherId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
          conv.other_user_id = otherId;
          conv.other_user_name = await loadProfileName(otherId);
        }));
        
        setConversations(convs);
        
        // Find first for each tab to initialize "last" states
        const firstDirect = convs.find(c => (c.category || 'direct') === 'direct');
        const firstSupport = convs.find(c => c.category === 'support');
        
        if (firstDirect) setLastDirectConv(firstDirect);
        if (firstSupport) setLastSupportConv(firstSupport);

        if (convs.length > 0 && !activeConversation) {
          if (initialTab === 'support' && firstSupport) {
            setActiveConversation(firstSupport);
          } else if (firstDirect) {
            setActiveConversation(firstDirect);
          } else {
            setActiveConversation(convs[0]);
          }
        }
      }
      setIsLoading(false);
    };

    loadConversations();
  }, [user]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConversation) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("direct_messages" as any)
        .select("*")
        .eq("conversation_id", activeConversation.id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data as any as DirectMessage[]);
      }

      // Mark messages as read
      if (user) {
        await supabase
          .from("direct_messages" as any)
          .update({ read: true })
          .eq("conversation_id", activeConversation.id)
          .neq("sender_id", user.id)
          .eq("read", false);
      }
    };

    loadMessages();

    // Realtime subscription
    const channel = supabase
      .channel(`dm_${activeConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `conversation_id=eq.${activeConversation.id}`,
        },
        (payload) => {
          const newMsg = payload.new as DirectMessage;
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          // Mark as read if it's from the other user
          if (user && newMsg.sender_id !== user.id) {
            playNotificationSound();
            supabase
              .from("direct_messages" as any)
              .update({ read: true })
              .eq("id", newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation?.id, user]);

  // Realtime for conversation list updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("dm_conversations_update")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "direct_conversations" },
        async (payload) => {
          if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as any)?.id;
            if (deletedId) {
              setConversations((prev) => prev.filter(c => c.id !== deletedId));
              setActiveConversation((prev) => prev?.id === deletedId ? null : prev);
            }
            return;
          }

          const conv = payload.new as DirectConversation;
          if (!conv || (conv.user1_id !== user.id && conv.user2_id !== user.id)) return;

          const otherId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
          conv.other_user_id = otherId;
          conv.other_user_name = await loadProfileName(otherId);

          setConversations((prev) => {
            const exists = prev.find((c) => c.id === conv.id);
            if (exists) {
              return prev
                .map((c) => (c.id === conv.id ? conv : c))
                .sort((a, b) => new Date(b.last_message_at || 0).getTime() - new Date(a.last_message_at || 0).getTime());
            }
            return [conv, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadProfileName]);

  // Search users
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Database-level filtering for better performance and accuracy
    const q = `%${query}%`;
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .neq("user_id", user?.id || "")
      .ilike("full_name", q)
      .limit(20);

    if (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      return;
    }

    if (data) {
      setSearchResults(data as UserProfile[]);
    }
  };

  // Start new conversation
  const startConversation = async (otherUserId: string, otherUserName: string, category: 'direct' | 'support' = 'direct') => {
    if (!user) return;
    
    // Check if conversation already exists (filter by category too)
    const existing = conversations.find(
      (c) =>
        ((c.user1_id === user.id && c.user2_id === otherUserId) ||
        (c.user1_id === otherUserId && c.user2_id === user.id)) &&
        (c.category === category)
    );

    if (existing) {
      setActiveTab(category);
      setActiveConversation(existing);
      if (category === 'support') setLastSupportConv(existing);
      else setLastDirectConv(existing);
      setShowNewChat(false);
      setSearchQuery("");
      setSearchResults([]);
      return;
    }

    // Create new conversation
    const { data, error } = await supabase
      .from("direct_conversations" as any)
      .insert({
        user1_id: user.id,
        user2_id: otherUserId,
        category: category
      })
      .select()
      .single();

    if (error) {
      toast({ 
        title: "Erro ao iniciar conversa", 
        description: error.message || "Não foi possível iniciar a conversa no banco de dados.", 
        variant: "destructive" 
      });
      return;
    }

    const conv = data as any as DirectConversation;
    conv.other_user_id = otherUserId;
    conv.other_user_name = otherUserName;
    conv.category = category;

    setConversations((prev) => [conv, ...prev]);
    setActiveTab(category);
    setActiveConversation(conv);
    if (category === 'support') setLastSupportConv(conv);
    else setLastDirectConv(conv);
    setShowNewChat(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    if (!user || isLoading || !startChatParam || hasProcessedStartChat) return;

    const processStartChat = async () => {
      setHasProcessedStartChat(true);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .ilike("full_name", `%${startChatParam}%`)
        .limit(1)
        .maybeSingle();

      if (data) {
        startConversation(data.user_id, data.full_name || startChatParam, categoryParam || 'direct');
        setNewMessage(`Olá ${startChatParam}, gostaria de uma ajuda com `);
      }
    };

    processStartChat();
  }, [user, isLoading, startChatParam, hasProcessedStartChat, categoryParam]);

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !user) return;

    const content = newMessage.trim();
    setNewMessage("");

    const { data: newMsg, error: msgError } = await supabase
      .from("direct_messages" as any)
      .insert({
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content,
      })
      .select()
      .single();

    if (msgError) {
      toast({ title: "Erro ao enviar", description: msgError.message, variant: "destructive" });
      setNewMessage(content);
      return;
    }

    const insertedMessage = newMsg as unknown as DirectMessage | null;

    if (insertedMessage) {
      setMessages((prev) => {
        if (prev.find((m) => m.id === insertedMessage.id)) return prev;
        return [...prev, insertedMessage];
      });
    }

    // Update last message on conversation
    await supabase
      .from("direct_conversations" as any)
      .update({
        last_message: content,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", activeConversation.id);
  };

  // Delete conversation
  const deleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (!user) return;

    try {
      // Direct deletion of conversation should ideally cascade to messages if foreign keys are set
      // But we explicitly delete messages just in case
      await supabase
        .from("direct_messages" as any)
        .delete()
        .eq("conversation_id", conversationId);

      // Delete conversation
      const { error, count } = await supabase
        .from("direct_conversations" as any)
        .delete({ count: 'exact' })
        .eq("id", conversationId);

      if (error) throw error;

      // If count is 0, it means RLS blocked the deletion or it was already deleted
      if (count === 0) {
        console.warn("Nenhuma linha removida. Verifique as políticas de RLS no Supabase.");
        // We still remove it from local state to satisfy the UI, but it might return on refresh
        // if the RLS didn't actually allow the deletion.
      }

      toast({ title: "Sucesso", description: "Conversa apagada com sucesso." });
      
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
      }
    } catch (error: any) {
      console.error("Erro ao apagar conversa:", error);
      toast({ title: "Erro ao apagar", description: "Não foi possível apagar a conversa. Verifique sua conexão ou permissões.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-[#888] text-center">Carregando mensagens...</div>;
  }

  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      {/* Conversations List */}
      <div className={`
        ${isMobile && activeConversation ? 'hidden' : 'flex'}
        ${isMobile ? 'w-full' : 'w-80'}
        border-r border-border bg-card flex-col
      `}>
        <div className="p-4 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground font-bold">Mensagens</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowNewChat(!showNewChat)}
              className="text-sky-400 hover:text-foreground hover:bg-muted h-8 w-8"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex p-1 bg-muted/50 rounded-lg border border-border">
            <button
              onClick={() => {
                setActiveTab('direct');
                setActiveConversation(lastDirectConv);
              }}
              className={`flex-1 flex items-center justify-center py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'direct' 
                  ? "bg-sky-600/20 text-sky-400 border border-sky-500/30" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Geral
            </button>
            <button
              onClick={() => {
                setActiveTab('support');
                setActiveConversation(lastSupportConv);
              }}
              className={`flex-1 flex items-center justify-center py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'support' 
                  ? "bg-sky-600/20 text-sky-400 border border-sky-500/30" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Suporte
            </button>
          </div>
        </div>

        {/* New Chat Search */}
        {showNewChat && (
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar usuário..."
                className="pl-9 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-sky-500 text-foreground text-sm"
                autoFocus
              />
            </div>
            {searchResults.length > 0 && (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {searchResults.map((profile) => (
                  <button
                    key={profile.user_id}
                    onClick={() => startConversation(profile.user_id, profile.full_name || "Usuário")}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-foreground truncate">{profile.full_name || "Usuário"}</span>
                  </button>
                ))}
              </div>
            )}
            {searchQuery.length >= 1 && searchResults.length === 0 && (
              <p className="text-xs text-[#888] text-center py-2">Nenhum usuário encontrado</p>
            )}
          </div>
        )}

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.filter(c => (c.category || 'direct') === activeTab).length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-[#333] mx-auto" />
              <p className="text-sm text-[#888]">
                {activeTab === 'support' ? "Nenhum atendimento de suporte" : "Nenhuma conversa ainda"}
              </p>
              <p className="text-xs text-[#666]">
                {activeTab === 'support' ? "Inicie um atendimento via página de ajuda" : "Clique no + para iniciar"}
              </p>
            </div>
          ) : (
            conversations
              .filter(conv => (conv.category || 'direct') === activeTab)
              .map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveConversation(conv);
                  if ((conv.category || 'direct') === 'support') setLastSupportConv(conv);
                  else setLastDirectConv(conv);
                }}
                className={`w-full text-left p-4 border-b border-border transition-colors ${
                  activeConversation?.id === conv.id 
                    ? (activeTab === 'support' ? "bg-sky-500/10" : "bg-sky-500/10") 
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    activeTab === 'support' ? "bg-sky-500/20 text-sky-400" : "bg-sky-500/20 text-sky-400"
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-medium text-foreground text-sm truncate">
                        {conv.other_user_name || "Usuário"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#888] shrink-0">
                          {new Date(conv.last_message_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                        </span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-md hover:bg-red-500/20 text-[#888] hover:text-red-400 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </AlertDialogTrigger>
                         <AlertDialogContent className="bg-card border-border text-foreground">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Apagar conversa?</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                Esta ação não pode ser desfeita. Todas as mensagens com {conv.other_user_name} serão removidas permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-muted border-border text-foreground hover:bg-muted/80">Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={(e) => deleteConversation(e as any, conv.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Apagar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    {conv.last_message && (
                      <p className="text-xs text-[#888] truncate">{conv.last_message}</p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation ? (
        <div className={`
          ${isMobile ? 'fixed inset-0 z-[60] h-full' : 'flex-1'}
          flex flex-col bg-background
        `}>
          {/* Header */}
          <div className="h-16 border-b border-border flex items-center px-4 sm:px-6 bg-card shrink-0">
            <div className="flex items-center gap-3 flex-1">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveConversation(null)}
                  className="mr-1 text-foreground"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
              )}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-foreground font-medium">
                  {activeConversation.other_user_name || "Usuário"}
                </h2>
                <p className="text-xs text-sky-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-[#333] mx-auto mb-3" />
                <p className="text-sm text-[#888]">Envie a primeira mensagem!</p>
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-end gap-2 max-w-[70%]">
                    {!isMe && (
                      <div className="w-7 h-7 shrink-0 rounded-full bg-white/10 flex items-center justify-center mb-1">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div
                        className={`p-3 rounded-2xl text-sm ${
                          isMe
                            ? "bg-sky-600 text-white rounded-tr-sm"
                            : "bg-muted text-foreground border border-border rounded-tl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end mr-1" : "ml-1"}`}>
                        <span className="text-[10px] text-[#666]">
                          {new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {isMe && (
                          msg.read ? (
                            <CheckCheck className="w-3 h-3 text-sky-400" />
                          ) : (
                            <Check className="w-3 h-3 text-[#666]" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-sky-500 text-foreground"
              />
              <Button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-sky-600 hover:bg-sky-600/90 text-white px-4 shrink-0 transition-all"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-background text-muted-foreground">
          <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium mb-1">Suas mensagens</p>
          <p className="text-sm text-[#666]">Selecione uma conversa ou inicie uma nova</p>
        </div>
      )}
    </div>
  );
}
