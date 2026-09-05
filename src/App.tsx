import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { ThemeProvider } from "@/components/theme-provider";
import { supabase } from "@/integrations/supabase/client";

import ScrollToTop from "./components/ScrollToTop";

// Platform SaaS pages - direct imports for instant 0ms tab switching without screen flicker or unmounting
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
import PlatformSubscription from "./pages/PlatformSubscription";

// Public pages - lazy loaded
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Returns = lazy(() => import("./pages/Returns"));
const Admin = lazy(() => import("./pages/Admin"));
const DemoDashboard = lazy(() => import("./pages/DemoDashboard"));
const ViExperience = lazy(() => import("./pages/ViExperience"));
const DemoServices = lazy(() => import("./pages/DemoServices"));
const Checkout = lazy(() => import("./pages/Checkout"));

const queryClient = new QueryClient();

const AuthRecoveryHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const rawPath = window.location.pathname;
    const rawHash = window.location.hash;
    const rawSearch = window.location.search;

    const isRecoveryUrl =
      rawPath.endsWith("/reset-password") ||
      rawHash.includes("type=recovery") ||
      rawSearch.includes("type=recovery");

    if (isRecoveryUrl && location.pathname !== "/reset-password") {
      navigate("/reset-password", { replace: true });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return null;
};

const AppRoutes = () => {
  const { isDeviceVerified, refreshVerification } = useAuth();
  
  return (
    <>
      <AuthRecoveryHandler />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
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
        <Route path="/checkout" element={<Checkout />} />
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
          <Route path="/plataforma/assinatura" element={<PlatformSubscription />} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <ScrollToTop />
            <ThemeProvider defaultTheme="light" storageKey="vincere-theme">
              <AppRoutes />
            </ThemeProvider>
          </HashRouter>
        </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

