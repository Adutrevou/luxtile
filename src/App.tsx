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
import Index from "./pages/Index.tsx";
import CollectionsPage from "./pages/Collections.tsx";
import SalesPage from "./pages/Sales.tsx";
import DifferencePage from "./pages/Difference.tsx";
import InspirationPage from "./pages/Inspiration.tsx";
import ContactPage from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import RequireAdmin from "./components/admin/RequireAdmin.tsx";

const queryClient = new QueryClient();

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
            <Routes>
              {/* Admin routes — no Navbar/Footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />

              {/* Public routes */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/collections" element={<CollectionsPage />} />
                      <Route path="/sales" element={<SalesPage />} />
                      <Route path="/why-us" element={<DifferencePage />} />
                      <Route path="/inspiration" element={<InspirationPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <QuoteBasketIndicator />
                  <GlobalQuoteModal />
                </>
              } />
            </Routes>
          </BrowserRouter>
        </QuoteBasketProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
