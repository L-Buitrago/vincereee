import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-8 text-foreground">
          Termos de Uso
        </h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <p>
            Bem-vindo ao site da Vincere Tech. Ao acessar ou usar nosso site ("Serviço"), você concorda em ficar vinculado a estes Termos de Uso. Leia-os atentamente.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p>
            Ao utilizar nosso site, você afirma que tem capacidade legal para concordar com estes Termos e que leu e compreendeu integralmente as regras aqui estabelecidas.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Uso do Serviço</h2>
          <p>
            Você concorda em usar o site apenas para fins lícitos e de maneira que não infrinja os direitos de terceiros, não restrinja nem iniba a utilização ou o aproveitamento deste site por qualquer outra pessoa. É expressamente proibido:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Usar o site de forma que possa danificá-lo, desativá-lo, sobrecarregá-lo ou prejudicá-lo;</li>
            <li>Tentar obter acesso não autorizado a qualquer parte não pública do site;</li>
            <li>Transmitir qualquer tipo de vírus, malware ou código de natureza destrutiva;</li>
            <li>Realizar scraping, coleta automatizada de dados ou engenharia reversa das tecnologias empregadas.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo presente no site, incluindo, mas não se limitando a, textos, gráficos, imagens, logotipos, ícones de botões e compilações de software, é propriedade exclusiva da Vincere Tech ou de seus fornecedores de conteúdo e protegido pelas leis de direitos autorais, marcas registradas e propriedades intelectuais aplicáveis no Brasil e internacionalmente.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Isenção de Responsabilidade</h2>
          <p>
            O conteúdo do site é fornecido "no estado em que se encontra", sem quaisquer garantias expressas ou implícitas de qualquer espécie. A Vincere Tech não garante que o site funcionará ininterruptamente ou que estará livre de erros.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Limitação de Responsabilidade</h2>
          <p>
            Em nenhuma hipótese a Vincere Tech será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequências sofridas em resultado do uso ou incapacidade de usar o nosso site.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Links de Terceiros</h2>
          <p>
            Nosso Serviço pode conter links e redirecionamentos para sites de terceiros que não são controlados pela Vincere Tech. Não assumimos qualquer responsabilidade pelo conteúdo, políticas de privacidade ou práticas de qualquer site de terceiros.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Alterações e Continuidade do Serviço</h2>
          <p>
            Reservamo-nos o direito de modificar, suspender ou descontinuar o site (ou parte dele) a qualquer momento, temporária ou permanentemente, com ou sem aviso prévio. Os Termos de Uso também podem ser atualizados periodicamente, sendo a sua continuação do uso do site considerada uma aceitação das atualizações.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Foro e Legislação Aplicável</h2>
          <p>
            Estes Termos serão regidos e interpretados de acordo com a legislação da República Federativa do Brasil. Quaisquer disputas ou controvérsias decorrentes ou relacionadas a estes Termos ou ao uso do site serão submetidas ao foro da comarca da sede da Vincere Tech.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
