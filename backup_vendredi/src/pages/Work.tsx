import ProjectsSection from '@/components/ProjectsSection';
import FooterSection from '@/components/FooterSection';
import PageTransition from '@/components/ui/PageTransition';

const Work = () => {
  return (
    <PageTransition>
      <main className="pt-24">
        <ProjectsSection />
        <FooterSection />
      </main>
    </PageTransition>
  );
};

export default Work;
