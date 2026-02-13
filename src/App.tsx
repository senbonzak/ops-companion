import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import ArgocdPage from "@/pages/ArgocdPage";
import BackupsPage from "@/pages/BackupsPage";
import AlertmanagerPage from "@/pages/AlertmanagerPage";
import ApmPage from "@/pages/ApmPage";
import GrafanaPage from "@/pages/GrafanaPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/argocd" element={<ArgocdPage />} />
            <Route path="/backups" element={<BackupsPage />} />
            <Route path="/alertmanager" element={<AlertmanagerPage />} />
            <Route path="/apm" element={<ApmPage />} />
            <Route path="/grafana" element={<GrafanaPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
