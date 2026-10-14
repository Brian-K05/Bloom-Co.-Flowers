# Bloom Desk — Track B POS (+ archived storefront concepts)

Presentation-ready **admin POS** for encoding Messenger (and walk-in/call) flower orders. Stock, calendar, pre-order reminders, and five switchable desk UIs. Meta Messenger automation is **Phase 2**.

**Demo Prototype — Products, branding, pricing, and business information are for demonstration purposes.**

## Presentation entry

1. Open **`/admin`**
2. Login: `owner` / `demo123` or `staff` / `demo123`
3. Walkthrough notes: [docs/proposals/presenter-notes-track-b.md](docs/proposals/presenter-notes-track-b.md)

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

Data lives in `localStorage` (reset from Dashboard). No backend, no Meta webhooks, no live payments.

## Archived storefront

Public shop routes and the `/concepts` gallery remain in the repo for design history; they are **not** the client sellable product for this phase.
