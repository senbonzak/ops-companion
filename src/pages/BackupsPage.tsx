import { useState } from "react";
import { HardDrive, Clock, Database, Download, RotateCcw, Trash2, Play } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { backupHistory, dashboardOverview } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function BackupsPage() {
  const { toast } = useToast();
  const cnpg = dashboardOverview.backups.cnpg;
  const es = dashboardOverview.backups.elasticsearch;

  const triggerBackup = (type: string) => {
    toast({ title: "Backup déclenché", description: `${type} backup en cours...` });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="cnpg">
        <TabsList className="bg-muted">
          <TabsTrigger value="cnpg">CNPG Postgres</TabsTrigger>
          <TabsTrigger value="elasticsearch">Elasticsearch</TabsTrigger>
        </TabsList>

        <TabsContent value="cnpg" className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Dernier Backup" value={formatDistanceToNow(new Date(cnpg.lastBackup), { addSuffix: true, locale: fr })} icon={Clock} variant="success" />
            <StatCard title="Prochain Backup" value={formatDistanceToNow(new Date(cnpg.nextScheduled), { addSuffix: true, locale: fr })} icon={Clock} variant="info" />
            <StatCard title="Total Backups" value={45} icon={Database} />
            <StatCard title="Storage Utilisé" value="12.5 GB" icon={HardDrive} />
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Historique des backups</h3>
            <Button size="sm" className="gap-1.5" onClick={() => triggerBackup("CNPG")}>
              <Play className="h-3.5 w-3.5" /> Test Backup Now
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date/Heure</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Database</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Taille</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durée</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {backupHistory.map((b) => (
                    <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-card-foreground font-mono text-xs">{new Date(b.timestamp).toLocaleString("fr-FR")}</td>
                      <td className="px-4 py-3 text-card-foreground">{b.database}</td>
                      <td className="px-4 py-3 text-muted-foreground">{b.size}</td>
                      <td className="px-4 py-3 text-muted-foreground">{b.duration}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><RotateCcw className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="elasticsearch" className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Dernier Snapshot" value={formatDistanceToNow(new Date(es.lastSnapshot), { addSuffix: true, locale: fr })} icon={Clock} variant="success" />
            <StatCard title="Total Snapshots" value={28} icon={Database} />
            <StatCard title="Repository" value="NFS" icon={HardDrive} />
            <StatCard title="Storage" value="8.2 GB" icon={HardDrive} />
          </div>
          <div className="flex justify-end">
            <Button size="sm" className="gap-1.5" onClick={() => triggerBackup("Elasticsearch")}>
              <Play className="h-3.5 w-3.5" /> Trigger Snapshot Now
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
            Historique des snapshots Elasticsearch — données similaires à CNPG
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
