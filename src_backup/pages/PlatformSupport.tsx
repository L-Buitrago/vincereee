import { Users, DollarSign, UserPlus, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PlatformSupport() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#0a0a0a] min-h-[calc(100vh-80px)] p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white font-display">Guia do Dashboard</h1>
          <p className="text-[#888]">Entenda como as métricas da Vincere Tech impulsionam seu negócio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#111] border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Clientes Ativos</h3>
            <p className="text-sm text-[#888] leading-relaxed">
              Mostra o número total de clientes que possuem uma assinatura ou contrato ativo. 
              É a base recorrente do seu negócio hoje.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111] border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Receita Total</h3>
            <p className="text-sm text-[#888] leading-relaxed">
              O valor bruto acumulado de todas as transações bem-sucedidas. 
              Monitorar isso ajuda a entender o crescimento financeiro ao longo do tempo.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111] border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-platform-orange/10 flex items-center justify-center text-platform-orange">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Leads Capturados</h3>
            <p className="text-sm text-[#888] leading-relaxed">
              Contatos interessados capturados automaticamente pela Vi (nossa IA) ou por formulários. 
              São suas oportunidades futuras de vendas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111] border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">CRM e Negociação</h3>
            <p className="text-sm text-[#888] leading-relaxed">
              Acompanhe em que estágio cada cliente está. Desde o primeiro contato até o fechamento. 
              Tudo organizado para você não perder nenhuma venda.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-600/20 to-transparent border border-violet-500/20 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Ainda tem dúvidas?</h3>
            <p className="text-[#888] text-sm max-w-md mx-auto">
              Fale diretamente com nosso suporte. Nossa equipe está pronta para te ajudar.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
             <button 
              onClick={() => navigate('/plataforma/mensagens?startChat=Ryan&category=support&tab=support')}
              className="flex items-center gap-3 bg-[#111] hover:bg-white/5 border border-white/10 p-4 rounded-xl transition-all hover:scale-105 w-full sm:w-48 group"
             >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg group-hover:bg-emerald-500/30 transition-colors">
                  R
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold">Ryan</p>
                  <p className="text-[#888] text-xs">Founder</p>
                </div>
             </button>
             
             <button 
              onClick={() => navigate('/plataforma/mensagens?startChat=Nathan&category=support&tab=support')}
              className="flex items-center gap-3 bg-[#111] hover:bg-white/5 border border-white/10 p-4 rounded-xl transition-all hover:scale-105 w-full sm:w-48 group"
             >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg group-hover:bg-blue-500/30 transition-colors">
                  N
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold">Nathan</p>
                  <p className="text-[#888] text-xs">Founder</p>
                </div>
             </button>

             <button 
              onClick={() => navigate('/plataforma/mensagens?startChat=Luis&category=support&tab=support')}
              className="flex items-center gap-3 bg-[#111] hover:bg-white/5 border border-white/10 p-4 rounded-xl transition-all hover:scale-105 w-full sm:w-48 group"
             >
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-lg group-hover:bg-violet-500/30 transition-colors">
                  L
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold">Luis</p>
                  <p className="text-[#888] text-xs">Founder</p>
                </div>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
