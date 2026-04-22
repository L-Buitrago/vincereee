import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { useMemo } from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationBell from "./NotificationBell";
import { ThemeToggle } from "./ThemeToggle";

interface PlatformHeaderProps {
  title?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function PlatformHeader({ title, searchQuery, setSearchQuery }: PlatformHeaderProps) {
  const { user } = useAuth();
  const { isAdmin, org } = useOrganization();

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário";
  const userAvatar = user?.user_metadata?.avatar_url;
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const planName = useMemo(() => {
    if (isAdmin) return "Admin";
    if (!org?.plan) return "Starter";
    const mapped: Record<string, string> = {
      free: "Starter",
      pro: "Pro",
      enterprise: "Enterprise"
    };
    return mapped[org.plan.toLowerCase()] || org.plan;
  }, [org, isAdmin]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const firstName = fullName.split(" ")[0];
  const headerTitle = (title === "Dashboard" || !title) ? `${greeting}, ${firstName}` : title;

  return (
    <header className="flex items-center justify-between p-6 px-8 bg-transparent sticky top-0 z-30 backdrop-blur-sm border-b border-border">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">
          {headerTitle} <span className="text-sky-500">.</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {setSearchQuery && (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="bg-muted/50 border-border pl-10 w-64 text-sm rounded-xl focus-visible:ring-sky-500 text-foreground"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell />

          <div className="flex items-center gap-4 pl-4 border-l border-border ml-2">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-foreground leading-none">{fullName}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{user?.email}</span>
              <Badge variant="outline" className="mt-1 h-5 text-[9px] uppercase tracking-widest font-bold border-sky-500/30 bg-sky-500/10 text-sky-500">
                {planName}
              </Badge>
            </div>
            <Avatar className="w-10 h-10 rounded-xl border border-border shadow-md">
              {userAvatar && <AvatarImage src={userAvatar} className="object-cover" />}
              <AvatarFallback className="bg-sky-500/20 text-sky-400 font-bold text-xs">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
