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
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

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

const platformFeatures = [
  { name: "Produtos / Vendas por mês", starter: "Até 100", pro: "Até 1000", enterprise: "Ilimitado" },
  { name: "Hospedagem de Alta Performance", starter: true, pro: true, enterprise: true },
  { name: "Certificado SSL Integrado", starter: true, pro: true, enterprise: true },
  { name: "Automação de WhatsApp", starter: false, pro: true, enterprise: true },
  { name: "Email Marketing Base", starter: true, pro: true, enterprise: true },
  { name: "Assistente IA (Vi) no Site", starter: false, pro: true, enterprise: true },
  { name: "Recuperação de Carrinho Avançada", starter: false, pro: true, enterprise: true },
  { name: "Multi-idiomas / Internacional", starter: false, pro: false, enterprise: true },
  { name: "Infraestrutura Dedicada", starter: false, pro: false, enterprise: true },
  { name: "Suporte Técnico", starter: "Horário Coml.", pro: "Prioritário", enterprise: "Gerente 24/7" },
];

const serviceFeatures = {
  landing_page: ["Página Única (One-page)", "Design Ultra Moderno", "SEO Básico Incluso", "Prazo: 7 a 14 dias"],
  site_institucional: ["Até 5 Páginas", "Painel de Conteúdo", "Blog Otimizado", "Prazo: 15 a 30 dias"],
  ecommerce: ["Produtos Ilimitados", "Checkout e Pagamentos", "Gestão de Estoque", "Prazo: 30 a 60 dias"],
};

