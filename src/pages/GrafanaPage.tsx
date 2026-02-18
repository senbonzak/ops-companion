import { BarChart3, ExternalLink, Database, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGrafana } from "@/hooks/use-api";
import { Link } from "react-router-dom";

export default function GrafanaPage() {
  const { data, isLoading, error } = useGrafana();

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Chargement des dashboards Grafana...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-destructive">Erreur de connexion au backend</div>;
  }

  const dashboards = data?.dashboards ?? [];
  const datasources = data?.datasources ?? [];
  const isConfigured = dashboards.length > 0 || datasources.length > 0;

  return (
    <div className="space-y-6">
      {/* Message si Grafana non configuré */}
      {!isConfigured && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm text-center space-y-3">
          <div className="rounded-lg bg-primary/10 p-3 w-fit mx-auto">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-card-foreground">Grafana non configuré</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Configurez l'URL et la clé API Grafana dans les Settings pour voir vos dashboards et datasources.
          </p>
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link to="/settings"><Settings className="h-3.5 w-3.5" /> Aller aux Settings</Link>
          </Button>
        </div>
      )}

      {/* Dashboards */}
      {dashboards.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Dashboards ({dashboards.length})</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboards.map((d) => (
              <div key={d.uid} className="rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  {d.isStarred && (
                    <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium text-yellow-600">Favori</span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-card-foreground mb-1">{d.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">{d.uri}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {d.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">{tag}</span>
                  ))}
                  {d.tags.length === 0 && (
                    <span className="text-[10px] text-muted-foreground italic">Aucun tag</span>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1">
                  <ExternalLink className="h-3 w-3" /> Ouvrir dans Grafana
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Datasources */}
      {datasources.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Datasources ({datasources.length})</h3>
          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nom</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">URL</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Défaut</th>
                  </tr>
                </thead>
                <tbody>
                  {datasources.map((ds) => (
                    <tr key={ds.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-card-foreground flex items-center gap-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        {ds.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{ds.type}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{ds.url}</td>
                      <td className="px-4 py-3">
                        {ds.isDefault && (
                          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600">Défaut</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
