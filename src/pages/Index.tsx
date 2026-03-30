import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import VisionSection from '@/components/VisionSection';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import FooterSection from '@/components/FooterSection';
import FloatingCTA from '@/components/FloatingCTA';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navigation />
      <HeroSection />
      <ProjectsSection />
      <VisionSection />
      <ReviewsCarousel />
      <FooterSection />
      <FloatingCTA />
    </div>
  );
};

export default Index;
