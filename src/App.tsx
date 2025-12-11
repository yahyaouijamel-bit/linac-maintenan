import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Equipments from "./pages/Equipments";
import Tickets from "./pages/Tickets";
import Downtimes from "./pages/Downtimes";
import Maintenance from "./pages/Maintenance";
import WorkOrders from "./pages/WorkOrders";
import SpareParts from "./pages/SpareParts";
import Technicians from "./pages/Technicians";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/equipments"
            element={
              <AppLayout>
                <Equipments />
              </AppLayout>
            }
          />
          <Route
            path="/tickets"
            element={
              <AppLayout>
                <Tickets />
              </AppLayout>
            }
          />
          <Route
            path="/downtimes"
            element={
              <AppLayout>
                <Downtimes />
              </AppLayout>
            }
          />
          <Route
            path="/maintenance"
            element={
              <AppLayout>
                <Maintenance />
              </AppLayout>
            }
          />
          <Route
            path="/work-orders"
            element={
              <AppLayout>
                <WorkOrders />
              </AppLayout>
            }
          />
          <Route
            path="/spare-parts"
            element={
              <AppLayout>
                <SpareParts />
              </AppLayout>
            }
          />
          <Route
            path="/technicians"
            element={
              <AppLayout>
                <Technicians />
              </AppLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
