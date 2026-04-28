import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, ArrowLeft, Bot, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const ALLOWED_ELEMENTS = ["p", "strong", "em", "ul", "ol", "li", "a", "code", "pre", "br", "h1", "h2", "h3"];

const WHATSAPP_NUMBER = "5511999999999";

export default function PlatformProposal() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Olá! Sou a **Vi**, sua assistente. Como posso ajudar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const { data, error } = await supabase.functions.invoke("platform-proposal", {
        body: { messages: [...messages, userMsg] },
      });

      clearTimeout(timeout);

      if (error) throw error;

      const reply = data?.reply || "Desculpe, tive um problema ao processar sua mensagem. Tente novamente.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e: any) {
      clearTimeout(timeout);
      console.error(e);
      const errorMsg = e?.name === "AbortError"
        ? "A resposta demorou muito. Tente uma mensagem mais curta."
        : "Ocorreu um erro. Tente novamente em instantes.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const goToWhatsApp = (plan: string) => {
    const msg = encodeURIComponent(
      `Olá! Vim pelo site da Vincere e tenho interesse no plano ${plan}. Gostaria de mais informações para fechar!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/plataforma" className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div>
              <p className="text-sm font-semibold text-foreground">Vi</p>
              <p className="text-[10px] text-sky-400">Online</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4 text-sky-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-sky-500 text-white rounded-br-md"
                    : "bg-card border border-border text-foreground/90 rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown allowedElements={ALLOWED_ELEMENTS} unwrapDisallowed>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <User className="w-4 h-4 text-foreground/70" />
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 text-sky-400" />
              </div>
              <div className="p-4 rounded-2xl rounded-bl-md bg-card border border-border shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground/40" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Quick Plan Buttons */}
      <div className="max-w-3xl mx-auto px-4 pb-2 w-full">
        <div className="flex flex-wrap gap-2">
          {["Starter", "Pro", "Enterprise"].map((plan) => (
            <button
              key={plan}
              onClick={() => goToWhatsApp(plan)}
              className="px-3 py-1.5 rounded-lg bg-muted border border-border text-xs text-muted-foreground hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-400 transition-all font-medium"
            >
              Fechar plano {plan} →
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-sky-500/30 transition-colors shadow-inner"
              disabled={loading}
            />
            <Button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-sky-500 hover:bg-sky-600 text-white h-[46px] w-[46px] p-0 rounded-xl shadow-lg transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
