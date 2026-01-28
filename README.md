# Beban Way Market

En webbplats för Beban Way Market, en lokal matbutik i Biban, Nineveh, Irak. Butiken säljer ris, mejeriprodukter, drycker och andra dagligvaror.

## Teknik

- Next.js 15 med React 19
- Tailwind CSS
- Drizzle ORM + Cloudflare D1
- Cloudflare Workers (via OpenNext)

## Kom igång

### Installation

```bash
npm install
```

### Lokal utveckling

Starta Next.js utvecklingsserver:

```bash
npm run dev
```

### Förhandsgranska Workers-bygge lokalt

Bygg och kör appen som en Cloudflare Worker lokalt:

```bash
npm run preview
```

Detta bygger först appen med OpenNext och startar sedan `wrangler dev`.

## Deployment

### Bygg för produktion

```bash
npm run build:worker
```

Detta skapar en `.open-next/` mapp med Worker-filer och statiska assets.

### Deploya till Cloudflare Workers

```bash
npm run deploy
```

Detta bygger appen och deployar den till Cloudflare Workers.

## Databas

### Skapa D1-databas

```bash
wrangler d1 create beban-db
```

Uppdatera sedan `wrangler.toml` med det nya `database_id`.

### Generera migrationer

```bash
npm run db:generate
```

### Kör migrationer lokalt

```bash
npm run db:migrate:local
```

### Kör migrationer i produktion

```bash
npm run db:migrate
```

### Öppna Drizzle Studio

```bash
npm run db:studio
```

## Projektstruktur

```
├── app/                    # Next.js App Router
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── components/         # React komponenter
│   ├── products/           # Produktsidor
│   └── store/              # Butikssidor
├── lib/
│   ├── actions/            # Server actions
│   ├── db/                 # Databas schema & migrationer
│   └── utils/              # Hjälpfunktioner
├── public/                 # Statiska filer
├── open-next.config.ts     # OpenNext konfiguration
├── wrangler.toml           # Cloudflare Workers konfiguration
└── drizzle.config.ts       # Drizzle ORM konfiguration
```

## Miljövariabler

Skapa en `.env` fil:

```
SIMPLIFIED=true              # Aktivera förenklat läge (read-only)
```

För D1-databas i produktion, lägg till i `.dev.vars`:

```
# Automatiskt hanterad av Wrangler bindings
```
