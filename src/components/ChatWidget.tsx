import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
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
      content: "Olá, seja bem-vindo à **Vincere**. Sou a Vi, sua assistente. Você está buscando uma plataforma de gestão ou um site/loja virtual?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { orgId } = useOrganization();

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

  const extractContactRequest = (content: string) => {
    const match = content.match(/\[CONTACT_REQUEST\]\s*(\{[\s\S]*?\})/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch {
        return null;
      }
    }
    return null;
  };

  const saveContactRequest = async (data: {
    service_type: string;
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
  }) => {
    try {
      console.log("Saving contact request for session:", sessionId);
      
      // 1. Save to old contact_requests table
      const { error: contactError } = await supabase.from("contact_requests" as any).insert({
        session_id: sessionId,
        service_type: data.service_type,
        customer_name: data.customer_name || null,
        customer_phone: data.customer_phone || null,
        customer_email: data.customer_email || null,
        message: messages.map(m => `${m.role}: ${m.content}`).join("\n"),
        status: "pending",
      });

      if (contactError) {
        console.warn("Error saving to contact_requests:", contactError.message);
      }

      // 2. Save to CRM customers table as a Lead
      if (data.customer_name) {
        const payload: any = {
          name: data.customer_name,
          phone: data.customer_phone || null,
          status: "Lead",
          org_id: orgId || null // Associate with current org if user is logged into the platform
        };

        if (data.customer_email) {
          payload.email = data.customer_email;
        } else {
          payload.email = `lead_${sessionId.substring(0, 8)}@vincere.temp`;
        }

        const { error: customerError } = await supabase
          .from("customers" as any)
          .upsert(payload, { onConflict: 'email' });

        if (customerError) {
          console.error("Critical error saving customer lead:", customerError.message);
        } else {
          console.log("Lead successfully saved to CRM");
        }
      }
    } catch (err) {
      console.error("Unexpected error in saveContactRequest:", err);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const allMessages = [...messages, userMsg];

    try {
      console.log("[Vi Chat] Sending message via direct fetch...");
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const res = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`,
          "apikey": supabaseKey,
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          model: "gemini-2.0-flash",
          stream: false,
        }),
      });

      console.log("[Vi Chat] Response status:", res.status);
      console.log("[Vi Chat] Content-Type:", res.headers.get("content-type"));

      if (!res.ok) {
        const errText = await res.text();
        console.error("[Vi Chat] API error:", res.status, errText);
        throw new Error(`Erro ${res.status}: ${errText}`);
      }

      let reply = "";
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream") || contentType.includes("text/plain")) {
        // SSE streaming response - parse chunks
        const rawText = await res.text();
        console.log("[Vi Chat] SSE raw response length:", rawText.length);
        
        const lines = rawText.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ") && trimmed !== "data: [DONE]") {
            try {
              const chunk = JSON.parse(trimmed.slice(6));
              const delta = chunk?.choices?.[0]?.delta?.content;
              if (delta) {
                reply += delta;
              }
            } catch {
              // Skip unparseable lines (like ": OPENROUTER PROCESSING")
            }
          }
        }
      } else {
        // Standard JSON response
        const data = await res.json();
        console.log("[Vi Chat] JSON response:", data);
        reply = data?.reply || data?.choices?.[0]?.message?.content || "";
      }
      
      if (!reply) {
        console.error("[Vi Chat] Empty reply from API");
        throw new Error("Resposta vazia da IA");
      }

      console.log("[Vi Chat] Final reply:", reply.substring(0, 100) + "...");
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);

      // Check for contact request in the final response
      const contactData = extractContactRequest(reply);
      if (contactData) {
        await saveContactRequest(contactData);
        // Clean the tag from displayed message
        const cleanContent = reply.replace(/\[CONTACT_REQUEST\]\s*\{[\s\S]*?\}/, "").trim();
        setMessages(prev =>
          prev.map((m, i) =>
            i === prev.length - 1 && m.role === "assistant"
              ? { ...m, content: cleanContent }
              : m
          )
        );
      }
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
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
          <button
            onClick={() => setOpen(true)}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105"
            aria-label="Abrir chat"
          >
            <Bot className="h-6 w-6" />
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
