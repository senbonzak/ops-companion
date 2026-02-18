import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { Settings } from "@/services/api";

// Hook pour les données du dashboard
export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: api.getDashboard,
    refetchInterval: 30_000, // Rafraîchir toutes les 30s
  });
}

// Hook pour les applications ArgoCD
export function useArgocdApps() {
  return useQuery({
    queryKey: ["argocd", "apps"],
    queryFn: api.getArgocdApps,
    refetchInterval: 30_000,
  });
}

// Hook pour les backups
export function useBackups() {
  return useQuery({
    queryKey: ["backups"],
    queryFn: api.getBackups,
    refetchInterval: 60_000, // Rafraîchir toutes les 60s
  });
}

// Hook pour les alertes
export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: api.getAlerts,
    refetchInterval: 15_000, // Rafraîchir toutes les 15s
  });
}

// Hook pour les dashboards Grafana
export function useGrafana() {
  return useQuery({
    queryKey: ["grafana"],
    queryFn: api.getGrafana,
    refetchInterval: 60_000,
  });
}

// Hook pour les services APM
export function useApmServices() {
  return useQuery({
    queryKey: ["apm", "services"],
    queryFn: api.getApmServices,
    refetchInterval: 30_000,
  });
}

// Hook pour les temps de réponse APM
export function useApmResponseTime() {
  return useQuery({
    queryKey: ["apm", "response-time"],
    queryFn: api.getApmResponseTime,
    refetchInterval: 30_000,
  });
}

// Hook pour lire les settings
export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: api.getSettings,
  });
}

// Hook pour sauvegarder les settings
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<Settings>) => api.updateSettings(settings),
    onSuccess: (data) => {
      // Mettre à jour le cache React Query
      queryClient.setQueryData(["settings"], data);
    },
  });
}
