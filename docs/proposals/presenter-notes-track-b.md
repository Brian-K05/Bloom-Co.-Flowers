# Presenter notes — Track B POS (Bloom Desk)

**Open:** `/admin` → login `owner` / `demo123` (or `staff` / `demo123`)

## Story in 90 seconds

1. **Owner problem:** Most orders arrive on Messenger. Staff need one desk to encode them so stock, calendar, and prep stay accurate.
2. **What we built (Track B):** Admin-only POS on **Supabase** — product CRUD, New Order, status flow, stock deduct on Confirm, calendar + Google Calendar, pre-order reminders, flower reference, five UI themes. Demo catalog comes from SQL **seeders** (`reset_pos_demo`), not a hardcoded product list in the app.
3. **What we did not build:** Customer website (old ₱15k Word proposal), Meta webhooks, AI bot, payment gateway. Those are **Phase 2 / Track A**.

## Live demo path

1. Login → Dashboard (today counts).
2. **New order** — source Messenger; fill customer, location, date, ribbon/wrapper/card; save.
3. Open the order → **Confirm** → show Inventory stock dropped.
4. **Orders** filters (date / location / status / source).
5. **Calendar** week strip for peak-day prep.
6. **Pre-orders** reminder checklist.
7. **Concepts** — flip Counter Clear → Peak Board → Bloom Ledger → Night Shift → Studio Grid.

## Pricing talk track

Track B is the ₱30k presentation scope: working desk now. Meta automation is a separate phase so the client is not blocked waiting on platform approval.

## Reset

Dashboard → **Reset demo** restores seed products, orders, and articles (Supabase RPC `reset_pos_demo()` when configured; otherwise localStorage).

## Supabase (shared demo DB)

If presenting from a hosted URL with `VITE_SUPABASE_*` set, everyone sees the same database. Run `supabase/bootstrap.sql` once on a fresh project; see `supabase/README.md`.
