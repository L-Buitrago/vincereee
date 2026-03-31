import { useState } from "react";
import ModernMenu from "@/components/v2/ModernMenu";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import SplashScreenManager, { SplashType } from "@/components/SplashScreenManager";

// V3 NEW COMPONENTS
import HeroImmersive from "@/components/v3/HeroImmersive";
import BentoServices from "@/components/v3/BentoServices";
import SaasDashboardReveal from "@/components/v3/SaasDashboardReveal";
import ProjectGridHybrid from "@/components/v3/ProjectGridHybrid";
import FinalCTA from "@/components/v3/FinalCTA";

// V2 RESTORED COMPONENTS
import IntroText from "@/components/v2/IntroText";
import BustExperience from "@/components/v2/BustExperience";
import MottoSection from "@/components/v2/MottoSection";
import BigTimeReturns from "@/components/v2/BigTimeReturns";
import SuccessLogic from "@/components/v2/SuccessLogic";
import WaysToWork from "@/components/v2/WaysToWork";

import { SmoothScroll } from "@/components/v2/SmoothScroll";
import PageTransition from "@/components/v2/PageTransition";

const Index = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const splashType: SplashType = "minimal";

  const [showSplash, setShowSplash] = useState(() => {
    if (sessionStorage.getItem("vincere_splash_shown")) {
      return false;
    }
    sessionStorage.setItem("vincere_splash_shown", "true");
    return true;
  });

  const handleNavigate = (targetId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "auto" }); 
      }
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 800);
  };

  return (
    <div className="min-h-screen relative bg-background selection:bg-primary/30 text-foreground overflow-x-hidden">
      <div className="noise-overlay" />
      <PageTransition trigger={isTransitioning} />
      
      {showSplash && (
        <SplashScreenManager 
          type={splashType}
          isLoading={false} 
          onAnimationComplete={() => setShowSplash(false)} 
        />
      )}
      
      <div className={`transition-opacity duration-1000 ${showSplash ? "opacity-0" : "opacity-100"}`}>
        <SmoothScroll>
          <ModernMenu onNavigate={handleNavigate} />
          
          <main className="relative">
            {/* 1. HERO (V3) */}
            <div id="home">
              <HeroImmersive />
            </div>

            {/* 2. INTRO (RESTAURADO V2) */}
            <IntroText />
            
            {/* 4. MOTTO (RESTAURADO V2) */}
            <div id="about">
              <MottoSection />
            </div>

            {/* 5. BENTO TRÍADE (V3) */}
            <BentoServices />

            {/* 6. SAAS DASHBOARD (V3) */}
            <div id="plataforma">
              <SaasDashboardReveal />
            </div>

            {/* 7. NOTIFICAÇÕES / KPI (RESTAURADO V2) */}
            <BigTimeReturns />

            {/* 8. REVIEWS (RESTAURADO V2) */}
            <div id="reviews">
              <SuccessLogic />
            </div>

            {/* 9. FOTOS 3+2 (V3 HYBRID) */}
            <div id="cases">
              <ProjectGridHybrid />
            </div>

            {/* 10. WAYS TO WORK (RESTAURADO V2) */}
            <div id="servicos">
              <WaysToWork />
            </div>

            {/* 11. FINAL CTA (V3) */}
            <div id="contato">
              <FinalCTA />
            </div>
          </main>

          <Footer />
          <ChatWidget />
        </SmoothScroll>
      </div>
    </div>
  );
};

export default Index;
