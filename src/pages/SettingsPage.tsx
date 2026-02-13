import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    argocdUrl: "https://argocd.example.com",
    argocdToken: "",
    grafanaUrl: "https://grafana.example.com",
    grafanaKey: "",
    apmEndpoint: "https://apm.example.com",
    alertmanagerUrl: "https://alertmanager.example.com",
    refreshInterval: "30",
    emailNotif: true,
    slackNotif: true,
    slackWebhook: "",
  });

  const update = (key: string, value: string | boolean) => setSettings((s) => ({ ...s, [key]: value }));

  const save = () => toast({ title: "Settings sauvegardés", description: "Configuration mise à jour avec succès." });

  return (
    <div className="max-w-3xl space-y-6">
      <Tabs defaultValue="integrations">
        <TabsList className="bg-muted">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground">Général</h3>
            <div className="space-y-1.5">
              <Label className="text-xs">Refresh Interval (seconds)</Label>
              <Input value={settings.refreshInterval} onChange={(e) => update("refreshInterval", e.target.value)} className="max-w-[200px] h-9" />
            </div>
            <Button size="sm" className="gap-1.5" onClick={save}><Save className="h-3.5 w-3.5" /> Sauvegarder</Button>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6 space-y-6">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground">ArgoCD</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">URL</Label>
                <Input value={settings.argocdUrl} onChange={(e) => update("argocdUrl", e.target.value)} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">API Token</Label>
                <Input type="password" value={settings.argocdToken} onChange={(e) => update("argocdToken", e.target.value)} placeholder="••••••••" className="h-9" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground">Grafana</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">URL</Label>
                <Input value={settings.grafanaUrl} onChange={(e) => update("grafanaUrl", e.target.value)} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">API Key</Label>
                <Input type="password" value={settings.grafanaKey} onChange={(e) => update("grafanaKey", e.target.value)} placeholder="••••••••" className="h-9" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground">APM & Alertmanager</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Elastic APM Endpoint</Label>
                <Input value={settings.apmEndpoint} onChange={(e) => update("apmEndpoint", e.target.value)} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Alertmanager URL</Label>
                <Input value={settings.alertmanagerUrl} onChange={(e) => update("alertmanagerUrl", e.target.value)} className="h-9" />
              </div>
            </div>
          </div>

          <Button size="sm" className="gap-1.5" onClick={save}><Save className="h-3.5 w-3.5" /> Sauvegarder</Button>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Notifications Email</Label>
                <Switch checked={settings.emailNotif} onCheckedChange={(v) => update("emailNotif", v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Notifications Slack</Label>
                <Switch checked={settings.slackNotif} onCheckedChange={(v) => update("slackNotif", v)} />
              </div>
              {settings.slackNotif && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Slack Webhook URL</Label>
                  <Input value={settings.slackWebhook} onChange={(e) => update("slackWebhook", e.target.value)} placeholder="https://hooks.slack.com/..." className="h-9" />
                </div>
              )}
            </div>
            <Button size="sm" className="gap-1.5" onClick={save}><Save className="h-3.5 w-3.5" /> Sauvegarder</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
