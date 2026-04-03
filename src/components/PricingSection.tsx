import { useState } from "react";
import { Check, ArrowRight, ShieldCheck, Zap, Layout, Server, TrendingUp, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "./CheckoutModal";

const servicePackages = [
  {
    icon: Zap,
    name: "Landing Page",
    price: "497",
    desc: "Perfeito para vendas de infoprodutos, paginas de captura ou lançamento único.",
    features: [
      "Página única (Single Page)",
      "Design focado em conversão",
      "Copywriting otimizado",
      "Integração com WhatsApp e Email",
      "Hospedagem inclusa (1º ano)",
      "Prazo de entrega: 7 dias",
    ],
    popular: false,
    link: "https://wa.me/5511999999999?text=Olá, gostaria de saber mais sobre o pacote Landing Page!"
  },
  {
    icon: Layout,
    name: "Site Institucional",
    price: "997",
    desc: "A melhor escolha para empresas e negócios locais criarem autoridade online.",
    features: [
      "Até 5 páginas internas (Home, Sobre, etc.)",
      "Formulário avançado de contato",
      "SEO Técnico otimizado (Google)",
      "Integração com ferramentas externas",
      "Painel para edição de conteúdo",
      "Prazo de entrega: 15 dias",
    ],
    popular: true,
    link: "https://wa.me/5511999999999?text=Olá, gostaria de saber mais sobre o pacote Site Institucional!"
  },
  {
    icon: ShieldCheck,
    name: "E-commerce Completo",
    price: "1.997",
    desc: "Para marcas que querem vender online com catálogo e checkouts próprios.",
    features: [
      "Loja completa com até 50 produtos base",
      "Gateways de Pagamento (Nacional e Internacional)",
      "Gestão de estoque e envio",
      "Recuperação de carrinho abandonado",
      "Treinamento de uso ao entregar",
      "Prazo de entrega: 25 dias",
    ],
    popular: false,
    link: "https://wa.me/5511999999999?text=Olá, gostaria de saber mais sobre o pacote de E-commerce Completo!"
  },
];

const platformPlans = [
  {
    icon: Server,
    name: "Starter",
    price: "97",
    desc: "Para quem está começando a vender e precisa de uma base sólida.",
    features: [
      "Até 100 vendas/mês", 
      "1 checkout personalizado", 
      "Entrega automática", 
      "Dashboard básico", 
      "Suporte por email"
    ],
    popular: false,
    link: "/auth"
  },
  {
    icon: TrendingUp,
    name: "Pro",
    price: "197",
    desc: "Para escalar suas vendas com recuperação e membros ilimitados.",
    features: [
      "Vendas ilimitadas", 
      "Checkouts ilimitados", 
      "WhatsApp recovery autom.", 
      "Área de membros completa", 
      "Integrações premium e Pix", 
      "Suporte prioritário"
    ],
    popular: true,
    link: "/auth"
  },
  {
    icon: Settings2,
    name: "Enterprise",
    price: "497",
    desc: "Para operações robustas com requisitos técnicos avançados.",
    features: [
      "Tudo do plano Pro", 
      "Contas Multi-usuário", 
      "Acesso API dedicada", 
      "White-label total", 
      "Suporte dedicado 24/7", 
      "Onboarding personalizado", 
      "SLA de uptime garantido"
    ],
    popular: false,
    link: "/auth"
  },
];

const PricingSection = () => {
  const [activeTab, setActiveTab] = useState<'platform' | 'services'>('platform');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState("");
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(0);

  const activePackages = activeTab === 'services' ? servicePackages : platformPlans;

  const handleCheckout = (planName: string, priceText: string) => {
    // Parser to convert "197" -> 197 or "1.997" -> 1997
    const priceAmount = parseFloat(priceText.replace(/\./g, '').replace(',', '.'));
    setSelectedPlanName(planName);
    setSelectedPlanPrice(priceAmount);
    setIsCheckoutOpen(true);
  };

  return (
    <section id="pacotes" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Purple glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-sky-500/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-primary tracking-wider uppercase mb-3">Nossos Planos</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Escolha a solução ideal para você
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Trabalhamos com preços transparentes. Assine a nossa plataforma SaaS ou contrate nosso estúdio de desenvolvimento.
          </p>
        </div>

        {/* Toggle Controls */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex items-center p-1.5 bg-card border border-border rounded-full shadow-sm">
            <button
              onClick={() => setActiveTab('platform')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'platform'
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Assinar Plataforma
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'services'
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Criar Site ou Loja
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {activePackages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
                pkg.popular
                  ? "bg-card border-primary/50 shadow-[0_0_40px_rgba(var(--primary),0.1)] scale-100 md:scale-105 z-10"
                  : "bg-card/50 border-border hover:border-primary/30"
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Mais Popular
                </div>
              )}

              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <pkg.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm h-10">{pkg.desc}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex items-baseline gap-1">
                  <span className="text-muted-foreground font-medium">R$</span>
                  <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                  <span className="text-muted-foreground text-sm">{activeTab === 'platform' ? '/mês' : ''}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {activeTab === 'platform' ? 'Cancele quando quiser.' : 'Pagamento facilitado em até 12x.'}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="h-5 w-5 text-primary shrink-0 transition-colors" />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={pkg.popular ? "default" : "outline"}
                className={`w-full gap-2 ${pkg.popular ? "h-12 text-base" : "h-11"}`}
                onClick={() => {
                  if (activeTab === 'platform') {
                    handleCheckout(pkg.name, pkg.price);
                  } else {
                    window.open(pkg.link, '_blank');
                  }
                }}
              >
                {activeTab === 'platform' ? "Começar Agora" : "Quero este projeto"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        planName={selectedPlanName} 
        priceAmount={selectedPlanPrice} 
      />
    </section>
  );
};

export default PricingSection;
