import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";
import { useMetaPixel } from "@/hooks/useMetaPixel";

const queryClient = new QueryClient();

// Component to handle pixel tracking inside BrowserRouter
const PixelTracker = ({ children }: { children: React.ReactNode }) => {
  useMetaPixel();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PixelTracker>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PixelTracker>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
