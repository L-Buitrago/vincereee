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
          <ShoppingBag className="w-6 h-6 text-[#888]" />
          <h1 className="text-2xl font-bold text-white">Minhas Compras</h1>
        </div>

        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-[#111] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#888]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{purchase.name}</p>
                  <p className="text-xs text-[#666]">{purchase.type} • {new Date(purchase.date).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase border ${statusColors[purchase.status]}`}>
                  {purchase.status}
                </span>
                <span className="text-sm font-bold text-white">
                  {purchase.status === "admin" ? "R$ 0,00" : formatCurrency(purchase.amount)}
                </span>
                <Button size="sm" variant="ghost" className="text-[#888] hover:text-white h-8 w-8 p-0">
                  {purchase.type === "Assinatura" ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {mockPurchases.length === 0 && (
          <div className="text-center py-16 text-[#555]">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhuma compra encontrada.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
