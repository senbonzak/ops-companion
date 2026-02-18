import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSettings, useUpdateSettings } from "@/hooks/use-api";
import { Save, Loader2 } from "lucide-react";
import type { Settings } from "@/services/api";

const defaultSettings: Settings = {
  argocdUrl: "",
  argocdToken: "",
  grafanaUrl: "",
  grafanaKey: "",
  apmEndpoint: "",
  apmToken: "",
  alertmanagerUrl: "",
  alertmanagerToken: "",
  refreshInterval: "30",
  emailNotif: true,
  slackNotif: false,
  slackWebhook: "",
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { data: savedSettings, isLoading, error } = useSettings();
  const updateMutation = useUpdateSettings();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Charger les settings depuis le backend
  useEffect(() => {
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, [savedSettings]);

  const update = (key: keyof Settings, value: string | boolean) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const save = () => {
    updateMutation.mutate(settings, {
      onSuccess: () => {
        toast({ title: "Settings sauvegardés", description: "Configuration mise à jour avec succès." });
      },
      onError: () => {
        toast({ title: "Erreur", description: "Impossible de sauvegarder les settings.", variant: "destructive" });
      },
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Chargement des settings...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-destructive">Erreur de connexion au backend</div>;
  }

  const isSaving = updateMutation.isPending;

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
            <Button size="sm" className="gap-1.5" onClick={save} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Sauvegarder
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6 space-y-6">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground">ArgoCD</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">URL</Label>
                <Input value={settings.argocdUrl} onChange={(e) => update("argocdUrl", e.target.value)} placeholder="https://argocd.example.com" className="h-9" />
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
                <Input value={settings.grafanaUrl} onChange={(e) => update("grafanaUrl", e.target.value)} placeholder="https://grafana.example.com" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">API Key</Label>
                <Input type="password" value={settings.grafanaKey} onChange={(e) => update("grafanaKey", e.target.value)} placeholder="••••••••" className="h-9" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground">Elasticsearch (APM)</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Endpoint URL</Label>
                <Input value={settings.apmEndpoint} onChange={(e) => update("apmEndpoint", e.target.value)} placeholder="http://elk.example.lan:9200" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Token / API Key (optionnel)</Label>
                <Input type="password" value={settings.apmToken} onChange={(e) => update("apmToken", e.target.value)} placeholder="Laisser vide si pas d'auth" className="h-9" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground">Alertmanager</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">URL</Label>
                <Input value={settings.alertmanagerUrl} onChange={(e) => update("alertmanagerUrl", e.target.value)} placeholder="https://alertmanager.example.com" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Token (optionnel)</Label>
                <Input type="password" value={settings.alertmanagerToken} onChange={(e) => update("alertmanagerToken", e.target.value)} placeholder="Laisser vide si pas d'auth" className="h-9" />
              </div>
            </div>
          </div>

          <Button size="sm" className="gap-1.5" onClick={save} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Sauvegarder
          </Button>
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
            <Button size="sm" className="gap-1.5" onClick={save} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Sauvegarder
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
