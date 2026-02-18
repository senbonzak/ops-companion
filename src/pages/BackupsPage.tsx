import { HardDrive, Database, Settings } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { useBackups } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";

export default function BackupsPage() {
  const { data, isLoading, error } = useBackups();

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Chargement des backups...</div>;
  }

  if (error || !data) {
    return <div className="flex items-center justify-center h-64 text-destructive">Erreur de connexion au backend</div>;
  }

  // Elasticsearch non configuré
  if (!data.configured) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm text-center space-y-3">
        <div className="rounded-lg bg-primary/10 p-3 w-fit mx-auto">
          <Database className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-card-foreground">Backups non configurés</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Configurez l'endpoint Elasticsearch (APM Endpoint) dans les Settings pour voir les snapshots.
          Les snapshots doivent être configurés côté Elasticsearch (repository + policy).
        </p>
        <Button asChild size="sm" variant="outline" className="gap-1.5">
          <Link to="/settings"><Settings className="h-3.5 w-3.5" /> Aller aux Settings</Link>
        </Button>
      </div>
    );
  }

  // ES configuré mais pas de repository de snapshots
  if (!data.hasSnapshots) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm text-center space-y-3">
          <div className="rounded-lg bg-yellow-500/10 p-3 w-fit mx-auto">
            <HardDrive className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-sm font-semibold text-card-foreground">Aucun repository de snapshots</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Elasticsearch est connecté mais aucun repository de snapshots n'est configuré.
            Configurez un repository (S3, NFS, etc.) dans Elasticsearch pour activer les backups.
          </p>
        </div>
      </div>
    );
  }

  const snapshots = data.snapshots;
  const repositories = data.repositories;

  return (
    <div className="space-y-6">
      {/* Repositories */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Repositories ({repositories.length})</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repositories.map((repo) => (
            <div key={repo.name} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-card-foreground">{repo.name}</span>
              </div>
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{repo.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Snapshots */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Snapshots ({snapshots.length})</h3>
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Snapshot</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Repository</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durée</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Index</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Shards</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Aucun snapshot trouvé</td>
                  </tr>
                )}
                {snapshots.map((s) => (
                  <tr key={`${s.repository}-${s.id}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-card-foreground font-mono text-xs">{s.id}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{s.repository}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {s.startTime ? formatDistanceToNow(new Date(s.startTime), { addSuffix: true, locale: fr }) : '-'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{s.duration || '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.indices}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {s.successfulShards}/{s.totalShards}
                      {s.failedShards > 0 && (
                        <span className="text-destructive ml-1">({s.failedShards} failed)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.state === 'SUCCESS' ? 'success' : s.state === 'IN_PROGRESS' ? 'info' : 'warning'} />
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
