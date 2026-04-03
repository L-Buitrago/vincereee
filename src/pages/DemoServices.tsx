import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Layout, ShoppingBag, Bot, Code2, Cog, Check, Smartphone, Globe, Zap, MessageCircle, Send, ShoppingCart, CreditCard, Package, Star, Workflow, Settings, Database, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VincereLogo from "@/components/VincereLogo";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }
  }),
};

// ========== LANDING PAGES DEMO ==========
const LandingPagesDemo = () => (
  <div className="space-y-16">
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Sites e Landing Pages</h2>
      <p className="text-[#888] text-lg max-w-2xl mx-auto">Criamos páginas de alta conversão com design premium, responsivo e otimizado para SEO.</p>
    </div>

    {/* Example showcases */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { title: "Landing Page", desc: "Focada em conversão com CTA estratégico e prova social", icon: Globe, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", image: "/landing_page_mockup.png" },
        { title: "Site Institucional", desc: "Presença profissional com animações e design moderno", icon: Layout, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800" },
        { title: "Loja Virtual", desc: "E-commerce completo com catálogo, carrinho e checkout seguro", icon: ShoppingBag, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", image: "/ecommerce_mockup.png" },
        { title: "Portfolio Digital", desc: "Showcase interativo dos seus trabalhos e cases de sucesso", icon: Star, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", image: "/portfolio_mockup.png" },
      ].map((item, i) => (
        <motion.div key={item.title} initial="hidden" animate="visible" variants={fadeUp} custom={i}
          className={`relative p-8 rounded-2xl border ${item.border} ${item.bg} group hover:-translate-y-2 transition-all duration-500 overflow-hidden min-h-[280px] cursor-pointer`}
        >
          {/* Default Content */}
          <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2 flex flex-col h-full justify-between">
            <div>
              <item.icon className={`w-10 h-10 ${item.color} mb-4 drop-shadow-md`} />
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-[#aaa] group-hover:text-white/95 text-sm leading-relaxed max-w-[95%] transition-colors duration-500">{item.desc}</p>
            </div>
          </div>

          {/* Hover Full Image Reveal */}
          <div className="absolute inset-0 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out z-0">
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 z-10" />
             <img src={item.image} alt={item.title} className="w-full h-full object-cover object-top opacity-60 scale-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
          </div>
        </motion.div>
      ))}
    </div>

    {/* Features */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {["Design Responsivo", "Carregamento Rápido", "SEO Otimizado", "Copywriting Estratégico", "Animações Suaves", "Formulários Inteligentes", "Analytics Integrado", "Deploy Automático"].map((f, i) => (
        <motion.div key={f} initial="hidden" animate="visible" variants={fadeUp} custom={i * 0.5}
          className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-sm text-white">{f}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

// ========== E-COMMERCE DEMO ==========
const EcommerceDemo = () => (
  <div className="space-y-16">
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">E-commerce e Lojas Virtuais</h2>
      <p className="text-[#888] text-lg max-w-2xl mx-auto">Lojas online completas com checkout otimizado, integrações de pagamento e gestão de estoque.</p>
    </div>

    {/* Simulated Store */}
    <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <span className="text-white font-bold">Loja Demo — Vincere Store</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#888]">3 itens no carrinho</span>
          <ShoppingCart className="w-5 h-5 text-sky-400" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-x divide-white/5">
        {[
          { name: "Curso Premium", price: "R$ 297,00", tag: "Mais Vendido", color: "text-sky-400" },
          { name: "Mentoria VIP", price: "R$ 997,00", tag: "Exclusivo", color: "text-amber-400" },
          { name: "Plano Anual", price: "R$ 1.497,00", tag: "Melhor Valor", color: "text-emerald-400" },
        ].map((product) => (
          <div key={product.name} className="p-6 text-center hover:bg-white/[0.02] transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto mb-4 flex items-center justify-center">
              <Package className="w-8 h-8 text-[#444]" />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${product.color}`}>{product.tag}</span>
            <h4 className="text-white font-bold mt-1">{product.name}</h4>
            <p className="text-2xl font-bold text-white mt-2">{product.price}</p>
            <Button size="sm" className="mt-4 bg-sky-600 hover:bg-sky-700 text-white w-full">
              <ShoppingCart className="w-4 h-4 mr-2" /> Adicionar
            </Button>
          </div>
        ))}
      </div>
      <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-[#888]">
          <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Pix, Cartão, Boleto</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Entrega Instantânea</span>
        </div>
        <span className="text-emerald-400 text-xs font-bold">✓ SSL Seguro</span>
      </div>
    </div>
  </div>
);

// ========== WHATSAPP RECOVERY DEMO ==========
const WhatsAppDemo = () => (
  <div className="space-y-16">
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Recuperação no WhatsApp</h2>
      <p className="text-[#888] text-lg max-w-2xl mx-auto">IA que recupera vendas automaticamente via WhatsApp com mensagens personalizadas.</p>
    </div>

    {/* Simulated WhatsApp Conversation */}
    <div className="max-w-lg mx-auto">
      <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800/30 px-4 py-3 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Vi — Assistente Vincere</p>
            <p className="text-emerald-400 text-[10px]">● Online agora</p>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-3 min-h-[400px] bg-[#0a0a0a]">
          {[
            { from: "bot", text: "Olá João. Vi que você deixou o Curso Premium no carrinho. Posso ajudar a finalizar?", time: "14:32" },
            { from: "user", text: "Oi! Sim, eu tava vendo mas achei caro", time: "14:33" },
            { from: "bot", text: "Entendo. Tenho um desconto exclusivo de 20% pra você. De R$297 por R$237,60.", time: "14:33" },
            { from: "user", text: "Sério?? Isso muda tudo!", time: "14:34" },
            { from: "bot", text: "Seu link com desconto: vincere.co/oferta-joao\n\nVálido por 2 horas.", time: "14:34" },
            { from: "user", text: "Comprando agora! Obrigado!", time: "14:35" },
            { from: "bot", text: "Pagamento confirmado. Seu acesso foi liberado. Bons estudos, João.", time: "14:36" },
          ].map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.3 }}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.from === "user"
                  ? "bg-emerald-700/50 text-white rounded-tr-sm"
                  : "bg-[#1a1a1a] text-white border border-white/10 rounded-tl-sm"
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="text-[10px] text-[#888] mt-1 block text-right">{msg.time}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="p-4 bg-[#111] border-t border-white/5 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-emerald-400">30%</p>
            <p className="text-[10px] text-[#888]">Taxa de Recuperação</p>
          </div>
          <div>
            <p className="text-lg font-bold text-sky-400">2min</p>
            <p className="text-[10px] text-[#888]">Tempo de Resposta</p>
          </div>
          <div>
            <p className="text-lg font-bold text-amber-400">24/7</p>
            <p className="text-[10px] text-[#888]">Funcionamento</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ========== SOFTWARES DEMO ==========
const SoftwaresDemo = () => (
  <div className="space-y-16">
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Softwares Sob Medida</h2>
      <p className="text-[#888] text-lg max-w-2xl mx-auto">Desenvolvimento de software personalizado que resolve os problemas específicos da sua empresa.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: "Aplicativos Web", desc: "SaaS, dashboards, painéis administrativos e sistemas completos com React, Node.js e cloud.", icon: Globe, features: ["React/Next.js", "APIs REST", "Cloud Deploy", "Real-time"], color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
        { title: "Apps Mobile", desc: "Aplicativos nativos e híbridos para iOS e Android com UX premium e performance.", icon: Smartphone, features: ["React Native", "iOS & Android", "Push Notif.", "Offline"], color: "text-sky-400", border: "border-sky-500/20", bg: "bg-sky-500/5" },
        { title: "ERPs & CRMs", desc: "Sistemas de gestão empresarial customizados para otimizar seus processos internos.", icon: Database, features: ["Multi-tenant", "Relatórios", "Integrações", "Seguro"], color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
      ].map((item, i) => (
        <motion.div key={item.title} initial="hidden" animate="visible" variants={fadeUp} custom={i}
          className={`p-8 rounded-2xl border ${item.border} ${item.bg} hover:scale-[1.02] transition-all duration-300`}
        >
          <item.icon className={`w-10 h-10 ${item.color} mb-4`} />
          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-[#888] text-sm mb-6">{item.desc}</p>
          <div className="space-y-2">
            {item.features.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-[#aaa]">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ========== AUTOMAÇÃO DEMO ==========
const AutomacaoDemo = () => (
  <div className="space-y-16">
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Automação de Processos</h2>
      <p className="text-[#888] text-lg max-w-2xl mx-auto">Automatize tarefas repetitivas e aumente a eficiência da sua empresa com IA.</p>
    </div>

    {/* Automation Flow */}
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#111] rounded-2xl border border-white/5 p-8">
        <h3 className="text-white font-bold text-lg mb-8 text-center">Fluxo de Automação Inteligente</h3>
        <div className="space-y-4">
          {[
            { step: 1, title: "Gatilho", desc: "Cliente abandona o carrinho", icon: ShoppingCart, color: "text-red-400", bg: "bg-red-500/10" },
            { step: 2, title: "Processamento IA", desc: "IA analisa o perfil e cria mensagem personalizada", icon: Bot, color: "text-sky-400", bg: "bg-sky-500/10" },
            { step: 3, title: "Ação Automática", desc: "Envia mensagem no WhatsApp + e-mail + notificação", icon: Send, color: "text-blue-400", bg: "bg-blue-500/10" },
            { step: 4, title: "Acompanhamento", desc: "Monitora resposta e ajusta abordagem automaticamente", icon: BarChart3, color: "text-amber-400", bg: "bg-amber-500/10" },
            { step: 5, title: "Conversão", desc: "Cliente finaliza a compra com desconto exclusivo", icon: Check, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2, duration: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] text-[#666] font-bold uppercase">Passo {item.step}</span>
                  <h4 className="text-white font-bold text-sm">{item.title}</h4>
                </div>
                <p className="text-[#888] text-sm">{item.desc}</p>
              </div>
              {i < 4 && <div className="w-px h-8 bg-white/10 ml-6 self-end" />}
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Tempo Economizado", value: "85%", color: "text-emerald-400" },
        { label: "Redução de Erros", value: "95%", color: "text-blue-400" },
        { label: "ROI Médio", value: "340%", color: "text-sky-400" },
        { label: "Clientes Satisfeitos", value: "100+", color: "text-amber-400" },
      ].map((s, i) => (
        <motion.div key={s.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}
          className="p-6 rounded-2xl bg-[#111] border border-white/5 text-center"
        >
          <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-[#888] mt-1">{s.label}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
const demoComponents: Record<string, React.FC> = {
  "landing-pages": LandingPagesDemo,
  "ecommerce": EcommerceDemo,
  "whatsapp": WhatsAppDemo,
  "softwares": SoftwaresDemo,
  "automacao": AutomacaoDemo,
};

export default function DemoServices() {
  const { service } = useParams<{ service: string }>();
  const DemoComponent = service ? demoComponents[service] : null;

  if (!DemoComponent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Demonstração não encontrada</h1>
          <Link to="/">
            <Button className="bg-sky-600 hover:bg-sky-700">Voltar ao site</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Demo banner */}
      <div className="bg-sky-600/20 border-b border-sky-500/30 py-2 px-4 text-center">
        <p className="text-[10px] sm:text-xs font-bold text-sky-400 uppercase tracking-widest">
          Modo Visualização: Esta é uma demonstração do serviço
        </p>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <VincereLogo className="w-5 h-5" />
            <span className="font-semibold text-white text-sm">Vincere</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-[#888] hover:text-white hover:bg-white/5 gap-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar ao site
              </Button>
            </Link>
            <Link to="/#cta">
              <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white text-xs gap-1.5">
                Começar agora
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <DemoComponent />

        {/* CTA */}
        <div className="mt-20 text-center border-t border-white/5 pt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Gostou do que viu?</h2>
          <p className="text-[#888] mb-8">Entre em contato e transforme sua ideia em realidade.</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/#cta">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 gap-2">
                Começar agora <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-transparent">
                Ver outros serviços
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