const ViExperience = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<number[]>([0]);
  const [isViTyping, setIsViTyping] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadingText, setLoadingText] = useState("Iniciando Core da VI...");
  const [customProjectDescription, setCustomProjectDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomFlow, setIsCustomFlow] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInitializing) {
      const sequences = [
        { text: "Conectando com a VI...", delay: 0 },
        { text: "Preparando ambiente lógico...", delay: 600 },
        { text: "Tudo pronto.", delay: 1200 },
      ];

      sequences.forEach((seq) => {
        setTimeout(() => setLoadingText(seq.text), seq.delay);
      });

      setTimeout(() => {
        setIsInitializing(false);
        setIsViTyping(true);
        setTimeout(() => setIsViTyping(false), 800);
      }, 1600);
    }
  }, [isInitializing]);

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
      id: "complexity",
      question: "Entendi perfeitamente. Qual o nível de complexidade dessas funções extras?",
      options: [
        { label: "Básico +", value: "basic_plus", priceImpact: 200, description: "Integrações ou automações pontuais.", nextStep: "feature_selection" },
        { label: "Intermediário", value: "mid", priceImpact: 500, description: "Painéis customizados ou fluxos complexos.", nextStep: "feature_selection" },
        { label: "Avançado / Robusto", value: "very_custom", priceImpact: 1000, description: "Sistemas inteiros desenvolvidos sob medida.", nextStep: "feature_selection" },
      ],
    },
    {
      id: "feature_selection",
      question: "Para fecharmos com chave de ouro, alguma dessas especificações é essencial para você?",
      options: [
        { label: "SEO Avançado & Analytics", value: "seo_analytics", priceImpact: 300, description: "Apareça no Google e entenda seus dados." },
        { label: "Multi-idiomas / Internacional", value: "multilang", priceImpact: 600, description: "Sua marca sem fronteiras." },
        { label: "API & Integrações Externas", value: "api_integration", priceImpact: 800, description: "Conecte com qualquer sistema." },
        { label: "White-label / Marca Própria", value: "whitelabel", priceImpact: 1200, description: "Sua marca em evidência total." },
        { label: "Nenhuma destas", value: "none", description: "O essencial já me atende." },
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
      }, 800);
    } else {
      // Transition to lead capture for all final paths
      const leadCaptureIdx = steps.findIndex(s => s.id === "lead_capture");
      setIsViTyping(true);
      setTimeout(() => {
        setHistory([...history, leadCaptureIdx]);
        setCurrentStep(leadCaptureIdx);
        setIsViTyping(false);
      }, 1000);
    }
  };

  const calculateTotal = () => {
    let base = 0;
    const sType = selections["service_type"] || selections["platform_type"];
    if (sType && (VI_PRICES as any)[sType]) {
      base = (VI_PRICES as any)[sType];
    }

    const complexity = selections["complexity"];
    if (complexity) {
      const option = steps.find(s => s.id === "complexity")?.options.find(o => o.value === complexity);
      if (option?.priceImpact) {
        base += option.priceImpact;
      }
    }

    const feature = selections["feature_selection"];
    if (feature) {
      const option = steps.find(s => s.id === "feature_selection")?.options.find(o => o.value === feature);
      if (option?.priceImpact) {
        base += option.priceImpact;
      }
    }

    return base;
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentStep(newHistory[newHistory.length - 1]);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentStep, isViTyping]);

  const renderResult = () => {
    if (currentStep === -2) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Recebemos sua pesquisa!</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Nossa equipe vai analisar cuidadosamente os dados que você nos enviou para estruturarmos <strong>o melhor plano e proposta</strong> para seu negócio. Assim que o estudo for concluído, entraremos em contato para apresentar a solução ideal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 text-lg font-bold gap-3 group" onClick={() => navigate("/")}>
              Voltar ao Início
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold gap-3 group border-primary/20 hover:bg-primary/5" asChild>
              <a href="https://wa.me/5511999999999?text=Olá! Finalizei a pesquisa personalizada na VI e gostaria de tirar algumas dúvidas." target="_blank" rel="noopener noreferrer">
                Falar Conosco <MessageSquare className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </motion.div>
      );
    }

    const total = calculateTotal();
    const isPlatform = selections["interest"] === "platform";



    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Seu plano ideal está pronto!</h2>
        <p className="text-muted-foreground mb-8">
          Com base nas suas escolhas, preparei a melhor proposta para transformar seu negócio.
        </p>
        
        <div className="bg-card border border-primary/20 p-8 rounded-3xl mb-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Bot className="w-24 h-24 text-primary" />
          </div>
          
          <p className="text-sm uppercase tracking-widest text-primary font-bold mb-2">Investimento Estimado</p>
          <div className="flex justify-center items-baseline gap-2 mb-6">
            <span className="text-2xl font-medium text-muted-foreground">R$</span>
            <span className="text-6xl font-black text-white">{total.toLocaleString('pt-BR')}</span>
            {isPlatform && <span className="text-xl text-muted-foreground">/mês</span>}
          </div>
          
          <div className="space-y-3 text-left max-w-sm mx-auto mb-8">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Implementação em tempo recorde</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Suporte técnico premium incluso</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Design exclusivo Vincere</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold gap-3 group flex-1" asChild>
              <a href={`https://wa.me/5511999999999?text=Olá VI! Fiz meu orçamento e quero começar meu projeto de R$ ${total}!`} target="_blank" rel="noopener noreferrer">
                Falar com o Especialista <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold gap-3 group border-primary/20 hover:bg-primary/5 shadow-none" onClick={() => {
                navigate("/#servicos");
                setTimeout(() => {
                  const el = document.getElementById('servicos');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}>
              Ver nossos planos padrões
            </Button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-12 text-left">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-800" />
              <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-700" />
              <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-600" />
            </div>
            <p className="font-bold">Ainda tem dúvidas sobre o projeto?</p>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Se você busca algo ainda mais específico ou quer falar diretamente com quem constrói a Vincere, nosso suporte está à disposição para uma consultoria estratégica.
          </p>
          <Button variant="outline" className="w-full h-12 border-primary/20 hover:bg-primary/5 gap-2" asChild>
            <a href="https://wa.me/5511999999999?text=Olá! Fiz o exame com a VI, mas gostaria de falar diretamente com o suporte para um projeto especial." target="_blank" rel="noopener noreferrer">
              <Sparkles className="w-4 h-4 text-primary" /> Falar com o Suporte
            </a>
          </Button>
        </div>

        <button 
          onClick={() => {
            setSelections({});
            setHistory([0]);
            setCurrentStep(0);
          }}
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Recomeçar exame
        </button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-primary/30">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <AnimatePresence>
        {!isInitializing && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-50 p-6 flex justify-between items-center"
          >
            <Link to="/" className="text-xl font-display font-bold flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              Vincere <span className="text-primary italic">VI</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-white">
              Sair
            </Button>
          </motion.header>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 pt-12 pb-24 relative z-10 max-w-[1400px]">
        <div className="min-h-[60vh] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {isInitializing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center space-y-10"
              >
                {/* Premium Avatar */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.1, 0, 0.1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute w-32 h-32 rounded-full bg-primary/40 blur-2xl z-0"
                  />
                  
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative w-24 h-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-primary/20 overflow-hidden z-10"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                     <Bot className="w-10 h-10 text-white relative z-10 drop-shadow-md" />
                  </motion.div>
                </div>

                <div className="space-y-4 text-center">
                  <div className="h-6 flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                      <motion.p 
                        key={loadingText}
                        initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
                        transition={{ duration: 0.3 }}
                        className="text-white/80 font-medium text-lg tracking-wide"
                      >
                        {loadingText}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  
                  {/* Subtle Progress Bar */}
                  <div className="w-48 h-[3px] bg-white/5 rounded-full overflow-hidden mx-auto">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.6, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full relative"
                    >
                      <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/30 blur-[2px]" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : currentStep === -1 || currentStep === -2 ? (
              renderResult()
            ) : (
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                {/* VI Message */}
                <div className={`flex gap-4 items-start ${steps[currentStep].id === 'platform_type' ? 'max-w-none' : 'max-w-2xl mx-auto w-full'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl rounded-tl-none relative">
                    <div className="absolute top-0 left-[-8px] border-8 border-transparent border-t-white/5" />
                    <p className="text-xl md:text-2xl font-medium leading-relaxed">
                      {steps[currentStep].question}
                    </p>
                  </div>
                </div>

                {/* Options or Custom Form */}
                {steps[currentStep].id === "lead_capture" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-0 md:ml-16 space-y-4 max-w-xl"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-white/40 ml-1">Nome Completo</label>
                        <input 
                          type="text"
                          placeholder="Ex: João Silva"
                          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-primary/50 outline-none text-white text-sm"
                          value={leadForm.name}
                          onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-white/40 ml-1">E-mail Corporativo</label>
                        <input 
                          type="email"
                          placeholder="Ex: joao@empresa.com"
                          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-primary/50 outline-none text-white text-sm"
                          value={leadForm.email}
                          onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-white/40 ml-1">WhatsApp / Telefone</label>
                        <input 
                          type="text"
                          placeholder="Ex: (11) 99999-9999"
                          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-primary/50 outline-none text-white text-sm"
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-white/40 ml-1">Empresa</label>
                        <input 
                          type="text"
                          placeholder="Nome da sua empresa"
                          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-primary/50 outline-none text-white text-sm"
                          value={leadForm.company}
                          onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      size="lg" 
                      onClick={async () => {
                        if (!leadForm.name || !leadForm.email || !leadForm.phone) {
                          toast({ title: "Por favor, preencha todos os campos obrigatórios.", variant: "destructive" });
                          return;
                        }
                        setIsSubmitting(true);
                        try {
                          // 1. Save Lead to 'customers' table for internal CRM
                          const { data: newCustomer, error: leadError } = await supabase.from("customers").insert({
                            name: leadForm.name,
                            email: leadForm.email,
                            phone: leadForm.phone,
                            status: "Lead"
                          }).select().single();

                          if (leadError) throw leadError;

                          const surveyData = `Serviço: ${selections["service_type"] || selections["platform_type"] || "Personalizado"}\nFoco: ${selections["custom_survey_focus"] || "N/A"}\nEscala: ${selections["custom_survey_scale"] || "N/A"}\nIntegrações: ${selections["custom_survey_integrations"] || "N/A"}`;
                          const descriptionText = customProjectDescription ? `\n\n[PROJETO]\n${customProjectDescription}` : "";
                          const fullNeeds = surveyData + descriptionText;

                          // 2. Save selections to 'customer_notes'
                          if (newCustomer) {
                            await supabase.from("customer_notes").insert({
                              customer_id: newCustomer.id,
                              note: `Interesses da VI:\n` + fullNeeds
                            });
                          }
                          
                          // Save to vi_leads for the Admin Dashboard
                          await supabase.from("vi_leads").insert({
                            name: leadForm.name,
                            email: leadForm.email,
                            phone: leadForm.phone,
                            company: leadForm.company || null,
                            needs: fullNeeds
                          });

                          // 3. Notification logic
                          await supabase.from("notifications").insert({
                             title: "🚀 Novo Lead da VI!",
                             body: `${leadForm.name} tem interesse em ${selections["service_type"] || selections["platform_type"] || "Projeto Personalizado"}.${descriptionText}`,
                             type: "lead",
                             user_email: "vincere@admin.co",
                             read: false
                          });

                          setIsViTyping(true);
                          setTimeout(() => {
                            const currentTotal = calculateTotal();
                            setCurrentStep(currentTotal > 0 ? -1 : -2);
                            setIsViTyping(false);
                          }, 1000);
                        } catch (err) {
                           console.error(err);
                           toast({ title: "Erro ao salvar seus dados", variant: "destructive" });
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      className="w-full h-14 font-bold text-lg mt-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processando...</> : "Finalizar e Ver Proposta"}
                    </Button>
                  </motion.div>
                ) : steps[currentStep].id === "custom_survey_extras" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-0 md:ml-16 space-y-4 max-w-xl"
                  >
                    <Textarea 
                      placeholder="Escreva aqui se tiver mais algum detalhe específico (opcional)..."
                      className="min-h-[150px] bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-gray-500 rounded-xl resize-none"
                      value={customProjectDescription}
                      onChange={(e) => setCustomProjectDescription(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <Button 
                      size="lg" 
                      onClick={async () => {
                        if (false) {
                          toast({ title: "Por favor, descreva seu projeto.", variant: "destructive" });
                          return;
                        }
                        setIsSubmitting(true);
                        try {
                          if (user) {
                            let descriptionToSave = customProjectDescription;
                            if (steps[currentStep].id === "custom_survey_extras") {
                               const surveyData = `Foco: ${selections["custom_survey_focus"] || "N/A"} | Escala: ${selections["custom_survey_scale"] || "N/A"} | Integração: ${selections["custom_survey_integrations"] || "N/A"}`;
                               descriptionToSave = `[PESQUISA]\n${surveyData}\n\n[EXTRAS]\n${customProjectDescription.trim() || "Nenhum detalhe extra."}`;
                            }

                            await supabase.from("quotes").insert({
                              user_id: user.id,
                              service_type: steps[currentStep].id === "custom_survey_extras" ? "Projeto Personalizado (Pesquisa)" : "Projeto Personalizado",
                              description: descriptionToSave,
                              status: "pending"
                            });
                          }
                          setIsViTyping(true);
                          const leadCaptureIdx = steps.findIndex(s => s.id === "lead_capture");
                          setTimeout(() => {
                            setCurrentStep(leadCaptureIdx);
                            setIsViTyping(false);
                          }, 1000);
                        } catch (err) {
                          toast({ title: "Erro ao enviar pedido", variant: "destructive" });
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      className="w-full h-14 font-bold text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Salvando...</>
                      ) : (
                        "Enviar Projeto"
                      )}
                    </Button>
                  </motion.div>
                ) : steps[currentStep].id === "platform_type" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col xl:flex-row gap-6 items-stretch pr-4 md:pr-0"
                  >
                    <div className="flex-1 overflow-x-auto rounded-xl border border-white/10 bg-[#0A0A0A] shadow-xl w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-white/5 border-b border-white/10">
                          <tr>
                            <th className="p-4 font-normal text-muted-foreground w-1/4">Compare os planos</th>
                            {steps[currentStep].options.map((opt) => (
                              <th key={opt.value} className="p-4 text-center min-w-[140px] border-l border-white/5">
                                <div className="font-bold text-lg text-white mb-1">{opt.label}</div>
                                <div className="text-primary font-medium">R$ {opt.priceImpact}/mês</div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {platformFeatures.map((feat, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 border-r border-white/10 text-muted-foreground whitespace-normal">{feat.name}</td>
                              <td className="p-4 text-center border-r border-white/10">
                                {typeof feat.starter === 'boolean' ? (feat.starter ? <Check className="w-4 h-4 text-primary mx-auto" /> : <span className="text-muted-foreground">-</span>) : <span className="text-white font-medium">{feat.starter}</span>}
                              </td>
                              <td className="p-4 text-center border-r border-white/10">
                                {typeof feat.pro === 'boolean' ? (feat.pro ? <Check className="w-4 h-4 text-primary mx-auto" /> : <span className="text-muted-foreground">-</span>) : <span className="text-white font-medium">{feat.pro}</span>}
                              </td>
                              <td className="p-4 text-center">
                                {typeof feat.enterprise === 'boolean' ? (feat.enterprise ? <Check className="w-4 h-4 text-primary mx-auto" /> : <span className="text-muted-foreground">-</span>) : <span className="text-white font-medium">{feat.enterprise}</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-black/40">
                          <tr>
                            <td className="p-4 border-r border-white/10"></td>
                            <td className="p-4 text-center border-r border-white/10">
                              <Button onClick={() => handleOptionSelect(steps[currentStep].options[0])} className="w-full" variant="outline">Escolher Starter</Button>
                            </td>
                            <td className="p-4 text-center border-r border-white/10">
                              <Button onClick={() => handleOptionSelect(steps[currentStep].options[1])} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Escolher Pro</Button>
                            </td>
                            <td className="p-4 text-center">
                              <Button onClick={() => handleOptionSelect(steps[currentStep].options[2])} className="w-full" variant="outline">Escolher Enterprise</Button>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    
                    {/* Custom Plan Card on the Right (or bottom on mobile) */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="w-full xl:w-64 shrink-0 rounded-xl border border-primary/50 bg-primary/10 p-6 flex flex-col h-auto lg:min-h-[--tbl-height] sticky top-24 overflow-hidden relative group"
                    >
                      {/* Animated Sparkles/Particles Effect */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 100, x: Math.random() * 200 }}
                            animate={{ 
                              opacity: [0, 1, 0],
                              y: [-20, -150],
                              x: (Math.random() * 200)
                            }}
                            transition={{ 
                              duration: 2 + Math.random() * 2,
                              repeat: Infinity,
                              delay: Math.random() * 5,
                              ease: "easeOut"
                            }}
                            className="absolute bottom-0 w-1 h-1 bg-primary rounded-full blur-[1px]"
                          />
                        ))}
                      </div>

                      {/* Border Glow Pulse */}
                      <motion.div 
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                      />

                      <div className="relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4 border border-primary/30">
                          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          Plano Personalizado
                        </h3>
                        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                          Para grandes operações que precisam de ecossistemas únicos e integrações exclusivas sob medida.
                        </p>
                      </div>
                      <div className="mt-auto relative z-10">
                        <Button 
                          size="lg"
                          onClick={() => {
                            const nextIdx = steps.findIndex(s => s.id === "custom_survey_focus");
                            setIsViTyping(true);
                            setTimeout(() => {
                              setHistory([...history, nextIdx]);
                              setCurrentStep(nextIdx);
                              setIsViTyping(false);
                            }, 800);
                          }} 
                          className="w-full h-14 font-bold text-lg bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                          Montar Personalizado
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {steps[currentStep].options.map((option, idx) => (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleOptionSelect(option)}
                        className="group flex items-start gap-4 p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-primary/50 transition-all text-left relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {option.icon && (
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <option.icon className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{option.label}</p>
                          {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {isViTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 items-center mt-8 ml-16"
            >
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
            </motion.div>
          )}
        </div>

        <div ref={scrollRef} />
      </main>

      {/* Progress Footer */}
      {currentStep !== -1 && (
        <footer className="fixed bottom-0 inset-x-0 p-6 flex justify-center pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex gap-3 items-center pointer-events-auto">
            <button 
              onClick={goBack}
              disabled={history.length <= 1}
              className="text-muted-foreground hover:text-white disabled:opacity-30 p-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    history.includes(i) ? "w-8 bg-primary" : "w-2 bg-white/10"
                  }`} 
                />
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default ViExperience;
