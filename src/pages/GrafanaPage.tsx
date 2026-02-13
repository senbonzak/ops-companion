import { BarChart3, ExternalLink, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";

const templates = [
  { id: "k8s-overview", name: "Kubernetes Cluster Overview", desc: "Métriques globales du cluster K8s", tags: ["kubernetes", "cluster"] },
  { id: "pg-metrics", name: "PostgreSQL Database Metrics", desc: "Performance et connections PostgreSQL", tags: ["postgresql", "database"] },
  { id: "nodejs-app", name: "Node.js Application Monitoring", desc: "Métriques applicatives Node.js", tags: ["nodejs", "application"] },
  { id: "nginx-ingress", name: "Nginx Ingress Performance", desc: "Trafic et latence de l'ingress controller", tags: ["nginx", "ingress"] },
  { id: "redis-cache", name: "Redis Cache Stats", desc: "Hit rate, mémoire, connections Redis", tags: ["redis", "cache"] },
  { id: "rabbitmq", name: "RabbitMQ Queues", desc: "File d'attente et consumer lag", tags: ["rabbitmq", "messaging"] },
];

const deployed = [
  { id: "dash-1", name: "Production API Metrics", template: "nodejs-app", namespace: "production", createdAt: "2026-02-10", url: "#" },
  { id: "dash-2", name: "Cluster EU Overview", template: "k8s-overview", namespace: "monitoring", createdAt: "2026-02-05", url: "#" },
];

export default function GrafanaPage() {
  return (
    <div className="space-y-6">
      {/* Templates */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Templates Disponibles</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div key={t.id} className="rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h4 className="text-sm font-semibold text-card-foreground mb-1">{t.name}</h4>
              <p className="text-xs text-muted-foreground mb-3">{t.desc}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {t.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">{tag}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1">
                  <ExternalLink className="h-3 w-3" /> Voir
                </Button>
                <Button size="sm" className="flex-1 h-8 text-xs">Déployer</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployed */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Mes Dashboards Déployés</h3>
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dashboard</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Template</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Namespace</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Créé le</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deployed.map((d) => (
                  <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-card-foreground">{d.name}</td>
                    <td className="px-4 py-3"><span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{d.template}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{d.namespace}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{d.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7"><ExternalLink className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
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
