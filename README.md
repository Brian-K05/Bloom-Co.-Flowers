# Bloom Desk — Track B POS (+ archived storefront concepts)

Presentation-ready **admin POS** for encoding Messenger (and walk-in/call) flower orders. Stock, calendar, pre-order reminders, and five switchable desk UIs. Meta Messenger automation is **Phase 2**.

**Demo Prototype — Products, branding, pricing, and business information are for demonstration purposes.**

## Presentation entry

1. Open **`/admin`**
2. Login: `owner` / `demo123` or `staff` / `demo123`
3. Walkthrough notes: [docs/proposals/presenter-notes-track-b.md](docs/proposals/presenter-notes-track-b.md)

## Supabase (recommended for demos)

POS data can live in **Supabase Postgres** so every machine / host shares the same seed and mutations.

1. Create a Supabase project (or use your empty one)
2. SQL Editor → run [`supabase/bootstrap.sql`](supabase/bootstrap.sql) once
3. Copy URL + anon key into `.env.local` (see [`.env.example`](.env.example)):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

4. Restart `npm run dev` — header shows `Data: Supabase`
5. Dashboard → **Reset demo** re-seeds via `reset_pos_demo()`

Full notes: [supabase/README.md](supabase/README.md)

If env vars are missing, the app falls back to **localStorage** so Playwright / offline preview still work.

## Run locally

```bash
npm install
npm run dev
```

## Build & test

```bash
npm run build
npm run preview
npm test
```

## What’s included (Track B)

- Demo auth (owner / staff)
- Products with stock qty + Sold Out
- New/Edit order: customer, recipient, date, pickup/delivery, location, customizations
- Statuses: Pending → Confirmed → Preparing → Ready/Out → Completed / Cancelled
- Stock deduct on Confirm; restock UI; cancel restores stock
- Orders filters (date, location, status, source)
- Calendar of scheduled fulfillments
- Pre-order flag + supplier reminder checklist
- Flower meanings reference (editable seed CMS)
- Dashboard today metrics
- Five POS themes: Counter Clear, Peak Board, Bloom Ledger, Night Shift, Studio Grid
- Playwright coverage for login, order flow, filters, calendar, theme switch, mobile nav
- Supabase schema + seed + reset RPC (optional env)

No Meta webhooks or live payments in this phase.

## Archived storefront

Public shop routes and the `/concepts` gallery remain in the repo for design history; they are **not** the client sellable product for this phase.
