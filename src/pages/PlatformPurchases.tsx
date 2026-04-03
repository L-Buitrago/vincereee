import { motion } from "framer-motion";
import { ShoppingBag, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/data/platformMockData";
import { useOrganization } from "@/hooks/useOrganization";

const mockPurchases = [
  { id: "PUR-001", name: "Plano Pro — Vincere", date: "2026-03-01", amount: 197, status: "ativo", type: "Assinatura" },
];

const statusColors: Record<string, string> = {
  ativo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  entregue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  pendente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  admin: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

export default function PlatformPurchases() {
  const { isAdmin } = useOrganization();
  
  const purchases = isAdmin 
    ? [{ id: "ADM-001", name: "Plano Administrador", date: new Date().toISOString(), amount: 0, status: "admin", type: "Admin" }]
    : mockPurchases;

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-6 h-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Minhas Compras</h1>
        </div>

        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between hover:border-primary/20 transition-colors shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{purchase.name}</p>
                  <p className="text-xs text-muted-foreground/60">{purchase.type} • {new Date(purchase.date).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase border ${statusColors[purchase.status]}`}>
                  {purchase.status}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {purchase.status === "admin" ? "R$ 0,00" : formatCurrency(purchase.amount)}
                </span>
                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
                  {purchase.type === "Assinatura" ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {mockPurchases.length === 0 && (
          <div className="text-center py-16 text-muted-foreground/50">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhuma compra encontrada.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
