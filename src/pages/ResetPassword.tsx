import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, KeyRound, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    
    // Valid if hash contains access_token and type=recovery OR type=recovery is in search OR PKCE code
    const hasRecoveryParams = 
      hash.includes("type=recovery") || 
      search.includes("type=recovery") || 
      hash.includes("access_token") || 
      search.includes("code=");

    if (hasRecoveryParams) {
      setValid(true);
      setChecking(false);
      return;
    }

    // Check if Supabase client already established session from the URL token
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setValid(true);
      }
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setValid(true);
        setChecking(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Senha curta", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Senhas não coincidem", description: "Por favor, digite a mesma senha nos dois campos.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    
    if (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Sua senha foi redefinida com sucesso." });
      // Redirect to platform dashboard
      setTimeout(() => navigate("/plataforma/dashboard"), 1200);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Validando link de recuperação...</p>
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center space-y-6"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter text-white font-display">Link Inválido ou Expirado</h1>
            <p className="text-gray-400 text-sm">
              Este link de redefinição expirou, já foi utilizado ou foi aberto em outro navegador.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Button 
              onClick={() => navigate("/auth")}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-6 rounded-xl"
            >
              Solicitar novo link
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              Voltar ao início
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-400/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 border border-sky-500/20">
              <KeyRound className="w-8 h-8 text-sky-400" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white font-display mb-2">Redefinir Senha</h1>
            <p className="text-gray-400 text-sm">Crie uma nova senha forte para proteger sua conta Vincere.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="new-password" style={{ color: '#999', fontSize: '12px' }} className="uppercase tracking-widest font-bold">Nova senha</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={6}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white h-12 focus:ring-sky-500/50 focus:border-sky-500 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" style={{ color: '#999', fontSize: '12px' }} className="uppercase tracking-widest font-bold">Confirmar nova senha</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                minLength={6}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white h-12 focus:ring-sky-500/50 focus:border-sky-500 rounded-xl"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-sky-500 text-white hover:bg-sky-600 font-bold rounded-xl flex items-center justify-center gap-2 group transition-all duration-300 shadow-lg shadow-sky-500/15 mt-2" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Atualizar Senha
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Sua conta está protegida por criptografia de ponta.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
