import { getToken, logout } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Client API générique
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { ...authHeaders() },
  });

  if (response.status === 401) {
    logout();
    throw new Error("Session expiree");
  }

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json.data as T;
}

// --- Types ---

export interface DashboardOverview {
  argocd: { total: number; healthy: number; degraded: number; progressing: number; outOfSync: number };
  backups: {
    cnpg: { lastBackup: string; status: string; nextScheduled: string };
    elasticsearch: { lastSnapshot: string; status: string };
  };
  alertmanager: { activeAlerts: number; lastAlert: string };
  apm: { tracesPerMin: number; errorRate: number; latencyP95: number };
}

export interface RecentEvent {
  type: string;
  message: string;
  timestamp: string;
}

export interface DashboardData {
  overview: DashboardOverview;
  recentEvents: RecentEvent[];
  backupSuccessRate: { day: string; success: number }[];
  alertTimeline: { hour: string; count: number }[];
  apmResponseTime: { time: string; p95: number; p50: number }[];
}

export interface ArgocdApp {
  name: string;
  cluster: string;
  namespace: string;
  health: string;
  sync: string;
  lastSync: string;
  repo: string;
}

export interface EsSnapshot {
  id: string;
  state: string;
  startTime: string;
  endTime: string;
  duration: string;
  indices: number;
  totalShards: number;
  successfulShards: number;
  failedShards: number;
  repository: string;
}

export interface EsRepository {
  name: string;
  type: string;
}

export interface BackupsData {
  configured: boolean;
  hasSnapshots?: boolean;
  repositories: EsRepository[];
  snapshots: EsSnapshot[];
}

export interface Alert {
  id: string;
  severity: string;
  name: string;
  startedAt: string;
  labels: string[];
  description: string;
}

export interface AlertsData {
  alerts: Alert[];
  summary: { activeAlerts: number; lastAlert: string };
}

export interface GrafanaDashboard {
  id: number;
  uid: string;
  title: string;
  uri: string;
  type: string;
  tags: string[];
  isStarred: boolean;
}

export interface GrafanaDatasource {
  id: number;
  name: string;
  type: string;
  url: string;
  isDefault: boolean;
}

export interface GrafanaData {
  dashboards: GrafanaDashboard[];
  datasources: GrafanaDatasource[];
}

export interface ApmService {
  name: string;
  runtime: string;
  instances: number;
  requestsPerMin: number;
  errorRate: number;
  latencyP95: number;
  status: string;
}

export interface ApmResponseTimePoint {
  time: string;
  p95: number;
  p50: number;
}

export interface Settings {
  argocdUrl: string;
  argocdToken: string;
  grafanaUrl: string;
  grafanaKey: string;
  apmEndpoint: string;
  apmToken: string;
  alertmanagerUrl: string;
  alertmanagerToken: string;
  refreshInterval: string;
  emailNotif: boolean;
  slackNotif: boolean;
  slackWebhook: string;
}

// Client API pour les requêtes PUT
async function putApi<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    logout();
    throw new Error("Session expiree");
  }

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json.data as T;
}

// --- Fonctions API ---

export const api = {
  getDashboard: () => fetchApi<DashboardData>("/dashboard"),
  getArgocdApps: () => fetchApi<ArgocdApp[]>("/argocd/apps"),
  getBackups: () => fetchApi<BackupsData>("/backups"),
  getAlerts: () => fetchApi<AlertsData>("/alerts"),
  getGrafana: () => fetchApi<GrafanaData>("/grafana/dashboards"),
  getApmServices: () => fetchApi<ApmService[]>("/apm/services"),
  getApmResponseTime: () => fetchApi<ApmResponseTimePoint[]>("/apm/response-time"),
  getSettings: () => fetchApi<Settings>("/settings"),
  updateSettings: (settings: Partial<Settings>) => putApi<Settings>("/settings", settings),
};
