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
  ArrowLeft,
  Loader2,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

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
  const [isViTyping, setIsViTyping] = useState(false);
  const [customProjectDescription, setCustomProjectDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });
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
        className="w-full text-center space-y-8"
      >
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/30">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-white">Seu plano ideal está pronto!</h2>
        
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Bot className="w-24 h-24 text-primary" />
          </div>
          
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Investimento Estimado</p>
          <div className="flex justify-center items-baseline gap-2 mb-6">
            <span className="text-xl font-medium text-gray-500">R$</span>
            <span className="text-5xl font-black text-white">{total.toLocaleString('pt-BR')}</span>
            {isPlatform && <span className="text-lg text-gray-500">/mês</span>}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full h-14 font-black text-sm uppercase tracking-widest gap-2" asChild>
              <a href={`https://wa.me/5511999999999?text=Olá VI! Fiz meu orçamento e quero começar meu projeto de R$ ${total}!`} target="_blank" rel="noopener noreferrer">
                Falar com Especialista <ArrowRight className="w-4 h-4" />
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
          className="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-2 mx-auto uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Recomeçar
        </button>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto min-h-[400px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {currentStep === -1 || currentStep === -2 ? (
          renderResult()
        ) : (
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            {/* Header / Question */}
            <div className="space-y-4 text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                 <Bot className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-bold text-primary uppercase tracking-widest">VI Assistente</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {steps[currentStep].question}
              </h3>
            </div>

            {/* Options */}
            <div className={`grid gap-4 ${steps[currentStep].options.length > 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {steps[currentStep].id === "lead_capture" ? (
                <div className="space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text"
                      placeholder="Nome Completo"
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-primary/50 outline-none text-white text-sm"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    />
                    <input 
                      type="email"
                      placeholder="E-mail Corporativo"
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-primary/50 outline-none text-white text-sm"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    />
                    <input 
                      type="text"
                      placeholder="WhatsApp"
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-primary/50 outline-none text-white text-sm"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    />
                    <input 
                      type="text"
                      placeholder="Empresa"
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-primary/50 outline-none text-white text-sm"
                      value={leadForm.company}
                      onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full h-14 font-black uppercase tracking-widest mt-4" 
                    disabled={isSubmitting}
                    onClick={async () => {
                       if (!leadForm.name || !leadForm.email || !leadForm.phone) {
                         toast({ title: "Preencha todos os campos", variant: "destructive" });
                         return;
                       }
                       setIsSubmitting(true);
                       try {
                         // Simplify: Just transition to result for now
                         const surveyData = `Interesse: ${selections["interest"]}\nDesc: ${customProjectDescription}`;
                         await supabase.from("vi_leads").insert({
                           name: leadForm.name,
                           email: leadForm.email,
                           phone: leadForm.phone,
                           company: leadForm.company,
                           needs: surveyData
                         });
                         setCurrentStep(-1);
                       } catch (e) {
                         toast({ title: "Erro ao salvar", variant: "destructive" });
                       } finally {
                         setIsSubmitting(false);
                       }
                    }}
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ver Proposta Final"}
                  </Button>
                </div>
              ) : steps[currentStep].id === "custom_survey_extras" ? (
                <div className="space-y-4 w-full">
                  <Textarea 
                    placeholder="Descreva seu projeto aqui..."
                    className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl focus:border-primary/50 text-white text-sm p-4 w-full"
                    value={customProjectDescription}
                    onChange={(e) => setCustomProjectDescription(e.target.value)}
                  />
                  <Button 
                    size="lg" 
                    className="w-full h-14 font-black uppercase tracking-widest" 
                    onClick={() => {
                        const leadIdx = steps.findIndex(s => s.id === "lead_capture");
                        setCurrentStep(leadIdx);
                    }}
                  >
                    Próximo Passo
                  </Button>
                </div>
              ) : (
                steps[currentStep].options.map((option, i) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(option)}
                    className="flex flex-col items-center p-6 bg-white/5 border border-white/10 rounded-3xl transition-all text-center group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {option.icon && (
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <option.icon className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="font-bold text-lg text-white mb-1 group-hover:text-primary transition-colors">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
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
                className="mt-8 text-[10px] text-gray-600 hover:text-white transition-colors flex items-center gap-2 mx-auto uppercase tracking-widest font-black"
              >
                <ArrowLeft className="w-3 h-3" /> Voltar
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViExperienceSurvey;
