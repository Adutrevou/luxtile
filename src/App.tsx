import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QuoteBasketProvider, useQuoteBasket } from "@/context/QuoteBasketContext";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import QuoteBasketIndicator from "@/components/QuoteBasketIndicator";
import QuoteModal from "@/components/QuoteModal";
import PageSkeleton from "@/components/PageSkeleton";

// Lazy-loaded pages for code splitting
import Index from "./pages/Index";
const CollectionsPage = lazy(() => import("./pages/Collections.tsx"));
const SalesPage = lazy(() => import("./pages/Sales.tsx"));
const DifferencePage = lazy(() => import("./pages/Difference.tsx"));
const InspirationPage = lazy(() => import("./pages/Inspiration.tsx"));
const ContactPage = lazy(() => import("./pages/Contact.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const RequireAdmin = lazy(() => import("./components/admin/RequireAdmin.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/** Renders the global QuoteModal bound to basket context state */
const GlobalQuoteModal = () => {
  const { isQuoteOpen, closeQuoteModal } = useQuoteBasket();
  return <QuoteModal open={isQuoteOpen} onClose={closeQuoteModal} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AdminAuthProvider>
        <QuoteBasketProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                {/* Admin routes — no Navbar/Footer */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <RequireAdmin><AdminDashboard /></RequireAdmin>
                  </Suspense>
                } />

                {/* Public routes */}
                <Route path="*" element={
                  <>
                    <Navbar />
                    <main>
                      <Suspense fallback={<PageSkeleton />}>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/collections" element={<CollectionsPage />} />
                          <Route path="/sales" element={<SalesPage />} />
                          <Route path="/why-us" element={<DifferencePage />} />
                          <Route path="/inspiration" element={<InspirationPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </main>
                    <Footer />
                    <QuoteBasketIndicator />
                    <GlobalQuoteModal />
                  </>
                } />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </QuoteBasketProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
