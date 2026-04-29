import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, CreditCard, Palette, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PlatformHeader from "@/components/platform/PlatformHeader";
import { useTheme } from "@/components/theme-provider";


export default function PlatformSettings() {
  const { user, updateUserMetadata } = useAuth();
  const { theme, setTheme } = useTheme();
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
      console.error("ERRO DETALHADO NO SETTINGS:", error);
      alert(`Erro técnico ao salvar:\n${error.message}\n\nVerifique se rodou o SQL de sincronização de perfis.`);
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
    <div className="flex flex-col h-full bg-background">
      <PlatformHeader title="Configurações" />
      
      <div className="flex-1 overflow-y-auto w-full bg-background min-h-[calc(100vh-80px)] p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:w-56 shrink-0 pb-4 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 bg-card border border-border rounded-3xl p-8 shadow-sm">
              {activeTab === "perfil" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Informações do Perfil</h2>
                    <p className="text-sm text-muted-foreground">Mantenha seus dados atualizados para uma melhor experiência.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Nome completo</label>
                      <input 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all focus:ring-1 focus:ring-primary/50 outline-none" 
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Email Principal</label>
                      <input 
                        defaultValue={user?.email || ""} 
                        disabled 
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground cursor-not-allowed" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
                      <input 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999" 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all focus:ring-1 focus:ring-primary/50 outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Nome da Empresa</label>
                      <input 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Sua empresa" 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all focus:ring-1 focus:ring-primary/50 outline-none" 
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={loading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 gap-2"
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
                    <h2 className="text-xl font-bold text-foreground mb-2">Notificações</h2>
                    <p className="text-sm text-muted-foreground">Escolha como você quer ser avisado das novidades.</p>
                  </div>
                  
                  <div className="space-y-2">
                    {["Novas vendas via checkout", "Pagamentos em atraso", "Novos leads registrados", "Alertas críticos do sistema"].map((item) => (
                      <div key={item} className="flex items-center justify-between py-4 border-b border-border px-2 hover:bg-muted/50 transition-colors rounded-lg">
                        <span className="text-sm font-medium text-foreground/80">{item}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-10 h-5.5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-primary" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "seguranca" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Segurança da Conta</h2>
                    <p className="text-sm text-muted-foreground">Mantenha sua conta protegida com uma senha forte.</p>
                  </div>
                  
                  <div className="max-w-md space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">Nova Senha</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all focus:ring-1 focus:ring-primary/50 outline-none" 
                      />
                    </div>
                    <Button 
                      onClick={handleUpdatePassword} 
                      disabled={loading}
                      className="w-full bg-muted border border-border hover:bg-muted/80 text-foreground font-bold py-6 rounded-xl transition-all gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                      Atualizar Senha
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "pagamento" && (
                <div className="space-y-8 text-center py-12">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="w-10 h-10 text-primary" />
                  </div>
                  <div className="max-w-sm mx-auto">
                    <h2 className="text-xl font-bold text-foreground mb-2">Faturamento e Assinatura</h2>
                    <p className="text-sm text-muted-foreground mb-8">
                      Clique no botão abaixo para gerenciar seus planos, histórico de faturas e métodos de pagamento.
                    </p>
                    <a href="/plataforma/pagamentos" className="block">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl gap-2">
                        Abrir Financeiro
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {activeTab === "aparencia" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Personalização</h2>
                    <p className="text-sm text-muted-foreground">Ajuste a interface da plataforma conforme seu gosto.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div 
                      onClick={() => setTheme("dark")}
                      className={`aspect-video rounded-2xl border-2 flex items-center justify-center relative overflow-hidden group cursor-pointer transition-all ${
                        theme === "dark" 
                          ? "bg-primary/20 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.2)]" 
                          : "bg-muted border-border hover:border-primary/50"
                      }`}
                    >
                      <div className={`absolute inset-x-0 bottom-0 py-2 text-center text-[10px] font-bold uppercase tracking-widest transition-all ${
                        theme === "dark" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        Escuro
                      </div>
                      <Palette className={`w-8 h-8 transition-all ${theme === "dark" ? "text-primary scale-110" : "text-muted-foreground/30"}`} />
                    </div>
                    
                    <div 
                      onClick={() => setTheme("light")}
                      className={`aspect-video rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all ${
                        theme === "light" 
                          ? "bg-primary/10 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.1)]" 
                          : "bg-muted border-border hover:border-primary/50"
                      }`}
                    >
                       <div className={`absolute inset-x-0 bottom-0 py-2 text-center text-[10px] font-bold uppercase tracking-widest transition-all ${
                        theme === "light" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        Claro
                      </div>
                       <Palette className={`w-8 h-8 transition-all ${theme === "light" ? "text-primary scale-110" : "text-muted-foreground/30"}`} />
                    </div>

                    <div 
                      onClick={() => setTheme("system")}
                      className={`aspect-video rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all ${
                        theme === "system" 
                          ? "bg-primary/10 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.1)]" 
                          : "bg-muted border-border hover:border-primary/50"
                      }`}
                    >
                       <div className={`absolute inset-x-0 bottom-0 py-2 text-center text-[10px] font-bold uppercase tracking-widest transition-all ${
                        theme === "system" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        Sistema
                      </div>
                       <Settings className={`w-8 h-8 transition-all ${theme === "system" ? "text-primary scale-110" : "text-muted-foreground/30"}`} />
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
