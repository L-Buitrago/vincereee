import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

function generateSessionId() {
  return crypto.randomUUID();
}

const ALLOWED_MARKDOWN_ELEMENTS = ['p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'code', 'pre', 'br', 'h1', 'h2', 'h3'];

const ChatWidget = forwardRef<HTMLDivElement>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { 
      role: "assistant", 
      content: "Olá, tudo bem? Eu sou sua assistente Vi. Como posso ajudar?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const allMessages = [...messages, userMsg];

    try {
      console.log("[Vi Chat] Sending message via supabase.functions.invoke...");
      
      // Criar um timeout de segurança (30s)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout: A requisição demorou mais de 30 segundos.")), 30000);
      });

      const invokePromise = supabase.functions.invoke("chat", {
        body: {
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          sessionId: sessionId,
          model: "gemini-2.0-flash",
          stream: false,
        },
      });

      console.log("[Vi Chat] Waiting for response...");
      const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;
      console.log("[Vi Chat] Response received:", { data, error });

      if (error) {
        console.error("[Vi Chat] Supabase function error:", error);
        throw error;
      }

      console.log("[Vi Chat] Raw response data:", data);

      let reply = "";

      // Handle various response formats (Supabase invoke can return different things)
      if (data && typeof data === 'object') {
        if (data.reply) {
          reply = data.reply;
        } else if (data.choices?.[0]?.message?.content) {
          reply = data.choices[0].message.content;
        } else if (data.choices?.[0]?.delta?.content) {
          reply = data.choices[0].delta.content;
        } else {
          if (data.error) throw new Error(data.error);
          
          const possibleSse = data.reply || data.text || "";
          if (typeof possibleSse === 'string' && possibleSse.includes("data: ")) {
            const lines = possibleSse.split("\n");
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ") && trimmed !== "data: [DONE]") {
                try {
                  const chunk = JSON.parse(trimmed.slice(6));
                  reply += chunk?.choices?.[0]?.delta?.content || "";
                } catch {}
              }
            }
          }
        }
      } else if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          reply = parsed.reply || parsed.choices?.[0]?.message?.content || "";
        } catch {
          if (data.includes("data: ")) {
            const lines = data.split("\n");
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ") && trimmed !== "data: [DONE]") {
                try {
                  const chunk = JSON.parse(trimmed.slice(6));
                  reply += chunk?.choices?.[0]?.delta?.content || "";
                } catch {}
              }
            }
          } else {
            reply = data;
          }
        }
      }

      if (!reply || reply.trim() === "") {
        console.error("[Vi Chat] Could not extract reply from data:", data);
        throw new Error("Resposta vazia da IA");
      }

      // Clean [CONTACT_REQUEST] tags from display (backend handles lead saving)
      const cleanReply = reply.replace(/\[CONTACT_REQUEST\]\s*\{[\s\S]*?\}/g, "").trim();
      
      console.log("[Vi Chat] Final reply length:", cleanReply.length);
      setMessages(prev => [...prev, { role: "assistant", content: cleanReply }]);
    } catch (e) {
      console.error("[Vi Chat] Error:", e);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Desculpe, ocorreu um erro ao me conectar. Pode tentar de novo?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={ref}>
      {/* Floating buttons */}
      {!open && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-3 items-end">
          <button
            onClick={() => setOpen(true)}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 opacity-80 md:opacity-100"
            aria-label="Abrir chat"
          >
            <Bot className="h-5 w-5 md:h-6 md:w-6" />
          </button>

        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-display font-semibold text-sm">Vi</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-secondary-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0">
                      <ReactMarkdown allowedElements={ALLOWED_MARKDOWN_ELEMENTS} unwrapDisallowed>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border px-3 py-2">
            <form
              onSubmit={e => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                disabled={!input.trim() || isLoading}
                className="h-8 w-8 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

ChatWidget.displayName = "ChatWidget";

export default ChatWidget;
