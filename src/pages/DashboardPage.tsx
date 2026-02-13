import { GitBranch, HardDrive, Bell, Activity, Rocket, Database, ShieldAlert, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { dashboardOverview, recentEvents, backupSuccessRate, alertTimeline, apmResponseTime } from "@/data/mock";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const d = dashboardOverview;

const argoDonut = [
  { name: "Healthy", value: d.argocd.healthy, color: "hsl(160, 84%, 39%)" },
  { name: "Degraded", value: d.argocd.degraded, color: "hsl(0, 84%, 60%)" },
  { name: "Progressing", value: d.argocd.progressing, color: "hsl(217, 91%, 60%)" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Row 1 - Health */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="ArgoCD Apps"
          value={d.argocd.total}
          subtitle={`${d.argocd.healthy} healthy · ${d.argocd.degraded} errors`}
          icon={GitBranch}
          variant="default"
        />
        <StatCard
          title="Backups Status"
          value="OK"
          subtitle={`Dernier CNPG: ${formatDistanceToNow(new Date(d.backups.cnpg.lastBackup), { addSuffix: true, locale: fr })}`}
          icon={HardDrive}
          variant="success"
        />
        <StatCard
          title="Alertes Actives"
          value={d.alertmanager.activeAlerts}
          subtitle={`Dernière: ${formatDistanceToNow(new Date(d.alertmanager.lastAlert), { addSuffix: true, locale: fr })}`}
          icon={Bell}
          variant={d.alertmanager.activeAlerts > 0 ? "warning" : "success"}
        />
        <StatCard
          title="APM Traces"
          value={`${d.apm.tracesPerMin}/min`}
          subtitle={`Error rate: ${d.apm.errorRate}% · p95: ${d.apm.latencyP95}ms`}
          icon={Activity}
          variant="info"
        />
      </div>

      {/* Row 2 - Charts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* ArgoCD Donut */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-card-foreground">ArgoCD Status</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={argoDonut} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={0}>
                {argoDonut.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-3">
            {argoDonut.map((e) => (
              <div key={e.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
                {e.name}
              </div>
            ))}
          </div>
        </div>

        {/* Backup Success */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-card-foreground">Backup Success Rate</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={backupSuccessRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(220,9%,46%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(220,9%,46%)" domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="success" stroke="hsl(160,84%,39%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alert Timeline */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-card-foreground">Alertes (24h)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={alertTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 9 }} stroke="hsl(220,9%,46%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(220,9%,46%)" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(38,92%,50%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* APM Response Time */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-card-foreground">APM Response Time</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={apmResponseTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(220,9%,46%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(220,9%,46%)" unit="ms" />
              <Tooltip />
              <Line type="monotone" dataKey="p95" stroke="hsl(0,84%,60%)" strokeWidth={2} dot={false} name="p95" />
              <Line type="monotone" dataKey="p50" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={false} name="p50" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3 - Recent Activity */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Activité Récente</h3>
        <div className="space-y-3">
          {recentEvents.map((event, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5">
                {event.type === "deploy" && <Rocket className="h-4 w-4 text-primary" />}
                {event.type === "backup" && <Database className="h-4 w-4 text-success" />}
                {event.type === "alert" && <ShieldAlert className="h-4 w-4 text-warning" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-card-foreground">{event.message}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true, locale: fr })}
                </p>
              </div>
              <StatusBadge status={event.type} variant={event.type === "deploy" ? "info" : event.type === "backup" ? "success" : "warning"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
