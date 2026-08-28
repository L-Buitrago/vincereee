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

  // Track if we already saved a lead this session to avoid duplicates
  const leadSavedRef = useRef(false);

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

  // Fallback: scan the entire conversation for name, phone and email
  const extractLeadFromConversation = (allMsgs: Msg[]) => {
    const userTexts = allMsgs.filter(m => m.role === "user").map(m => m.content);
    const fullText = userTexts.join(" ");

    // Extract phone: Brazilian formats like (11)99999-9999, 11999999999, +5511999999999
    const phoneMatch = fullText.match(/(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}[\s.-]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0].trim() : null;

    // Extract email
    const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0].trim() : null;

    // Extract name: the first short user message (2-4 words, no numbers, no @) is likely a name
    let name: string | null = null;
    for (const msg of userTexts) {
      const clean = msg.trim();
      // Skip if it looks like a phone, email, or very long message
      if (clean.match(/\d{4,}/) || clean.includes("@") || clean.split(/\s+/).length > 5 || clean.length > 60) continue;
      // Skip common greetings / short words that aren't names
      const lower = clean.toLowerCase();
      if (["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "sim", "não", "nao", "ok", "obrigado", "obrigada", "site", "dashboard", "plataforma", "loja", "automação", "automacao"].includes(lower)) continue;
      // Likely a name if 1-4 words, all letters
      if (clean.match(/^[A-Za-zÀ-ÿ\s]{2,50}$/) && clean.split(/\s+/).length <= 4) {
        name = clean;
        break;
      }
    }

    if (!name && !phone && !email) return null;
    return { customer_name: name, customer_phone: phone, customer_email: email, service_type: "chat_lead" };
  };

  const saveContactRequest = async (data: {
    service_type: string;
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
  }) => {
    try {
      console.log("[Vi Chat] Saving contact request for session:", sessionId, data);
      leadSavedRef.current = true;
      
      // 1. Save to contact_requests table (conversation log)
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

      // 2. Save to vi_leads table (always, for admin visibility)
      if (data.customer_name) {
        const { error: viError } = await supabase.from("vi_leads" as any).insert({
          name: data.customer_name,
          email: data.customer_email || `chat_${sessionId.substring(0, 8)}@vincere.temp`,
          phone: data.customer_phone || "Não informado",
          needs: `[Via Chat Vi]\nServiço: ${data.service_type}\n\n${messages.map(m => `${m.role}: ${m.content}`).join("\n")}`,
        });

        if (viError) {
          console.warn("Error saving to vi_leads:", viError.message);
        } else {
          console.log("[Vi Chat] Lead saved to vi_leads ✅");
        }
      }

      // 3. Save to CRM customers table as a Lead
      if (data.customer_name) {
        const payload: any = {
          name: data.customer_name,
          phone: data.customer_phone || "Não informado",
          status: "Lead",
          org_id: null,
          email: data.customer_email || `lead_${sessionId.substring(0, 8)}@vincere.temp`
        };

        const { error: customerError } = await supabase
          .from("customers" as any)
          .insert(payload);

        if (customerError) {
          console.warn("Error saving customer lead (table insert):", customerError.message);
        } else {
          console.log("[Vi Chat] Lead saved to CRM customers ✅");
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
      console.log("[Vi Chat] Sending message via supabase.functions.invoke...");
      
      // Criar um timeout de segurança (30s)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout: A requisição demorou mais de 30 segundos.")), 30000);
      });

      const invokePromise = supabase.functions.invoke("chat", {
        body: {
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
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
          // It's a single chunk?
          reply = data.choices[0].delta.content;
        } else {
          // Maybe it's an error object?
          if (data.error) throw new Error(data.error);
          
          // Try to see if it's an SSE string returned as a field
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
        // If it's a raw string, it might be JSON or SSE
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

      console.log("[Vi Chat] Final reply length:", reply.length);
      const updatedMessages: Msg[] = [...allMessages, { role: "assistant", content: reply }];
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
      } else if (!leadSavedRef.current) {
        // FALLBACK: IA didn't emit tag — try to extract lead data from conversation
        const fallbackData = extractLeadFromConversation(updatedMessages);
        if (fallbackData && fallbackData.customer_name) {
          console.log("[Vi Chat] Fallback lead extraction found:", fallbackData);
          await saveContactRequest(fallbackData);
        }
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
