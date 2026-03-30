import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileText, FolderKanban, MessageSquare, Users, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      setLoading(true);
      const [quotesRes, projectsRes, contactsRes, chatRes, leadsRes] = await Promise.all([
        supabase.from("quotes").select("*").order("created_at", { ascending: false }),
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_requests" as any).select("*").order("created_at", { ascending: false }),
        supabase.from("chat_messages" as any).select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("vi_leads" as any).select("*").order("created_at", { ascending: false })
      ]);

      setQuotes(quotesRes.data || []);
      setProjects(projectsRes.data || []);
      setContacts(contactsRes.data || []);
      setLeads(leadsRes.data || []);

      // Group chat messages by session_id
      const sessions: Record<string, any[]> = {};
      (chatRes.data || []).forEach((msg: any) => {
        if (!sessions[msg.session_id]) sessions[msg.session_id] = [];
        sessions[msg.session_id].push(msg);
      });
      setChatSessions(
        Object.entries(sessions).map(([id, msgs]) => ({
          session_id: id,
          messages: msgs.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
          last_message: msgs[msgs.length - 1]?.created_at,
        }))
      );
      setLoading(false);
    };

    fetchData();
  }, [isAdmin]);

  if (adminLoading || (!isAdmin && !adminLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400",
      approved: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400",
      in_progress: "bg-blue-500/20 text-blue-400",
      completed: "bg-green-500/20 text-green-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="font-display text-2xl font-bold mb-6">Painel Administrativo</h1>

        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="leads" className="flex items-center gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5" /> Leads (Vi)
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" /> Contatos
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" /> Orçamentos
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-1.5 text-xs">
              <FolderKanban className="h-3.5 w-3.5" /> Projetos
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center gap-1.5 text-xs">
              <MessageSquare className="h-3.5 w-3.5" /> Conversas
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <TabsContent value="leads">
                <div className="space-y-3">
                  {leads.length === 0 && <p className="text-muted-foreground text-sm">Nenhum lead capturado ainda.</p>}
                  {leads.map((l: any) => (
                    <div key={l.id} className="p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-semibold text-sm">{l.name}</span>
                        <span className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("pt-BR")}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Email: {l.email}</p>
                      <p className="text-xs text-muted-foreground">Telefone: {l.phone}</p>
                      {l.company && <p className="text-xs text-muted-foreground">Empresa: {l.company}</p>}
                      {l.needs && (
                        <div className="mt-2 text-xs bg-muted/50 p-2 rounded border border-border">
                          <span className="font-semibold block mb-1">Necessidades:</span>
                          {l.needs}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="contacts">
                <div className="space-y-3">
                  {contacts.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma solicitação ainda.</p>}
                  {contacts.map((c: any) => (
                    <div key={c.id} className="p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-semibold text-sm">{c.customer_name || "Anônimo"}</span>
                        {statusBadge(c.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">Serviço: {c.service_type}</p>
                      {c.customer_phone && <p className="text-xs text-muted-foreground">Tel: {c.customer_phone}</p>}
                      {c.customer_email && <p className="text-xs text-muted-foreground">Email: {c.customer_email}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(c.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="quotes">
                <div className="space-y-3">
                  {quotes.length === 0 && <p className="text-muted-foreground text-sm">Nenhum orçamento.</p>}
                  {quotes.map((q: any) => (
                    <div key={q.id} className="p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-semibold text-sm">{(q as any).profiles?.full_name || "—"}</span>
                        {statusBadge(q.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">Tipo: {q.service_type}</p>
                      {q.description && <p className="text-xs text-muted-foreground mt-1">{q.description}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(q.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <div className="space-y-3">
                  {projects.length === 0 && <p className="text-muted-foreground text-sm">Nenhum projeto.</p>}
                  {projects.map((p: any) => (
                    <div key={p.id} className="p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-semibold text-sm">{p.title}</span>
                        {statusBadge(p.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">Cliente: {(p as any).profiles?.full_name || "—"}</p>
                      {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="chats">
                <div className="space-y-3">
                  {chatSessions.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma conversa.</p>}
                  {chatSessions.map((session) => (
                    <details key={session.session_id} className="rounded-xl border border-border bg-card/50">
                      <summary className="p-4 cursor-pointer font-display text-sm font-medium">
                        Sessão: {session.session_id.slice(0, 8)}... ({session.messages.length} msgs)
                        <span className="text-xs text-muted-foreground ml-2">
                          {new Date(session.last_message).toLocaleString("pt-BR")}
                        </span>
                      </summary>
                      <div className="px-4 pb-4 space-y-2 max-h-60 overflow-y-auto">
                        {session.messages.map((msg: any) => (
                          <div
                            key={msg.id}
                            className={`text-xs p-2 rounded-lg ${
                              msg.role === "user" ? "bg-primary/10 text-foreground" : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            <span className="font-semibold">{msg.role === "user" ? "Cliente" : "Bot"}:</span>{" "}
                            {msg.content.slice(0, 300)}{msg.content.length > 300 ? "..." : ""}
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
