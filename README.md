# DevOps Monitoring - Frontend

Interface React + TypeScript pour la plateforme DevOps Monitoring.
Consomme l'API backend pour afficher l'etat des services ArgoCD, Alertmanager, Grafana et Elastic APM.

## Prerequisites

- Node.js >= 18
- npm >= 9
- Backend demarre sur `http://localhost:3001` (voir `backend/README.md`)

## Installation

```bash
cd front
npm install
```

## Demarrage

```bash
npm run dev
```

L'application demarre sur `http://localhost:8080`.

> Le backend doit tourner en parallele sur le port 3001 pour que les donnees s'affichent.

## Scripts

| Commande            | Description                          |
|---------------------|--------------------------------------|
| `npm run dev`       | Serveur dev Vite (port 8080)         |
| `npm run build`     | Build de production                  |
| `npm run preview`   | Previsualiser le build               |
| `npm run lint`      | Linter ESLint                        |
| `npm run test`      | Lancer les tests Vitest              |
| `npm run test:watch`| Tests en mode watch                  |

## Authentification

L'application est protegee par un systeme de login (JWT).

- Au premier acces, l'utilisateur est redirige vers `/login`
- Apres connexion, le token JWT est stocke dans `localStorage`
- Le token est envoye automatiquement sur chaque appel API (`Authorization: Bearer`)
- Si le token expire (24h), l'utilisateur est deconnecte automatiquement
- Un bouton **Logout** est disponible dans la topbar

**Credentials par defaut** : `admin` / `admin` (configurable dans le `.env` du backend).

## Pages

| Route             | Page             | Description                                  | Auth    |
|-------------------|------------------|----------------------------------------------|---------|
| `/login`          | Login            | Page de connexion                            | Public  |
| `/`               | Dashboard        | Vue d'ensemble (stats, charts, activite)     | Protege |
| `/argocd`         | ArgoCD           | Liste des apps, filtres, sync, detail modal  | Protege |
| `/backups`        | Backups          | CNPG Postgres + Elasticsearch snapshots      | Protege |
| `/alertmanager`   | Alertmanager     | Alertes actives, envoi d'alertes de test     | Protege |
| `/apm`            | APM              | Services instrumentes, metriques de latence  | Protege |
| `/grafana`        | Grafana          | Templates de dashboards deployes             | Protege |
| `/settings`       | Settings         | Configuration des integrations et notifs     | Protege |

## Architecture

```
front/src/
├── components/
│   ├── ui/               # Composants shadcn/ui (Button, Input, Dialog...)
│   ├── AppSidebar.tsx    # Sidebar de navigation
│   ├── StatCard.tsx      # Carte de statistique
│   └── StatusBadge.tsx   # Badge de statut (Healthy, Degraded...)
├── hooks/
│   ├── use-api.ts        # Hooks React Query (useDashboard, useArgocdApps...)
│   ├── use-auth.tsx      # AuthContext, AuthProvider, useAuth hook
│   ├── use-toast.ts      # Hook pour les notifications toast
│   └── use-mobile.tsx    # Detection mobile
├── pages/
│   ├── LoginPage.tsx     # Page de connexion
│   ├── DashboardPage.tsx
│   ├── ArgocdPage.tsx
│   ├── BackupsPage.tsx
│   ├── AlertmanagerPage.tsx
│   ├── ApmPage.tsx
│   ├── GrafanaPage.tsx
│   └── SettingsPage.tsx
├── services/
│   ├── api.ts            # Client API + types TypeScript
│   └── auth.ts           # Service auth (login, logout, token)
├── data/
│   └── mock.ts           # Donnees mock (plus utilisees, gardees en reference)
├── App.tsx               # Router + providers
└── main.tsx              # Point d'entree
```

## Connexion au backend

L'URL du backend est configuree via la variable d'environnement `VITE_API_URL`.

### Configuration

```bash
# 1. Copier le template
cp .env.example .env              # pour le dev local
cp .env.example .env.production   # pour le build de production

# 2. Modifier VITE_API_URL dans le fichier copie
# .env             → http://localhost:3001/api
# .env.production  → https://votre-backend.example.com/api
```

> **IMPORTANT** : `VITE_API_URL` est injectee au **build time** par Vite. Si vous changez cette valeur, vous devez **rebuilder** le frontend (`npm run build`).

| Fichier            | Role                          | Git     |
|--------------------|-------------------------------|---------|
| `.env.example`     | Template (reference)          | Commite |
| `.env`             | Dev local (`npm run dev`)     | Ignore  |
| `.env.production`  | Build prod (`npm run build`)  | Ignore  |

### Hooks React Query

Chaque page utilise un hook qui fetch et cache les donnees automatiquement :

| Hook              | Endpoint                  | Refresh     |
|-------------------|---------------------------|-------------|
| `useDashboard()`  | `GET /api/dashboard`      | 30 secondes |
| `useArgocdApps()` | `GET /api/argocd/apps`    | 30 secondes |
| `useBackups()`    | `GET /api/backups`        | 60 secondes |
| `useAlerts()`     | `GET /api/alerts`         | 15 secondes |
| `useGrafana()`    | `GET /api/grafana/dashboards` | 60 secondes |
| `useSettings()`   | `GET /api/settings`       | Manuel      |

## Stack technique

| Technologie        | Usage                              |
|--------------------|------------------------------------|
| React 18           | Framework UI                       |
| TypeScript         | Typage statique                    |
| Vite               | Bundler + dev server               |
| TanStack Query     | Data fetching + cache              |
| React Router v6    | Routing                            |
| shadcn/ui + Radix  | Composants UI                      |
| Tailwind CSS       | Styles                             |
| Recharts           | Graphiques (donut, line, bar)      |
| date-fns           | Formatage des dates                |
