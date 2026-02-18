import { useState, useMemo } from "react";
import { GitBranch, Search, RefreshCw, CheckCircle, AlertTriangle, XCircle, ExternalLink } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useArgocdApps } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import type { ArgocdApp } from "@/services/api";

export default function ArgocdPage() {
  const { data: argocdApps, isLoading, error } = useArgocdApps();
  const [search, setSearch] = useState("");
  const [clusterFilter, setClusterFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ArgocdApp | null>(null);
  const { toast } = useToast();

  const apps = argocdApps ?? [];

  const clusters = useMemo(() => [...new Set(apps.map((a) => a.cluster))], [apps]);

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      if (search && !app.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (clusterFilter !== "all" && app.cluster !== clusterFilter) return false;
      if (healthFilter !== "all" && app.health !== healthFilter) return false;
      return true;
    });
  }, [apps, search, clusterFilter, healthFilter]);

  const stats = useMemo(() => ({
    total: apps.length,
    healthy: apps.filter((a) => a.health === "Healthy").length,
    degraded: apps.filter((a) => a.health === "Degraded").length,
    outOfSync: apps.filter((a) => a.sync === "OutOfSync").length,
  }), [apps]);

  const handleSync = (appName: string) => {
    toast({ title: "Sync déclenché", description: `Synchronisation de ${appName} en cours...` });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Chargement des applications ArgoCD...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-destructive">Erreur de connexion au backend</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Applications" value={stats.total} icon={GitBranch} />
        <StatCard title="Healthy" value={stats.healthy} icon={CheckCircle} variant="success" />
        <StatCard title="Degraded" value={stats.degraded} icon={XCircle} variant="destructive" />
        <StatCard title="Out of Sync" value={stats.outOfSync} icon={AlertTriangle} variant="warning" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher une app..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 bg-secondary border-0" />
        </div>
        <Select value={clusterFilter} onValueChange={setClusterFilter}>
          <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Cluster" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les clusters</SelectItem>
            {clusters.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={healthFilter} onValueChange={setHealthFilter}>
          <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Health" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="Healthy">Healthy</SelectItem>
            <SelectItem value="Degraded">Degraded</SelectItem>
            <SelectItem value="Progressing">Progressing</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Switch id="auto" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          <Label htmlFor="auto" className="text-sm text-muted-foreground">Auto-refresh</Label>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Rafraîchir
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nom</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cluster</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Namespace</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Health</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sync</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Sync</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr
                  key={app.name}
                  className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedApp(app)}
                >
                  <td className="px-4 py-3 font-medium text-card-foreground">{app.name}</td>
                  <td className="px-4 py-3"><span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{app.cluster}</span></td>
                  <td className="px-4 py-3"><span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{app.namespace}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={app.health} /></td>
                  <td className="px-4 py-3"><StatusBadge status={app.sync} /></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatDistanceToNow(new Date(app.lastSync), { addSuffix: true, locale: fr })}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => handleSync(app.name)}>
                        <RefreshCw className="h-3 w-3" /> Sync
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">Aucune application trouvée</div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              {selectedApp?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Cluster</p>
                  <p className="text-sm font-medium text-foreground">{selectedApp.cluster}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Namespace</p>
                  <p className="text-sm font-medium text-foreground">{selectedApp.namespace}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Health</p>
                  <StatusBadge status={selectedApp.health} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sync Status</p>
                  <StatusBadge status={selectedApp.sync} />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Repository</p>
                <a href={selectedApp.repo} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                  {selectedApp.repo} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Sync</p>
                <p className="text-sm text-foreground">{new Date(selectedApp.lastSync).toLocaleString("fr-FR")}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => handleSync(selectedApp.name)} className="gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" /> Sync Now
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={selectedApp.repo} target="_blank" rel="noreferrer" className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" /> Ouvrir dans ArgoCD
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
