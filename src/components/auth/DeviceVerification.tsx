
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/hooks/use-device-id";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, Mail } from "lucide-react";

interface DeviceVerificationProps {
  onVerified: () => void;
  onCancel: () => void;
}

export const DeviceVerification = ({ onVerified, onCancel }: DeviceVerificationProps) => {
  const { user, signOut } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast({ title: "Código incompleto", description: "Por favor, insira o código de 6 dígitos.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("vincere-2fa", {
        body: { 
          action: "verify", 
          userId: user?.id, 
          code, 
          deviceId: getDeviceId() 
        },
      });

      if (error || data?.error) {
        throw new Error(data?.error || error.message);
      }

      toast({ title: "Dispositivo autorizado!", description: "Seu dispositivo foi verificado com sucesso." });
      onVerified();
    } catch (err: any) {
      toast({ title: "Erro na verificação", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { error } = await supabase.functions.invoke("vincere-2fa", {
        body: { 
          action: "send", 
          userId: user?.id, 
          email: user?.email, 
          deviceId: getDeviceId() 
        },
      });

      if (error) throw error;
      toast({ title: "Código enviado", description: "Um novo código foi enviado para seu e-mail." });
    } catch (err: any) {
      toast({ title: "Erro ao reenviar", description: err.message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <Card className="w-full max-w-md border-primary/20 bg-black/90">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Verificação de Segurança</CardTitle>
          <CardDescription>
            Identificamos um novo dispositivo. Enviamos um código de confirmação para:
            <span className="block font-medium text-white mt-1">{user?.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={(value) => setCode(value)}
            render={({ slots }) => (
              <InputOTPGroup className="gap-2">
                {slots.map((slot, index) => (
                  <InputOTPSlot key={index} {...slot} className="w-12 h-14 text-lg border-primary/20 bg-primary/5 focus:ring-primary" />
                ))}
              </InputOTPGroup>
            )}
          />

          <div className="w-full space-y-3">
            <Button 
              onClick={handleVerify} 
              className="w-full bg-primary text-black hover:bg-primary/90 font-bold" 
              disabled={loading || code.length !== 6}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verificar Dispositivo
            </Button>
            
            <div className="flex items-center justify-between gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleResend} 
                disabled={resending}
                className="text-xs text-muted-foreground hover:text-white"
              >
                {resending ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Mail className="mr-2 h-3 w-3" />}
                Reenviar e-mail
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Sair da conta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
