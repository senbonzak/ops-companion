// Mock data for the DevOps platform

export const dashboardOverview = {
  argocd: { total: 42, healthy: 38, degraded: 2, progressing: 2, outOfSync: 5 },
  backups: {
    cnpg: { lastBackup: "2026-02-13T08:00:00Z", status: "success", nextScheduled: "2026-02-14T08:00:00Z" },
    elasticsearch: { lastSnapshot: "2026-02-13T09:30:00Z", status: "success" },
  },
  alertmanager: { activeAlerts: 3, lastAlert: "2026-02-13T10:15:00Z" },
  apm: { tracesPerMin: 1250, errorRate: 0.8, latencyP95: 245 },
};

export const argocdApps = [
  { name: "api-gateway", cluster: "prod-eu", namespace: "gateway", health: "Healthy", sync: "Synced", lastSync: "2026-02-13T09:45:00Z", repo: "https://github.com/org/api-gateway" },
  { name: "user-service", cluster: "prod-eu", namespace: "services", health: "Healthy", sync: "Synced", lastSync: "2026-02-13T09:30:00Z", repo: "https://github.com/org/user-service" },
  { name: "payment-service", cluster: "prod-eu", namespace: "services", health: "Degraded", sync: "OutOfSync", lastSync: "2026-02-13T08:12:00Z", repo: "https://github.com/org/payment" },
  { name: "notification-svc", cluster: "prod-eu", namespace: "services", health: "Healthy", sync: "Synced", lastSync: "2026-02-13T09:40:00Z", repo: "https://github.com/org/notif" },
  { name: "frontend-app", cluster: "prod-eu", namespace: "frontend", health: "Healthy", sync: "Synced", lastSync: "2026-02-13T10:00:00Z", repo: "https://github.com/org/frontend" },
  { name: "analytics-worker", cluster: "prod-us", namespace: "analytics", health: "Healthy", sync: "OutOfSync", lastSync: "2026-02-12T22:00:00Z", repo: "https://github.com/org/analytics" },
  { name: "auth-service", cluster: "prod-eu", namespace: "auth", health: "Healthy", sync: "Synced", lastSync: "2026-02-13T09:50:00Z", repo: "https://github.com/org/auth" },
  { name: "search-indexer", cluster: "prod-us", namespace: "search", health: "Progressing", sync: "Synced", lastSync: "2026-02-13T10:05:00Z", repo: "https://github.com/org/search" },
  { name: "ml-pipeline", cluster: "staging", namespace: "ml", health: "Healthy", sync: "Synced", lastSync: "2026-02-13T07:30:00Z", repo: "https://github.com/org/ml" },
  { name: "data-ingestion", cluster: "prod-eu", namespace: "data", health: "Degraded", sync: "OutOfSync", lastSync: "2026-02-13T06:00:00Z", repo: "https://github.com/org/ingestion" },
  { name: "cache-layer", cluster: "prod-eu", namespace: "infra", health: "Healthy", sync: "Synced", lastSync: "2026-02-13T09:55:00Z", repo: "https://github.com/org/cache" },
  { name: "monitoring-stack", cluster: "prod-eu", namespace: "monitoring", health: "Healthy", sync: "Synced", lastSync: "2026-02-13T08:45:00Z", repo: "https://github.com/org/monitoring" },
];

export const backupHistory = [
  { id: "bk-001", timestamp: "2026-02-13T08:00:00Z", database: "prod-main", size: "284 MB", duration: "45s", status: "success" },
  { id: "bk-002", timestamp: "2026-02-12T08:00:00Z", database: "prod-main", size: "282 MB", duration: "43s", status: "success" },
  { id: "bk-003", timestamp: "2026-02-11T08:00:00Z", database: "prod-main", size: "280 MB", duration: "47s", status: "success" },
  { id: "bk-004", timestamp: "2026-02-10T08:00:00Z", database: "prod-main", size: "278 MB", duration: "42s", status: "success" },
  { id: "bk-005", timestamp: "2026-02-09T08:00:00Z", database: "prod-main", size: "275 MB", duration: "50s", status: "failed" },
  { id: "bk-006", timestamp: "2026-02-08T08:00:00Z", database: "prod-main", size: "273 MB", duration: "44s", status: "success" },
  { id: "bk-007", timestamp: "2026-02-07T08:00:00Z", database: "prod-main", size: "270 MB", duration: "41s", status: "success" },
];

export const activeAlerts = [
  { id: "alert-1", severity: "critical", name: "HighMemoryUsage", startedAt: "2026-02-13T09:30:00Z", labels: ["prod-eu", "payment-service"], description: "Memory usage above 90% for 15 minutes" },
  { id: "alert-2", severity: "warning", name: "PodRestartLoop", startedAt: "2026-02-13T10:00:00Z", labels: ["prod-eu", "data-ingestion"], description: "Pod restarting every 5 minutes" },
  { id: "alert-3", severity: "info", name: "CertExpiringSoon", startedAt: "2026-02-13T08:00:00Z", labels: ["prod-eu", "ingress"], description: "TLS certificate expires in 14 days" },
];

export const recentEvents = [
  { type: "deploy", message: "frontend-app deployed v2.4.1", timestamp: "2026-02-13T10:00:00Z" },
  { type: "backup", message: "CNPG backup completed successfully", timestamp: "2026-02-13T08:00:00Z" },
  { type: "alert", message: "HighMemoryUsage triggered on payment-service", timestamp: "2026-02-13T09:30:00Z" },
  { type: "deploy", message: "auth-service synced to v1.8.0", timestamp: "2026-02-13T09:50:00Z" },
  { type: "alert", message: "PodRestartLoop on data-ingestion", timestamp: "2026-02-13T10:00:00Z" },
  { type: "backup", message: "ES snapshot completed", timestamp: "2026-02-13T09:30:00Z" },
  { type: "deploy", message: "search-indexer progressing v3.1.0", timestamp: "2026-02-13T10:05:00Z" },
];

export const backupSuccessRate = [
  { day: "Feb 7", success: 100 },
  { day: "Feb 8", success: 100 },
  { day: "Feb 9", success: 0 },
  { day: "Feb 10", success: 100 },
  { day: "Feb 11", success: 100 },
  { day: "Feb 12", success: 100 },
  { day: "Feb 13", success: 100 },
];

export const alertTimeline = [
  { hour: "00:00", count: 0 },
  { hour: "02:00", count: 1 },
  { hour: "04:00", count: 0 },
  { hour: "06:00", count: 2 },
  { hour: "08:00", count: 1 },
  { hour: "10:00", count: 3 },
  { hour: "12:00", count: 1 },
  { hour: "14:00", count: 0 },
  { hour: "16:00", count: 2 },
  { hour: "18:00", count: 1 },
  { hour: "20:00", count: 0 },
  { hour: "22:00", count: 1 },
];

export const apmResponseTime = [
  { time: "09:00", p95: 220, p50: 120 },
  { time: "09:10", p95: 235, p50: 115 },
  { time: "09:20", p95: 280, p50: 140 },
  { time: "09:30", p95: 310, p50: 160 },
  { time: "09:40", p95: 260, p50: 130 },
  { time: "09:50", p95: 245, p50: 125 },
  { time: "10:00", p95: 250, p50: 128 },
];
