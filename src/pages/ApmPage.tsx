import { Activity, Cpu, Zap, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";

const services = [
  { name: "api-backend", runtime: "Node.js", instances: 3, rpm: 450, errorRate: 0.5, p95: 180, status: "healthy" },
  { name: "auth-service", runtime: "Go", instances: 2, rpm: 320, errorRate: 0.1, p95: 45, status: "healthy" },
  { name: "payment-service", runtime: "Node.js", instances: 2, rpm: 180, errorRate: 2.1, p95: 340, status: "degraded" },
  { name: "notification-svc", runtime: "Python", instances: 1, rpm: 90, errorRate: 0.3, p95: 120, status: "healthy" },
  { name: "search-indexer", runtime: "Java", instances: 2, rpm: 250, errorRate: 0.8, p95: 200, status: "healthy" },
];

export default function ApmPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Agents Actifs" value={12} icon={Cpu} variant="success" />
        <StatCard title="Services Instrumentés" value={services.length} icon={Activity} variant="info" />
        <StatCard title="Traces / heure" value="75K" icon={Zap} />
        <StatCard title="Error Rate" value="0.8%" icon={AlertTriangle} variant="warning" />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Services</h3>
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Service</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Runtime</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Instances</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Req/min</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Error %</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">p95</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-card-foreground">{s.name}</td>
                    <td className="px-4 py-3"><span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{s.runtime}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{s.instances}</td>
                    <td className="px-4 py-3 text-card-foreground font-mono">{s.rpm}</td>
                    <td className="px-4 py-3 font-mono" style={{ color: s.errorRate > 1 ? "hsl(0,84%,60%)" : "inherit" }}>{s.errorRate}%</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">{s.p95}ms</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
