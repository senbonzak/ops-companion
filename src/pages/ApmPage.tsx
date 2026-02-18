import { useState } from "react";
import { Activity, Cpu, Zap, AlertTriangle, Settings, Copy, Check, BookOpen } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useApmServices, useApmResponseTime, useSettings } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

// --- Snippets d'instrumentation OTel par langage ---
const SNIPPETS = [
  {
    lang: "Node.js",
    install: "npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-http",
    code: (apmUrl: string) => `// tracing.js — importer en premier dans votre app
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const sdk = new NodeSDK({
  serviceName: 'mon-service',
  traceExporter: new OTLPTraceExporter({
    url: '${apmUrl || 'http://elk.example.lan:8200'}/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();`,
    run: "node -r ./tracing.js app.js",
    customSpan: `const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer('mon-service');

async function processOrder(order) {
  return tracer.startActiveSpan('process-order', async (span) => {
    span.setAttribute('order.id', order.id);
    span.setAttribute('order.amount', order.amount);
    const result = await db.save(order);
    span.end();
    return result;
  });
}`,
  },
  {
    lang: "Python",
    install: "pip install opentelemetry-distro opentelemetry-exporter-otlp",
    code: (apmUrl: string) => `# tracing.py
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

provider = TracerProvider()
provider.add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter(
        endpoint="${apmUrl || 'http://elk.example.lan:8200'}/v1/traces"
    ))
)
trace.set_tracer_provider(provider)`,
    run: "opentelemetry-instrument python app.py",
    customSpan: `from opentelemetry import trace

tracer = trace.get_tracer("mon-service")

def process_order(order):
    with tracer.start_as_current_span("process-order") as span:
        span.set_attribute("order.id", order["id"])
        span.set_attribute("order.amount", order["amount"])
        return db.save(order)`,
  },
  {
    lang: "Java",
    install: "# Telecharger l'agent OTel Java\ncurl -LO https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar",
    code: (apmUrl: string) => `# Lancer avec l'agent Java (auto-instrumentation)
java -javaagent:opentelemetry-javaagent.jar \\
  -Dotel.service.name=mon-service \\
  -Dotel.exporter.otlp.endpoint=${apmUrl || 'http://elk.example.lan:8200'} \\
  -jar app.jar`,
    run: "",
    customSpan: `import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.GlobalOpenTelemetry;

Tracer tracer = GlobalOpenTelemetry.getTracer("mon-service");

public Order processOrder(Order order) {
    var span = tracer.spanBuilder("process-order").startSpan();
    try (var scope = span.makeCurrent()) {
        span.setAttribute("order.id", order.getId());
        span.setAttribute("order.amount", order.getAmount());
        return db.save(order);
    } finally {
        span.end();
    }
}`,
  },
  {
    lang: "Go",
    install: "go get go.opentelemetry.io/otel \\\n  go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp \\\n  go.opentelemetry.io/otel/sdk/trace",
    code: (apmUrl: string) => `package main

import (
  "go.opentelemetry.io/otel"
  "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
  sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

func initTracer() func() {
  exporter, _ := otlptracehttp.New(ctx,
    otlptracehttp.WithEndpoint("${apmUrl ? apmUrl.replace(/^https?:\/\//, '').replace(':9200', ':8200') : 'elk.example.lan:8200'}"),
    otlptracehttp.WithInsecure(),
  )
  tp := sdktrace.NewTracerProvider(
    sdktrace.WithBatcher(exporter),
  )
  otel.SetTracerProvider(tp)
  return func() { tp.Shutdown(ctx) }
}`,
    run: "",
    customSpan: `tracer := otel.Tracer("mon-service")

func processOrder(ctx context.Context, order Order) error {
  ctx, span := tracer.Start(ctx, "process-order")
  defer span.End()

  span.SetAttributes(
    attribute.String("order.id", order.ID),
    attribute.Float64("order.amount", order.Amount),
  )
  return db.Save(ctx, order)
}`,
  },
];

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      {label && <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>}
      <pre className="mt-1 rounded-md bg-muted/70 border border-border p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap text-card-foreground">
        {code}
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copier"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
    </div>
  );
}

