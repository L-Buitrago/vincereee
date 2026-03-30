import { useState } from "react";
import { X, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  priceAmount: number;
}

export function CheckoutModal({ isOpen, onClose, planName, priceAmount }: CheckoutModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [cpfCnpj, setCpfCnpj] = useState("");
  const { user } = useAuth();

  const handleAsaasCheckout = async () => {
    if (!cpfCnpj || cpfCnpj.length < 11) {
      toast.error("Por favor, insira um CPF ou CNPJ válido.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-asaas-checkout', {
        body: { 
          planName, 
          priceAmount, 
          customerName: user?.user_metadata?.full_name || user?.email?.split('@')[0],
          customerEmail: user?.email,
          cpfCnpj 
        }
      });

      if (error || !data?.invoiceUrl) {
        throw new Error(error?.message || data?.error || "Falha ao gerar link de pagamento.");
      }

      // Redirect user to Asaas checkout
      window.location.href = data.invoiceUrl;
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Erro ao comunicar com o servidor de pagamento.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col relative border border-white/5">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Finalizar Assinatura</h2>
              <p className="text-xs text-[#888]">Plano {planName} — R$ {priceAmount}/mês</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-[#888]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium text-[#ccc]">CPF ou CNPJ para emissão</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                className="bg-white/5 border-white/5 text-white h-12 focus-visible:ring-violet-500"
              />
              <p className="text-[10px] text-[#666]">O Asaas exige este dado para gerar cobranças via Pix e Cartão.</p>
            </div>
          </div>

          <Button 
            onClick={handleAsaasCheckout} 
            disabled={loading}
            className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-bold gap-2 text-base shadow-lg shadow-violet-600/20"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Pagar com Asaas (Pix/Cartão)</>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-[#444]">
            <ShieldCheck className="w-3 h-3" />
            <span>Pagamento processado com segurança pelo Asaas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
