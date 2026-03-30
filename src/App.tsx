import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactLenis } from '@studio-freight/react-lenis';
import { AnimatedRoutes } from "./AnimatedRoutes";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
        <BrowserRouter>
          <div className="selection:bg-primary selection:text-primary-foreground text-foreground bg-background min-h-screen">
            <Navigation />
            <AnimatedRoutes />
            <FloatingCTA />
          </div>
        </BrowserRouter>
      </ReactLenis>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
