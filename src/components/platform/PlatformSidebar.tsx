import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CreditCard, Package, ShoppingCart, Store,
  TrendingUp, GitBranch, Settings, ShoppingBag, HelpCircle, Headset,
  LogOut, Menu, X, ChevronRight, Crown, Rocket, MessageSquare, Sun, Moon, Download
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NotificationBell from "./NotificationBell";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/plataforma/dashboard" },
  { label: "Pagamentos", icon: CreditCard, path: "/plataforma/pagamentos" },
  { label: "Produtos", icon: Package, path: "/plataforma/produtos" },
  { label: "Checkouts", icon: ShoppingCart, path: "/plataforma/checkouts" },
  { label: "Clientes", icon: Store, path: "/plataforma/clientes" },
  { label: "Mensagens", icon: MessageSquare, path: "/plataforma/mensagens" },
  { label: "Upsell", icon: TrendingUp, path: "/plataforma/dashboard" },
  { label: "Funis", icon: GitBranch, path: "/plataforma/dashboard" },
];

const bottomItems = [
  { label: "Configurações", icon: Settings, path: "/plataforma/configuracoes" },
  { label: "Minhas Compras", icon: ShoppingBag, path: "/plataforma/compras" },
  { label: "Ajuda", icon: HelpCircle, path: "/plataforma/suporte?mode=guide" },
];

export default function PlatformSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useOrganization();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast.success("Saiu com sucesso");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const userName = user?.user_metadata?.full_name || "Membro";
  const userInitials = userName.substring(0, 2).toUpperCase();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-black">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-lg font-bold text-white tracking-tight font-display">Vincere</span>
        </Link>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 group relative ${
              isActive(item.path)
                ? "bg-sky-500/20 text-white shadow-[0_0_20px_rgba(14,165,233,0.15)]"
                : "text-premium-text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className={`w-[20px] h-[20px] shrink-0 ${isActive(item.path) ? "text-sky-500" : ""}`} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
            {!collapsed && isActive(item.path) && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-sky-500 rounded-r-full"
              />
            )}
          </Link>
        ))}

        {isAdmin && (
          <Link
            to="/plataforma/admin"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 group ${
              isActive("/plataforma/admin")
                ? "bg-premium-green/20 text-[#7DE260]"
                : "text-[#7DE260] hover:bg-[#7DE260]/10"
            }`}
          >
            <Crown className="w-[20px] h-[20px] shrink-0 text-[#7DE260]" />
            {!collapsed && <span className="font-medium">Painel Admin</span>}
          </Link>
        )}
      </nav>

        <div className="px-3 pb-6 flex flex-col gap-1 border-t border-white/5 pt-4">

          {bottomItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-premium-text-muted hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#111] border border-white/10 text-white"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[260px] bg-black border-r border-white/5"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col sticky top-0 h-screen border-r border-white/5 bg-black transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-[240px]"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
