import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroller } from "@/components/SmoothScroller";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Returns from "./pages/Returns";
import Admin from "./pages/Admin";
import PlatformLayout from "./components/platform/PlatformLayout";
import PlatformDashboard from "./pages/PlatformDashboard";
import PlatformClients from "./pages/PlatformClients";
import PlatformProducts from "./pages/PlatformProducts";
import PlatformCheckouts from "./pages/PlatformCheckouts";
import PlatformPayments from "./pages/PlatformPayments";
import PlatformProposal from "./pages/PlatformProposal";
import PlatformAdmin from "./pages/PlatformAdmin";
import PlatformSupport from "./pages/PlatformSupport";
import PlatformSettings from "./pages/PlatformSettings";
import PlatformPurchases from "./pages/PlatformPurchases";
import PlatformMessages from "./pages/PlatformMessages";
import DemoDashboard from "./pages/DemoDashboard";
import ViExperience from "./pages/ViExperience";
import DemoServices from "./pages/DemoServices";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SmoothScroller>
            <BrowserRouter>
              <ScrollToTop />
              <ThemeProvider defaultTheme="light" storageKey="vincere-theme">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacidade" element={<Privacy />} />
                <Route path="/termos" element={<Terms />} />
                <Route path="/devolucoes" element={<Returns />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                {/* Platform SaaS */}
                <Route path="/plataforma" element={<Navigate to="/plataforma/dashboard" replace />} />
                <Route path="/plataforma/proposta" element={<PlatformProposal />} />
                <Route path="/plataforma/demonstracao" element={<DemoDashboard />} />
                <Route path="/vi-experience" element={<ViExperience />} />
                <Route path="/vincere-experiencia" element={<Navigate to="/vi-experience" replace />} />
                <Route path="/demo/:service" element={<DemoServices />} />
                {/* Payments page is accessible to any logged-in user (so they can subscribe) */}
                <Route
                  path="/plataforma/pagamentos"
                  element={
                    <ProtectedRoute>
                      <PlatformLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<PlatformPayments />} />
                </Route>
                {/* All other platform pages require an active subscription */}
                <Route 
                  element={
                    <ProtectedRoute>
                      <SubscriptionGuard>
                        <PlatformLayout />
                      </SubscriptionGuard>
                    </ProtectedRoute>
                  }
                >
                  <Route path="/plataforma/dashboard" element={<PlatformDashboard />} />
                  <Route path="/plataforma/clientes" element={<PlatformClients />} />
                  <Route path="/plataforma/produtos" element={<PlatformProducts />} />
                  <Route path="/plataforma/checkouts" element={<PlatformCheckouts />} />
                  <Route path="/plataforma/admin" element={<PlatformAdmin />} />
                  <Route path="/plataforma/suporte" element={<PlatformSupport />} />
                  <Route path="/plataforma/configuracoes" element={<PlatformSettings />} />
                  <Route path="/plataforma/compras" element={<PlatformPurchases />} />
                  <Route path="/plataforma/mensagens" element={<PlatformMessages />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </ThemeProvider>
            </BrowserRouter>
          </SmoothScroller>
        </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