export default function ApmPage() {
  const { data: services, isLoading, error } = useApmServices();
  const { data: responseTime } = useApmResponseTime();
  const { data: settings } = useSettings();
  const [selectedLang, setSelectedLang] = useState(0);

  // Construire l'URL APM Server (port 8200) à partir de l'endpoint ES (port 9200)
  const apmServerUrl = settings?.apmEndpoint
    ? settings.apmEndpoint.replace(':9200', ':8200').replace(/\/+$/, '')
    : '';

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Chargement des données APM...</div>;
  }

  return (
    <Tabs defaultValue="services" className="space-y-6">
      <TabsList className="bg-muted">
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="setup" className="gap-1.5">
          <BookOpen className="h-3.5 w-3.5" /> Instrumentation
        </TabsTrigger>
      </TabsList>

      {/* === Onglet Services === */}
      <TabsContent value="services">
        {error || !services ? (
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm text-center space-y-3">
            <div className="rounded-lg bg-primary/10 p-3 w-fit mx-auto">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-card-foreground">APM non configuré</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Configurez l'endpoint Elasticsearch dans les Settings pour voir les services instrumentés.
            </p>
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <Link to="/settings"><Settings className="h-3.5 w-3.5" /> Aller aux Settings</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Instances" value={services.reduce((s, x) => s + x.instances, 0)} icon={Cpu} variant="success" />
              <StatCard title="Services" value={services.length} icon={Activity} variant="info" />
              <StatCard title="Req / min" value={services.reduce((s, x) => s + x.requestsPerMin, 0)} icon={Zap} />
              <StatCard
                title="Error Rate"
                value={`${services.length > 0 ? Math.round((services.reduce((s, x) => s + x.errorRate, 0) / services.length) * 10) / 10 : 0}%`}
                icon={AlertTriangle}
                variant={services.some(s => s.errorRate > 2) ? "destructive" : "warning"}
              />
            </div>

            {responseTime && responseTime.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Temps de réponse (dernière heure)</h3>
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-end gap-1 h-32">
                    {responseTime.map((point, i) => {
                      const maxP95 = Math.max(...responseTime.map(p => p.p95), 1);
                      const heightPercent = (point.p95 / maxP95) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">{point.p95}ms</span>
                          <div
                            className="w-full rounded-t bg-primary/70 min-h-[2px]"
                            style={{ height: `${heightPercent}%` }}
                            title={`${point.time} — p95: ${point.p95}ms, p50: ${point.p50}ms`}
                          />
                          <span className="text-[9px] text-muted-foreground">{point.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Services ({services.length})</h3>
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
                      {services.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Aucun service APM détecté</td>
                        </tr>
                      )}
                      {services.map((s) => (
                        <tr key={s.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-card-foreground">{s.name}</td>
                          <td className="px-4 py-3"><span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{s.runtime}</span></td>
                          <td className="px-4 py-3 text-muted-foreground">{s.instances}</td>
                          <td className="px-4 py-3 text-card-foreground font-mono">{s.requestsPerMin}</td>
                          <td className="px-4 py-3 font-mono" style={{ color: s.errorRate > 1 ? "hsl(0,84%,60%)" : "inherit" }}>{s.errorRate}%</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono">{s.latencyP95}ms</td>
                          <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </TabsContent>

      {/* === Onglet Instrumentation === */}
      <TabsContent value="setup">
        <div className="space-y-6">
          {/* Intro */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-2">
            <h3 className="text-sm font-semibold text-card-foreground">Comment instrumenter votre application</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ajoutez le SDK OpenTelemetry dans votre app pour envoyer les traces et métriques vers le APM Server.
              Les données apparaîtront automatiquement dans l'onglet Services.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="text-xs">
                <span className="text-muted-foreground">APM Server : </span>
                <code className="rounded bg-muted px-1.5 py-0.5 text-card-foreground font-mono">
                  {apmServerUrl || 'Non configuré — définir APM Endpoint dans Settings'}
                </code>
              </div>
            </div>
          </div>

          {/* Sélecteur de langage */}
          <div className="flex gap-2">
            {SNIPPETS.map((s, i) => (
              <button
                key={s.lang}
                onClick={() => setSelectedLang(i)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedLang === i
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {s.lang}
              </button>
            ))}
          </div>

          {/* Snippet sélectionné */}
          {(() => {
            const snippet = SNIPPETS[selectedLang];
            return (
              <div className="space-y-4">
                {/* Step 1: Install */}
                <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-semibold text-card-foreground uppercase tracking-wider">1. Installation</h4>
                  <CodeBlock code={snippet.install} />
                </div>

                {/* Step 2: Setup */}
                <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-semibold text-card-foreground uppercase tracking-wider">2. Configuration</h4>
                  <CodeBlock code={snippet.code(apmServerUrl)} />
                  {snippet.run && <CodeBlock code={snippet.run} label="Lancer l'app" />}
                </div>

                {/* Step 3: Custom spans */}
                <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-semibold text-card-foreground uppercase tracking-wider">3. Spans custom (optionnel)</h4>
                  <p className="text-xs text-muted-foreground">
                    Créez des spans personnalisés pour mesurer des opérations métier spécifiques.
                  </p>
                  <CodeBlock code={snippet.customSpan} />
                </div>
              </div>
            );
          })()}
        </div>
      </TabsContent>
    </Tabs>
  );
}
