import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Returns = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-8 text-foreground">
          Política de Trocas, Devoluções e Cancelamentos
        </h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p>
            Na VincereAT, buscamos garantir a total satisfação de nossos clientes com a máxima transparência e em consonância as exigências do Código de Defesa do Consumidor. Leia atentamente as regras para cancelamentos de serviços prestados ou devoluções e trocas.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Cancelamento de Serviços Recorrentes e Contratos</h2>
          <p>
            No caso de serviços sob assinatura, modelo SaaS ou contratos de longo prazo, o cancelamento pode ser manifestado a qualquer momento de acordo com as cláusulas do contrato específico firmado no momento da adesão. Em linhas gerais:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Os cancelamentos devem ser solicitados formalmente ao suporte através do e-mail oficial;</li>
            <li>Cancelamentos após o prazo legal ou contratual não geram reembolsos proporcionais do mês já iniciado na assinatura do período, exceto quando especificado nas bases do seu respectivo contrato ou para casos onde o serviço não foi prestado por nossa inoperância técnica comprovada;</li>
            <li>Para serviços de desenvolvimento de sistemas e aplicativos sob medida (Softwares customizados), regras de quebra e multas de cancelamento aplicam-se a depender do marco ou *Sprint* atualmente em desenvolvimento, todas essas condições estarão descritas no seu Contrato Principal.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Trocas ou Ajustes de Serviços</h2>
          <p>
            Caso note alguma desconformidade, falha técnica, entregas de serviço ou de software divergentes daqueles descritos no seu detalhamento, possuímos um prazo de garantia obrigatório (garantia de adequação) e de suporte. Durante esse período:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Refaremos ou aplicaremos ajustes técnicos à entrega solicitada sem custo adicional se os problemas forem devidamente originários do escopo acordado e responsabilidade da nossa equipe técnica.</li>
            <li>Solicitações de mudança brusca de escopo técnico, layout ou fluxos não se enquadram em correção de projeto (ou "trocas") e serão avaliadas para precificação como adição de horas técnicas.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Processo e Prazos de Reembolso</h2>
          <p>
            Assim que a equipe aprovar o cancelamento que der direito de estorno financeiro de acordo com os termos contratuais:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cartão de Crédito/PIX/Boletos:</strong> Solicitaremos o estorno em até 5 dias úteis para a intermediadora de pagamentos;</li>
            <li>O valor constará como retorno e prazo de repasse aos devidos extratos do cartão na fatura vigente ou subsequente dependendo apenas da política praticada pelo próprio banco do cliente ou sua plataforma operadora de cartão de crédito.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Como solicitar</h2>
          <p>
            Todas as instâncias e necessidades de suporte, cancelamento ou devolução deverão ser redigidas e encaminhadas oficialmente pelo cliente em nosso canal: <a href="mailto:contatovinceree@gmail.com" className="text-primary hover:underline">contatovinceree@gmail.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Returns;
