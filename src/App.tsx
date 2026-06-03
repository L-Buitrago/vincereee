import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { ThemeProvider } from "@/components/theme-provider";

import ScrollToTop from "./components/ScrollToTop";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Returns = lazy(() => import("./pages/Returns"));
const Admin = lazy(() => import("./pages/Admin"));
const PlatformLayout = lazy(() => import("./components/platform/PlatformLayout"));
const PlatformDashboard = lazy(() => import("./pages/PlatformDashboard"));
const PlatformClients = lazy(() => import("./pages/PlatformClients"));
const PlatformProducts = lazy(() => import("./pages/PlatformProducts"));
const PlatformCheckouts = lazy(() => import("./pages/PlatformCheckouts"));
const PlatformPayments = lazy(() => import("./pages/PlatformPayments"));
const PlatformProposal = lazy(() => import("./pages/PlatformProposal"));
const PlatformAdmin = lazy(() => import("./pages/PlatformAdmin"));
const PlatformSupport = lazy(() => import("./pages/PlatformSupport"));
const PlatformSettings = lazy(() => import("./pages/PlatformSettings"));
const PlatformPurchases = lazy(() => import("./pages/PlatformPurchases"));
const PlatformMessages = lazy(() => import("./pages/PlatformMessages"));
const PlatformSubscription = lazy(() => import("./pages/PlatformSubscription"));
const DemoDashboard = lazy(() => import("./pages/DemoDashboard"));
const ViExperience = lazy(() => import("./pages/ViExperience"));
const DemoServices = lazy(() => import("./pages/DemoServices"));
const Checkout = lazy(() => import("./pages/Checkout"));

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isDeviceVerified, refreshVerification } = useAuth();
  
  return (
    <>

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

