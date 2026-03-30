import VisionSection from '@/components/VisionSection';
import FooterSection from '@/components/FooterSection';
import PageTransition from '@/components/ui/PageTransition';

const About = () => {
  return (
    <PageTransition>
      <main className="pt-24">
        <VisionSection />
        <FooterSection />
      </main>
    </PageTransition>
  );
};

export default About;
