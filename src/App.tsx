
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientVehicles from "./pages/ClientVehicles";
import Vehicles from "./pages/Vehicles";
import VehicleOrders from "./pages/VehicleOrders";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Financial from "./pages/Financial";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import CreateUser from "./pages/CreateUser";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="workshop-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/:clientId/vehicles" element={<ClientVehicles />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/vehicles/:vehicleId/orders" element={<VehicleOrders />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/financial" element={<Financial />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/create-user" element={<CreateUser />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
