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
      content: "Oi! 👋 Sou a **Vi**, a inteligência artificial da Vincere! Tô aqui pra te ajudar a escalar seu negócio. 🚀\n\nPosso tirar suas dúvidas sobre:\n- **Checkout e Vendas Online**\n- **Área de Membros**\n- **Automações de WhatsApp**\n- **Gestão de Pagamentos**\n\nComo posso te ajudar hoje?",
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
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/plataforma" className="p-2 rounded-lg hover:bg-white/5 text-[#888] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div>
              <p className="text-sm font-semibold text-white">Vincere Assist</p>
              <p className="text-[10px] text-violet-400">Online</p>
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
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-violet-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-platform-purple text-white rounded-br-md"
                    : "bg-[#111] border border-white/5 text-[#ddd] rounded-bl-md"
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
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-violet-400" />
              </div>
              <div className="p-4 rounded-2xl rounded-bl-md bg-[#111] border border-white/5">
                <Loader2 className="w-4 h-4 animate-spin text-[#888]" />
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
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#ccc] hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-violet-400 transition-all"
            >
              Fechar plano {plan} →
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/5 bg-[#0A0A0A] sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#666] focus:outline-none focus:border-purple-500/30 transition-colors"
              disabled={loading}
            />
            <Button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-platform-purple hover:bg-platform-purple/90 text-white h-[46px] w-[46px] p-0 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
