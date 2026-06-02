import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, CreditCard, Lock } from "lucide-react";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const planName = searchParams.get("plan") || "Plano Vincere";
  const priceString = searchParams.get("price") || "0";
  const priceAmount = parseFloat(priceString);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");

  // Pre-fill if user is logged in
  useEffect(() => {
    if (user) {
      setCustomerEmail(user.email || "");
      if (user.user_metadata?.full_name) {
        setCustomerName(user.user_metadata.full_name);
      }
    }
  }, [user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !cpfCnpj) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Get the current org ID if logged in, otherwise empty string
      let orgId = "";
      if (user) {
        const { data: memberData } = await supabase
          .from('org_members')
          .select('org_id')
          .eq('user_id', user.id)
          .single();
        if (memberData) orgId = memberData.org_id;
      }

      // Format CPF/CNPJ (remove non-digits)
      const cleanCpfCnpj = cpfCnpj.replace(/\D/g, "");

      const payload = {
        planName,
        priceAmount,
        paymentType: "vincere_checkout",
        orgId,
        customerName,
        customerEmail,
        cpfCnpj: cleanCpfCnpj
      };

      const { data, error } = await supabase.functions.invoke("create-asaas-checkout", {
        body: payload,
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data && data.invoiceUrl) {
        toast({ title: "Redirecionando para pagamento seguro...", description: "Aguarde..." });
        // Redirect the user to the Asaas payment page
        window.location.href = data.invoiceUrl;
      } else {
        throw new Error("Não foi possível gerar o link de pagamento.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({ title: "Erro ao gerar pagamento", description: err.message, variant: "destructive" });
      setLoading(false);
    }
  };

  if (priceAmount <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center py-8">
          <CardTitle className="text-xl mb-4">Produto Inválido</CardTitle>
          <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Order Summary */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-black tracking-tight text-foreground mb-2">Finalizar Pedido</h1>
            <p className="text-muted-foreground">Você está a um passo de acelerar seu negócio.</p>
          </div>

          <div className="bg-white dark:bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-border">
              <div>
                <h3 className="font-bold text-lg text-foreground">{planName}</h3>
                <p className="text-sm text-muted-foreground">Pagamento único / Assinatura</p>
              </div>
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-muted-foreground">Total a pagar</span>
              <span className="text-3xl font-black text-foreground tracking-tighter">{formatCurrency(priceAmount)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <p>Seus dados estão protegidos. Você será redirecionado para o ambiente seguro do Asaas.</p>
          </div>
        </div>

        {/* Checkout Form */}
        <Card className="border-border shadow-xl rounded-3xl overflow-hidden bg-card/80 backdrop-blur-xl">
          <CardHeader className="bg-muted/30 pb-6 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lock className="w-4 h-4 text-muted-foreground" />
              Dados do Comprador
            </CardTitle>
            <CardDescription>Preencha os dados abaixo para gerar sua cobrança.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleCheckout} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nome Completo / Razão Social</Label>
                <Input 
                  id="customerName" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  required 
                  placeholder="Seu nome ou da empresa" 
                  className="h-12 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">E-mail</Label>
                <Input 
                  id="customerEmail" 
                  type="email" 
                  value={customerEmail} 
                  onChange={(e) => setCustomerEmail(e.target.value)} 
                  required 
                  placeholder="seu@email.com" 
                  className="h-12 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF / CNPJ</Label>
                <Input 
                  id="cpfCnpj" 
                  value={cpfCnpj} 
                  onChange={(e) => setCpfCnpj(e.target.value)} 
                  required 
                  placeholder="000.000.000-00" 
                  className="h-12 bg-background"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 mt-4 font-bold text-base shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" 
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...</>
                ) : (
                  <>Ir para o Pagamento Seguro</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
