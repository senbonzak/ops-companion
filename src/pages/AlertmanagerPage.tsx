import { useState } from "react";
import { Bell, Send, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useAlerts } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function AlertmanagerPage() {
  const { toast } = useToast();
  const { data, isLoading, error } = useAlerts();
  const [alertType, setAlertType] = useState("warning");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const sendTest = () => {
    toast({ title: "Alerte de test envoyée", description: `Type: ${alertType} — "${alertTitle || "Test Alert"}"` });
    setAlertTitle("");
    setAlertMessage("");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Chargement des alertes...</div>;
  }

  if (error || !data) {
    return <div className="flex items-center justify-center h-64 text-destructive">Erreur de connexion au backend</div>;
  }

  return (
    <div className="space-y-6">
      {/* Test Alert */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground flex items-center gap-2">
          <Send className="h-4 w-4 text-primary" /> Envoyer une alerte de test
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Type d'alerte</Label>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Titre</Label>
            <Input value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} placeholder="Titre de l'alerte" className="h-9" />
          </div>
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <Label className="text-xs">Destination</Label>
            <Select defaultValue="slack">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button size="sm" className="gap-1.5 w-full" onClick={sendTest}>
              <Send className="h-3.5 w-3.5" /> Envoyer test
            </Button>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Alertes Actives ({data.alerts.length})</h3>
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Severity</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Alert Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Started</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Labels</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.alerts.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><StatusBadge status={a.severity} /></td>
                    <td className="px-4 py-3 font-medium text-card-foreground">{a.name}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDistanceToNow(new Date(a.startedAt), { addSuffix: true, locale: fr })}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {a.labels.map((l) => (
                          <span key={l} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{l}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">{a.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-7 text-xs">Silence</Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs">Ack</Button>
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
