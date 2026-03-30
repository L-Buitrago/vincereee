import HeroSection from '@/components/HeroSection';
import IntroText from '@/components/IntroText';
import ProjectsSection from '@/components/ProjectsSection';
import VisionSection from '@/components/VisionSection';
import FooterSection from '@/components/FooterSection';
import PageTransition from '@/components/ui/PageTransition';

const Index = () => {
  return (
    <PageTransition>
      <main>
        <HeroSection />
        <IntroText />
        <ProjectsSection />
        <VisionSection />
        <FooterSection />
      </main>
    </PageTransition>
  );
};

export default Index;
