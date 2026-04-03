import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, CreditCard, Palette, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PlatformHeader from "@/components/platform/PlatformHeader";

export default function PlatformSettings() {
  const { user, updateUserMetadata } = useAuth();
  const { org, orgId } = useOrganization();
  const [activeTab, setActiveTab] = useState("perfil");
  const [loading, setLoading] = useState(false);

  // Profile State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Security State
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
      // Fetch additional profile data
      supabase
        .from("profiles")
        .select("phone")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.phone) setPhone(data.phone);
        });
    }
    if (org) {
      setCompanyName(org.name || "");
    }
  }, [user, org]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Handle mock user for local development
      if (user.id === 'dev-admin-user') {
        updateUserMetadata({ full_name: fullName });
        toast.success("Perfil atualizado (Modo Desenvolvedor)!");
        setLoading(false);
        return;
      }

      // 1. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      if (authError) {
        console.error("Auth update error:", authError);
      } else {
        updateUserMetadata({ full_name: fullName });
      }

      // 2. Update Profiles table (using upsert to handle missing rows)
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ 
          user_id: user.id, 
          full_name: fullName, 
          phone: phone 
        }, { onConflict: 'user_id' });
      
      if (profileError) {
        console.error("Profile update error:", profileError);
        throw new Error(`Erro no perfil: ${profileError.message}`);
      }

      // 3. Update Organization
      if (orgId) {
        const { error: orgError } = await supabase
          .from("organizations")
          .update({ name: companyName })
          .eq("id", orgId);
        
        if (orgError) {
          console.error("Org update error:", orgError);
          throw new Error(`Erro na empresa: ${orgError.message}`);
        }
      }

      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao salvar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      toast.error("Por favor, digite a nova senha");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso!");
      setNewPassword("");
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "perfil", label: "Perfil", icon: User },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "seguranca", label: "Segurança", icon: Shield },
    { id: "pagamento", label: "Pagamento", icon: CreditCard },
    { id: "aparencia", label: "Aparência", icon: Palette },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      <PlatformHeader title="Configurações" />
      
      <div className="flex-1 overflow-auto p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:w-56 shrink-0 pb-4 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,0.1)]"
                      : "text-[#888] hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
              {activeTab === "perfil" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Informações do Perfil</h2>
                    <p className="text-sm text-[#888]">Mantenha seus dados atualizados para uma melhor experiência.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Nome completo</label>
                      <input 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all focus:ring-1 focus:ring-sky-500/50 outline-none" 
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email Principal</label>
                      <input 
                        defaultValue={user?.email || ""} 
                        disabled 
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white/30 cursor-not-allowed" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
                      <input 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all focus:ring-1 focus:ring-sky-500/50 outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Nome da Empresa</label>
                      <input 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Sua empresa" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all focus:ring-1 focus:ring-sky-500/50 outline-none" 
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={loading}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-95 gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "notificacoes" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Notificações</h2>
                    <p className="text-sm text-[#888]">Escolha como você quer ser avisado das novidades.</p>
                  </div>
                  
                  <div className="space-y-2">
                    {["Novas vendas via checkout", "Pagamentos em atraso", "Novos leads registrados", "Alertas críticos do sistema"].map((item) => (
                      <div key={item} className="flex items-center justify-between py-4 border-b border-white/5 px-2 hover:bg-white/[0.01] transition-colors rounded-lg">
                        <span className="text-sm font-medium text-white/80">{item}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-10 h-5.5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-sky-500" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "seguranca" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Segurança da Conta</h2>
                    <p className="text-sm text-[#888]">Mantenha sua conta protegida com uma senha forte.</p>
                  </div>
                  
                  <div className="max-w-md space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Nova Senha</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all focus:ring-1 focus:ring-sky-500/50 outline-none" 
                      />
                    </div>
                    <Button 
                      onClick={handleUpdatePassword} 
                      disabled={loading}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-6 rounded-xl transition-all gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                      Atualizar Senha
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "pagamento" && (
                <div className="space-y-8 text-center py-12">
                  <div className="w-20 h-20 bg-sky-500/10 rounded-3xl border border-sky-500/20 flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="w-10 h-10 text-sky-500" />
                  </div>
                  <div className="max-w-sm mx-auto">
                    <h2 className="text-xl font-bold text-white mb-2">Faturamento e Assinatura</h2>
                    <p className="text-sm text-[#888] mb-8">
                      Clique no botão abaixo para gerenciar seus planos, histórico de faturas e métodos de pagamento.
                    </p>
                    <a href="/plataforma/pagamentos" className="block">
                      <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-6 rounded-xl gap-2">
                        Abrir Financeiro
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {activeTab === "aparencia" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Personalização</h2>
                    <p className="text-sm text-[#888]">Ajuste a interface da plataforma conforme seu gosto.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="aspect-video bg-sky-600/20 rounded-2xl border-2 border-sky-500 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-x-0 bottom-0 py-2 bg-sky-500/80 backdrop-blur-sm text-center text-[10px] font-bold text-white uppercase tracking-widest">
                        Dark (Ativo)
                      </div>
                      <Palette className="w-8 h-8 text-sky-500" />
                    </div>
                    <div className="aspect-video bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center opacity-40 cursor-not-allowed">
                       <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Coming Soon</span>
                       <Sun className="w-6 h-6 text-white/10" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
