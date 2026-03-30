import { useState } from "react";
import ModernMenu from "@/components/v2/ModernMenu";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import SplashScreenManager, { SplashType } from "@/components/SplashScreenManager";
import GreekHero from "@/components/v2/GreekHero";
import BustExperience from "@/components/v2/BustExperience";
import IntroText from "@/components/v2/IntroText";
import MottoSection from "@/components/v2/MottoSection";
import ProjectShowcase from "@/components/v2/ProjectShowcase";
import OurModel from "@/components/v2/OurModel";
import SuccessLogic from "@/components/v2/SuccessLogic";
import WaysToWork from "@/components/v2/WaysToWork";
import BigTimeReturns from "@/components/v2/BigTimeReturns";
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
            {/* DOBRA 1: Hero */}
            <div id="home">
              <GreekHero />
            </div>

            {/* DOBRA 2: Intro Text + 3D Bust Experience */}
            <IntroText />
            <BustExperience />
            
            <div id="about">
              <MottoSection />
            </div>

            {/* DOBRA 3: Projects (PS Essentials / See More Work) */}
            <div id="cases">
              <ProjectShowcase />
            </div>

            {/* DOBRA 4: Our Model (Replaces Feather) */}
            <OurModel />

            {/* DOBRA 5: Big Time Returns (KPI + notificações) */}
            <BigTimeReturns />


            {/* DOBRA 6: Reviews (Auto-scroll + Drag) */}
            <div id="reviews">
              <SuccessLogic />
            </div>
            
            {/* DOBRA 7: Ways to Work */}
            <div id="servicos">
              <WaysToWork />
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
