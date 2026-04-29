import { motion } from "framer-motion";
import { Check, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanFeature {
  name: string;
  starter: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

const features: PlanFeature[] = [
  { name: "Produtos / Vendas por mês", starter: "Até 100", pro: "Até 1000", enterprise: "Ilimitado" },
  { name: "Hospedagem de Alta Performance", starter: true, pro: true, enterprise: true },
  { name: "Certificado SSL Integrado", starter: true, pro: true, enterprise: true },
  { name: "Automação de WhatsApp", starter: false, pro: true, enterprise: true },
  { name: "Email Marketing Base", starter: true, pro: true, enterprise: true },
  { name: "Assistente IA (VI) no Site", starter: false, pro: true, enterprise: true },
  { name: "Recuperação de Carrinho Avançada", starter: false, pro: true, enterprise: true },
  { name: "Multi-idiomas / Internacional", starter: false, pro: false, enterprise: true },
  { name: "Infraestrutura Dedicada", starter: false, pro: false, enterprise: true },
  { name: "Suporte Técnico", starter: "Horário Coml.", pro: "Prioritário", enterprise: "Gerente 24/7" },
];

interface PricingComparisonTableProps {
  onSelectPlan: (planId: string) => void;
}

export default function PricingComparisonTable({ onSelectPlan }: PricingComparisonTableProps) {
  const renderCell = (value: string | boolean) => {
    if (typeof value === "string") return <span className="font-bold text-[13px] text-[#0f172a]">{value}</span>;
    return value ? (
      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-4 h-4 text-primary" />
      </div>
    ) : (
      <span className="text-gray-300 font-bold">-</span>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 py-4">
      {/* VI Header - Integrated Style */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xl shadow-sky-500/5 max-w-2xl mx-auto"
      >
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-base md:text-xl font-black text-[#0f172a] leading-tight tracking-tight">
            Ótimo! Para o plano padrão, <span className="text-primary italic">qual nível de operação você busca?</span>
          </h3>
        </div>
      </motion.div>

      {/* Comparison Table - Light Bento Style */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse table-fixed">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="w-[28%] px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Plano Vincere</th>
                <th className="px-4 py-5 font-display">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-[#0f172a]">Starter</span>
                    <span className="text-[10px] font-black text-gray-400 mt-0.5 uppercase tracking-widest">R$ 197/mês</span>
                  </div>
                </th>
                <th className="px-4 py-5 bg-sky-50/30 relative">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-[8px] font-black text-white uppercase tracking-widest rounded-b-lg shadow-lg shadow-primary/20 whitespace-nowrap">Mais Popular</div>
                   <div className="flex flex-col">
                    <span className="text-lg font-black text-primary">Pro</span>
                    <span className="text-[10px] font-black text-primary/60 mt-0.5 uppercase tracking-widest italic">R$ 297/mês</span>
                  </div>
                </th>
                <th className="px-4 py-5">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-[#0f172a]">Enterprise</span>
                    <span className="text-[10px] font-black text-gray-400 mt-0.5 uppercase tracking-widest">R$ 597/mês</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {features.map((feature, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-3 text-left">
                    <span className="text-[13.5px] font-bold text-gray-500 group-hover:text-[#0f172a] transition-colors">{feature.name}</span>
                  </td>
                  <td className="px-4 py-3">{renderCell(feature.starter)}</td>
                  <td className="px-4 py-3 bg-sky-50/10">{renderCell(feature.pro)}</td>
                  <td className="px-4 py-3">{renderCell(feature.enterprise)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-8 py-6"></td>
                <td className="px-4 py-6">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 bg-white border-gray-200 hover:border-primary/30 hover:bg-sky-50/30 text-[#0f172a] font-black text-[10.5px] uppercase tracking-widest rounded-xl transition-all"
                    onClick={() => onSelectPlan("platform_starter")}
                  >
                    Escolher Starter
                  </Button>
                </td>
                <td className="px-4 py-6 bg-sky-50/30">
                  <Button 
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black text-[10.5px] uppercase tracking-widest rounded-xl shadow-xl shadow-primary/25 transition-all hover:scale-105"
                    onClick={() => onSelectPlan("platform_pro")}
                  >
                    Escolher Pro
                  </Button>
                </td>
                <td className="px-4 py-6">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 bg-white border-gray-200 hover:border-primary/30 hover:bg-sky-50/30 text-[#0f172a] font-black text-[10.5px] uppercase tracking-widest rounded-xl transition-all"
                    onClick={() => onSelectPlan("platform_enterprise")}
                  >
                    Escolher Enterprise
                  </Button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

      {/* Clean Light Indicator */}
      <div className="flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${i === 3 ? "w-12 bg-primary" : "w-2 bg-gray-200"}`} 
          />
        ))}
      </div>
    </div>
  );
}
