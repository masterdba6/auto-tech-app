
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="workshop-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/vehicles" element={<div>Veículos - Em desenvolvimento</div>} />
              <Route path="/orders" element={<div>Ordens de Serviço - Em desenvolvimento</div>} />
              <Route path="/inventory" element={<div>Estoque - Em desenvolvimento</div>} />
              <Route path="/financial" element={<div>Financeiro - Em desenvolvimento</div>} />
              <Route path="/reports" element={<div>Relatórios - Em desenvolvimento</div>} />
              <Route path="/settings" element={<div>Configurações - Em desenvolvimento</div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
