import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  MessageSquare, 
  Zap, 
  Layout, 
  ShoppingCart, 
  Server, 
  ChevronRight, 
  Check, 
  Sparkles,
  Bot,
  TrendingDown,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PricingComparisonTable from "./PricingComparisonTable";

type Step = {
  id: string;
  question: string;
  options: Option[];
};

type Option = {
  label: string;
  value: string;
  icon?: any;
  description?: string;
  priceImpact?: number;
  nextStep?: string;
};

const VI_PRICES = {
  landing_page: 897,
  site_institucional: 1497,
  ecommerce: 2497,
  platform_starter: 97,
  platform_pro: 197,
  platform_enterprise: 497,
};

const ViExperienceSurvey = ({ onComplete }: { onComplete?: () => void }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<number[]>([0]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadingText, setLoadingText] = useState("Conectando com a VI...");
  const [isViTyping, setIsViTyping] = useState(false);
  const [customProjectDescription, setCustomProjectDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });

  useEffect(() => {
    const sequence = [
      { text: "Iniciando Core da VI...", delay: 600 },
      { text: "Conectando com a VI...", delay: 1200 },
      { text: "Preparando ambiente lógico...", delay: 1900 },
      { text: "Tudo pronto.", delay: 2400 },
    ];

    sequence.forEach((step, index) => {
      setTimeout(() => {
        setLoadingText(step.text);
        if (index === sequence.length - 1) {
          setTimeout(() => setIsInitializing(false), 600);
        }
      }, step.delay);
    });
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    {
      id: "interest",
      question: "Olá! Eu sou a VI, sua assistente. Como posso impulsionar seu negócio hoje?",
      options: [
        { label: "Quero um Site ou Loja Virtual", value: "services", icon: Layout, description: "Projetos profissionais de desenvolvimento.", nextStep: "service_type" },
        { label: "Quero Assinar a Plataforma", value: "platform", icon: Server, description: "Acesso ao nosso dashboard exclusivo.", nextStep: "platform_type" },
      ],
    },
    {
      id: "service_type",
      question: "Excelente escolha! Para entendermos melhor o que você precisa, que tipo de projeto você busca?",
      options: [
        { label: "Landing Page", value: "landing_page", priceImpact: VI_PRICES.landing_page, icon: Zap, description: "Foco total em conversão rápida.", nextStep: "custom_survey_focus" },
        { label: "Site Institucional", value: "site_institucional", priceImpact: VI_PRICES.site_institucional, icon: Layout, description: "Autoridade e múltiplas páginas.", nextStep: "custom_survey_focus" },
        { label: "Loja Virtual", value: "ecommerce", priceImpact: VI_PRICES.ecommerce, icon: ShoppingCart, description: "Venda produtos com facilidade.", nextStep: "custom_survey_focus" },
      ],
    },
    {
      id: "custom_survey_focus",
      question: selections["interest"] === "platform" 
        ? "Sobre o seu Dashboard personalizado, qual a funcionalidade principal que não pode faltar?"
        : "Sobre o seu site ou loja virtual, qual o seu objetivo principal?",
      options: selections["interest"] === "platform" ? [
        { label: "Gestão Avançada de Dados", value: "data_management", icon: Server, description: "Painéis de relatórios detalhados.", nextStep: "custom_survey_scale" },
        { label: "Área Exclusiva de Clientes", value: "client_portal", icon: Layout, description: "Onde o cliente acessa os serviços.", nextStep: "custom_survey_scale" },
        { label: "Automação de Processos", value: "automation", icon: Zap, description: "Eliminar tarefas manuais.", nextStep: "custom_survey_scale" },
        { label: "Integração de Sistemas", value: "integrations", icon: Zap, description: "Juntar dados de várias fontes.", nextStep: "custom_survey_scale" },
      ] : [
        { label: "Design Imersivo e Impactante", value: "design_focus", icon: Sparkles, description: "Foco extremo na estética moderna.", nextStep: "custom_survey_scale" },
        { label: "Sistema de Agendamentos / Reservas", value: "scheduling", icon: Layout, description: "Calendários e horários de serviços.", nextStep: "custom_survey_scale" },
        { label: "Velocidade e SEO Extremo", value: "performance_focus", icon: Zap, description: "Máxima conversão no Google.", nextStep: "custom_survey_scale" },
        { label: "Múltiplos Idiomas / Internacional", value: "multilang", icon: Server, description: "Meu negócio atende globalmente.", nextStep: "custom_survey_scale" },
      ]
    },
    {
      id: "custom_survey_scale",
      question: selections["interest"] === "platform"
        ? "Qual o volume estimado de usuários ativos mensais usando a plataforma?"
        : "Como está sua Identidade Visual e o conteúdo do projeto?",
      options: selections["interest"] === "platform" ? [
        { label: "Volume Inicial (Até 1k)", value: "low_scale", description: "Operação inicial ou equipe interna.", nextStep: "custom_survey_integrations" },
        { label: "Tração (1k a 10k)", value: "mid_scale", description: "Operação em fase de esteira/crescimento.", nextStep: "custom_survey_integrations" },
        { label: "Alta Escala (+10k)", value: "high_scale", description: "Alta demanda, escalabilidade crítica.", nextStep: "custom_survey_integrations" },
      ] : [
        { label: "Já Tenho Tudo Pronto", value: "ready", description: "Logotipo, cores e textos já definidos.", nextStep: "custom_survey_integrations" },
        { label: "Preciso Criar do Zero", value: "scratch", description: "Preciso desenvolver a marca do projeto.", nextStep: "custom_survey_integrations" },
        { label: "Quero uma Renovação", value: "rebranding", description: "Melhorar e modernizar o que já possuo.", nextStep: "custom_survey_integrations" },
      ]
    },
    {
      id: "custom_survey_integrations",
      question: selections["interest"] === "platform" 
        ? "Por fim, quais integrações externas serão fundamentais no projeto?"
        : "Para fechar: você precisará conectar o site/loja com outras ferramentas?",
      options: selections["interest"] === "platform" ? [
        { label: "Gateways de Pagamento", value: "payments", description: "Asaas, Stripe, Checkout.", nextStep: "custom_survey_extras" },
        { label: "CRM ou Marketing", value: "marketing", description: "HubSpot, ActiveCampaign, RD Station.", nextStep: "custom_survey_extras" },
        { label: "ERPs via API", value: "erp_api", description: "Bling, Tiny ou sistemas legados.", nextStep: "custom_survey_extras" },
        { label: "Não preciso de integrações", value: "none", description: "Tudo rodará de forma independente.", nextStep: "custom_survey_extras" },
      ] : [
        { label: "Ferramentas de Marketing", value: "marketing", description: "RD Station, Mailchimp, etc.", nextStep: "custom_survey_extras" },
        { label: "Sistemas de ERP / Estoque", value: "erp_api", description: "Bling, Tiny, etc.", nextStep: "custom_survey_extras" },
        { label: "Pagamentos Específicos / Cripto", value: "custom_payments", description: "Além dos métodos tradicionais.", nextStep: "custom_survey_extras" },
        { label: "Apenas o básico estrutural", value: "none", description: "Sem integrações complexas por ora.", nextStep: "custom_survey_extras" },
      ]
    },
    {
      id: "custom_survey_extras",
      question: "Deseja descrever seu projeto em mais detalhes ou adicionar mais alguma coisa? (Opcional)",
      options: [],
    },
    {
      id: "platform_type",
      question: "Ótimo! Temos planos prontos excelentes e opções sob medida. Qual nível de operação você busca?",
      options: [
        { label: "Starter", value: "platform_starter", priceImpact: VI_PRICES.platform_starter, description: "Ideal para começar (até 100 vendas)." },
        { label: "Pro", value: "platform_pro", priceImpact: VI_PRICES.platform_pro, description: "Escalabilidade e automação WhatsApp." },
        { label: "Enterprise", value: "platform_enterprise", priceImpact: VI_PRICES.platform_enterprise, description: "Operações robustas e suporte dedicado." },
      ],
    },
    {
      id: "lead_capture",
      question: "Perfeito! Antes de finalizarmos e te conectarmos com nosso time, como podemos te identificar?",
      options: [],
    },
  ];

  const handleOptionSelect = (option: Option) => {
    const updatedSelections = { ...selections, [steps[currentStep].id]: option.value };
    setSelections(updatedSelections);
    
    if (option.nextStep) {
      const nextIdx = steps.findIndex(s => s.id === option.nextStep);
      setIsViTyping(true);
      setTimeout(() => {
        setHistory([...history, nextIdx]);
        setCurrentStep(nextIdx);
        setIsViTyping(false);
      }, 700);
    } else {
      const leadCaptureIdx = steps.findIndex(s => s.id === "lead_capture");
      setIsViTyping(true);
      setTimeout(() => {
        setHistory([...history, leadCaptureIdx]);
        setCurrentStep(leadCaptureIdx);
        setIsViTyping(false);
      }, 900);
    }
  };

  const calculateTotal = () => {
    let base = 0;
    const sType = selections["service_type"] || selections["platform_type"];
    if (sType && (VI_PRICES as any)[sType]) {
      base = (VI_PRICES as any)[sType];
    }
    return base;
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentStep(newHistory[newHistory.length - 1]);
    }
  };

  const renderResult = () => {
    const total = calculateTotal();
    const isPlatform = selections["interest"] === "platform";

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full text-center space-y-10"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-sm">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight">Seu plano ideal está pronto!</h2>
        
        <div className="bg-gray-50 border border-gray-200 p-10 md:p-14 rounded-[3.5rem] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
            <Bot className="w-48 h-48 text-primary" />
          </div>
          
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary font-black mb-4">Investimento Estimado</p>
          <div className="flex justify-center items-baseline gap-3 mb-10">
            <span className="text-2xl font-bold text-gray-400">R$</span>
            <span className="text-7xl md:text-8xl font-black text-[#0f172a] tracking-tighter">{total.toLocaleString('pt-BR')}</span>
            {isPlatform && <span className="text-xl font-bold text-gray-400">/mês</span>}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 max-w-md mx-auto">
            <Button size="lg" className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest gap-3 rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all hover:scale-105" asChild>
              <a href={`https://wa.me/5511999999999?text=Olá VI! Fiz meu orçamento e quero começar meu projeto de R$ ${total}!`} target="_blank" rel="noopener noreferrer">
                Falar com Especialista <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>

        <button 
          onClick={() => {
            setSelections({});
            setHistory([0]);
            setCurrentStep(0);
          }}
          className="text-[11px] text-gray-400 hover:text-primary transition-colors flex items-center gap-2 mx-auto uppercase tracking-[0.2em] font-black"
        >
          <ArrowLeft className="w-4 h-4" /> Recomeçar Pesquisa
        </button>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[450px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {isInitializing ? (
          <motion.div
            key="initializing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <Bot className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <motion.p
                key={loadingText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-black uppercase tracking-[0.3em] text-xs"
              >
                {loadingText}
              </motion.p>
              <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </motion.div>
        ) : currentStep === -1 || currentStep === -2 ? (
          renderResult()
        ) : steps[currentStep].id === "platform_type" ? (
          <PricingComparisonTable 
            onSelectPlan={(planId) => {
              const option = steps[currentStep].options.find(o => o.value === planId);
              if (option) handleOptionSelect(option);
            }} 
          />
        ) : (
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* Header / Question */}
            <div className="space-y-6 text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                 <Bot className="w-4 h-4 text-primary" />
                 <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">VI Assistente</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-[#0f172a] leading-[1.1] tracking-tight">
                {steps[currentStep].question}
              </h3>
            </div>

            {/* Options */}
            <div className={`grid gap-6 ${steps[currentStep].options.length > 2 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
              {steps[currentStep].id === "lead_capture" ? (
                <div className="space-y-6 w-full max-w-2xl mx-auto col-span-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Nome Completo</label>
                      <input 
                        type="text"
                        placeholder="Ex: João Silva"
                        className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl focus:border-primary/50 outline-none text-[#0f172a] text-sm transition-all focus:bg-white focus:shadow-xl"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">E-mail Corporativo</label>
                      <input 
                        type="email"
                        placeholder="Ex: joao@vincere.co"
                        className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl focus:border-primary/50 outline-none text-[#0f172a] text-sm transition-all focus:bg-white focus:shadow-xl"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">WhatsApp</label>
                      <input 
                        type="text"
                        placeholder="Ex: (11) 99999-9999"
                        className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl focus:border-primary/50 outline-none text-[#0f172a] text-sm transition-all focus:bg-white focus:shadow-xl"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Empresa</label>
                      <input 
                        type="text"
                        placeholder="Nome da sua empresa"
                        className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl focus:border-primary/50 outline-none text-[#0f172a] text-sm transition-all focus:bg-white focus:shadow-xl"
                        value={leadForm.company}
                        onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full h-16 font-black uppercase tracking-widest mt-6 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all" 
                    disabled={isSubmitting}
                    onClick={async () => {
                       if (!leadForm.name || !leadForm.email || !leadForm.phone) {
                         toast({ title: "Preencha todos os campos obrigatórios.", variant: "destructive" });
                         return;
                       }
                       setIsSubmitting(true);
                       try {
                         const surveyDetails = Object.entries(selections).map(([stepId, value]) => `${stepId}: ${value}`).join("\n");
                         const needsData = `Histórico da VI:\n${surveyDetails}\n\nDescrição Extra: ${customProjectDescription}`;
                         
                         await supabase.from("vi_leads").insert({
                           name: leadForm.name,
                           email: leadForm.email,
                           phone: leadForm.phone,
                           company: leadForm.company,
                           needs: needsData
                         });

                         // Final animation delay
                         setIsViTyping(true);
                         setTimeout(() => {
                           setCurrentStep(-1);
                           setIsViTyping(false);
                         }, 1000);
                       } catch (e) {
                         toast({ title: "Erro ao processar seus dados. Tente novamente.", variant: "destructive" });
                       } finally {
                         setIsSubmitting(false);
                       }
                    }}
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin p-0.5" /> : "Finalizar e Ver Orçamento"}
                  </Button>
                </div>
              ) : steps[currentStep].id === "custom_survey_extras" ? (
                <div className="space-y-6 w-full max-w-2xl mx-auto col-span-full">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Informações Adicionais</label>
                    <Textarea 
                      placeholder="Conte-nos um pouco mais sobre o seu projeto (objetivos, referências, prazos...)"
                      className="min-h-[180px] bg-gray-50 border border-gray-200 rounded-3xl focus:border-primary/50 text-[#0f172a] text-sm p-6 w-full outline-none transition-all focus:bg-white focus:shadow-xl resize-none"
                      value={customProjectDescription}
                      onChange={(e) => setCustomProjectDescription(e.target.value)}
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.3)]" 
                    onClick={() => {
                        const leadIdx = steps.findIndex(s => s.id === "lead_capture");
                        setCurrentStep(leadIdx);
                    }}
                  >
                    Próximo Passo <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                steps[currentStep].options.map((option, i) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.03, backgroundColor: "#ffffff", boxShadow: "0 25px 60px -15px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOptionSelect(option)}
                    className="flex flex-col items-center p-8 bg-gray-50 border border-gray-200 rounded-[2.5rem] transition-all text-center group relative overflow-hidden h-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {option.icon && (
                      <div className="w-16 h-16 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <option.icon className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    <div className="font-black text-xl text-[#0f172a] mb-2 group-hover:text-primary transition-colors">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed px-2">
                        {option.description}
                      </div>
                    )}
                  </motion.button>
                ))
              )}
            </div>

            {/* Back Button */}
            {history.length > 1 && (
              <button 
                onClick={goBack}
                className="mt-12 text-[11px] text-gray-400 hover:text-primary transition-colors flex items-center gap-2 mx-auto uppercase tracking-[0.2em] font-black"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar Anterior
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViExperienceSurvey;
