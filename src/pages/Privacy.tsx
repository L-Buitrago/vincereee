import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-8 text-foreground">
          Política de Privacidade
        </h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p>
            A VincereAT ("nós", "nosso") valoriza a privacidade dos seus usuários ("você", "seu"). Esta Política de Privacidade explica como coletamos, usamos, protegemos e divulgamos suas informações com base na Lei Geral de Proteção de Dados (LGPD).
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Informações que Coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente, como nome, endereço de e-mail e outras informações de contato ao preencher formulários em nosso site. Também podemos coletar informações de forma automática, através do uso de cookies e tecnologias semelhantes, como dados de navegação e endereço IP.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Como Usamos Suas Informações</h2>
          <p>
            Utilizamos suas informações para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fornecer, manter e melhorar nossos serviços;</li>
            <li>Responder a seus comentários ou perguntas;</li>
            <li>Enviar informações administrativas e atualizações;</li>
            <li>Entender e analisar como você usa nosso site, a fim de criar novos recursos e funcionalidades.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Compartilhamento de Informações</h2>
          <p>
            Não vendemos nem alugamos suas informações pessoais. Podemos compartilhar informações com prestadores de serviços terceirizados que nos auxiliam na operação do site e na prestação de nossos serviços, sob estritos acordos de confidencialidade.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Seus Direitos (LGPD)</h2>
          <p>
            Nos termos da LGPD, você tem o direito de solicitar o acesso, retificação, anonimização, bloqueio ou eliminação de seus dados pessoais, bem como a portabilidade dos mesmos. Para exercer seus direitos, entre em contato conosco através do e-mail de contato abaixo.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Segurança dos Dados</h2>
          <p>
            Empregamos medidas de segurança técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso, alteração, divulgação ou destruição não autorizados.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer mudanças importantes publicando a nova política em nosso site. Recomendamos rever esta página regularmente.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Contato</h2>
          <p>
            Se houver dúvidas sobre esta Política de Privacidade, entre em contato através de: <a href="mailto:contatovinceree@gmail.com" className="text-primary hover:underline">contatovinceree@gmail.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
