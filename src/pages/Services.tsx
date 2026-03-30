import { SplitReveal } from '@/components/ui/SplitReveal';
import FooterSection from '@/components/FooterSection';
import PageTransition from '@/components/ui/PageTransition';

const services = [
  {
    category: 'Desenvolvimento Web',
    items: [
      { name: 'Landing Page', desc: 'Página única focada em conversão', price: 'R$ 1.500' },
      { name: 'Site Institucional', desc: 'Até 5 páginas, apresentação da empresa', price: 'R$ 3.500' },
      { name: 'E-commerce', desc: 'Loja virtual completa com integrações', price: 'R$ 6.000' },
    ]
  },
  {
    category: 'Automação WhatsApp',
    items: [
      { name: 'Básico', desc: 'Respostas automáticas simples', price: 'R$ 1.200' },
      { name: 'Intermediário', desc: 'Recuperação de vendas e fluxo de mensagens', price: 'R$ 2.000' },
      { name: 'Avançado', desc: 'Fluxos inteligentes e personalização', price: 'R$ 3.500' },
    ]
  },
  {
    category: 'Dashboards',
    items: [
      { name: 'Básico', desc: 'Métricas essenciais e visualização', price: 'R$ 1.500' },
      { name: 'Intermediário', desc: 'Controle financeiro e gestão completa', price: 'R$ 2.500' },
      { name: 'Avançado', desc: 'Análises avançadas e visão estratégica', price: 'R$ 4.000' },
    ]
  },
  {
    category: 'Automação de Processos',
    items: [
      { name: 'Básico', desc: 'Automatização de tarefas simples', price: 'R$ 1.000' },
      { name: 'Intermediário', desc: 'Integração e fluxos automatizados', price: 'R$ 2.000' },
      { name: 'Avançado', desc: 'Automações complexas e alta eficiência', price: 'R$ 3.500' },
    ]
  }
];

const Services = () => {
  return (
    <PageTransition>
      <main className="pt-40 md:pt-48 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground mb-8">
              <SplitReveal text="Serviços" />
              <br />
              <SplitReveal text="Vincere" delay={0.1} />
            </h1>
            <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl">
              Nossas soluções sob medida para escalar seu faturamento. Pagamento Único.
            </p>
          </div>

          <div className="flex flex-col gap-24">
            {services.map((group, i) => (
              <div key={group.category} className="border-t border-border/20 pt-12">
                <h2 className="text-2xl font-mono text-primary mb-12 uppercase tracking-widest">{group.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                  {group.items.map((srv) => (
                    <div key={srv.name} className="group relative">
                      <div className="flex justify-between items-baseline mb-4">
                        <h3 className="text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {srv.name}
                        </h3>
                        <span className="text-xl font-bold text-primary whitespace-nowrap ml-4">{srv.price}</span>
                      </div>
                      <p className="text-lg text-foreground/60">{srv.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Services;
