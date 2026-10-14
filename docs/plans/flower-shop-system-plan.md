# Flower Shop Online Ordering System — Project Plan

> **SUPERSEDED (2026-10-15)**  
> This document describes the old **₱15,000 customer website** package.  
> The client direction is now **admin-only POS + Messenger ordering** (no public storefront).  
> **Use instead:**  
> - [Flower Shop POS + Messenger Proposal](../proposals/flower-shop-pos-messenger-proposal.md)  
> - [Scope matrix](../proposals/scope-matrix.md)  
> - [Owner alignment checklist](../proposals/owner-alignment-checklist.md)  
> - [Website scope parked](../proposals/website-scope-parked.md)  
> Keep this file for history only. Do not sell or implement this plan for the current client package.

---

**Client package:** ₱15,000 Starter (Salora Tech Solutions) — *historical*  
**Source:** `PROPOSE_SYSTEM_FLOWER SHOP (1).docx`  
**Demo brand (until client branding):** Bloom & Co.  
**Plan date:** 2026-10-10  
**Goal:** Deliver a complete, production-ready single-shop ordering system with **3 working design versions** (same features, different aesthetics) so the client can choose a look — plus a clear backlog for future paid upgrades.

---

## 1. Product outcome

Give the flower shop:

- A professional online storefront customers can use on phone and desktop  
- Customer accounts, cart, checkout, delivery/pickup, manual payments  
- Admin tools for products and orders  
- Three complete visual themes the client can preview and select  

**Not in ₱15k (future phases):** payment gateway, SMS/email automation, advanced inventory, GPS rider tracking, loyalty, multi-branch, POS, mobile app, AI chatbot (see §7).

---

## 2. Design strategy — 3 versions (all working)

One codebase, **shared business logic**, three **full design systems** (theme packs). Client can switch themes (or we set their chosen default at launch).

| Version | Codename | Feeling | Visual direction |
|--------|----------|---------|------------------|
| **A** | **Atelier Soft** | Warm boutique, romantic, soft luxury | Ivory/cream, muted rose, charcoal, soft serif + clean sans, large photography, editorial whitespace |
| **B** | **Garden Modern** | Fresh, bright, contemporary retail | Soft white + botanical green + blush accents, geometric layouts, bold product grid, lively but still premium |
| **C** | **Noir Bloom** | Dramatic, fashion-editorial | Deep charcoal/near-black surfaces, cream type, single rose accent, high-contrast hero, gallery-style product pages |

### Homepage mockups (Sprint 0)

Generated for client comparison. Open the files in `docs/plans/mockups/`:

| Version | File |
|--------|------|
| A — Atelier Soft | [theme-a-atelier-soft-home.jpg](./mockups/theme-a-atelier-soft-home.jpg) |
| B — Garden Modern | [theme-b-garden-modern-home.jpg](./mockups/theme-b-garden-modern-home.jpg) |
| C — Noir Bloom | [theme-c-noir-bloom-home.jpg](./mockups/theme-c-noir-bloom-home.jpg) |

**Implementation note for Version C:** Keep the dark editorial mood, but shift any purple cast toward charcoal + muted rose (proposal palette), not violet SaaS tones.

### Design rules (all versions)

- Creative, modern, interactive — **not** a plain template  
- Flower photography carries most of the color  
- Strong motion: hover, page transitions, cart feedback, image reveals (subtle, not noisy)  
- Excellent mobile UX  
- Avoid: neon, purple SaaS look, excessive cards/shadows, fake stats/reviews  

### ChatGPT / image-gen prompts (for mockups)

Use these to generate **homepage + shop + product** mockups before Sprint 2 coding. Paste into ChatGPT / Midjourney / similar.

**Version A — Atelier Soft**

> Design a premium boutique flower shop homepage mockup, desktop and mobile. Brand: warm ivory and cream backgrounds, muted rose and soft burgundy accents, deep charcoal typography, subtle gold details. Elegant serif display headlines + modern sans body. Full-bleed hero with soft peach and white rose bouquet, brand name large, one primary CTA “Shop Flowers”. Editorial “Shop by Moment” section, refined product grid without heavy cards, generous whitespace. Luxury independent florist, not marketplace. No neon, no purple gradients, no fake review badges.

**Version B — Garden Modern**

> Design a modern fresh flower e-commerce homepage, desktop and mobile. Soft white background, botanical sage green and soft blush accents, charcoal text. Clean geometric sections, confident sans headings with one display accent font. Bright natural daylight flower photography. Interactive product cards with smooth hover zoom, sticky mobile cart, clear category chips. Feeling: contemporary garden studio + easy online shopping. Premium but approachable. No cartoon florals, no cluttered icon rows.

**Version C — Noir Bloom**

> Design a dramatic dark editorial flower boutique website homepage, desktop and mobile. Near-black and deep charcoal backgrounds, cream and ivory typography, single muted rose accent. Fashion-magazine hero with dark moody rose photography, oversized typography, minimal navigation. Product pages feel like a gallery. Sparse layout, high contrast, sophisticated motion. Luxury night-time florist aesthetic. Not cyberpunk, not neon, not generic dark SaaS.

---

## 3. Architecture (₱15k build)

| Layer | Choice | Notes |
|-------|--------|--------|
| Frontend | React + TypeScript + Vite + Tailwind | Theme tokens via CSS variables / theme provider |
| Themes | 3 design packs (`atelier`, `garden`, `noir`) | Same routes & components; different tokens, type, spacing, hero layouts |
| Backend | Lightweight API (e.g. Supabase or Firebase) | Auth, products, orders, storage for payment proofs |
| Auth | Email/password + forgot password | Customer + admin roles |
| Payments | Manual only | COD / pickup / GCash / Maya / bank + QR + proof upload |
| Hosting | Vercel (or similar) + managed DB | Aligns with current GitHub repo |

**Repo note:** Current Bloom & Co. frontend is a **visual prototype**. This plan replaces mock-only state with real auth/data while keeping (and upgrading) the UX.

---

## 4. Feature backlog — INCLUDED in ₱15,000

### 4.1 Customer

| ID | Feature | Priority |
|----|---------|----------|
| C1 | Sign up / Login / Logout | P0 |
| C2 | Forgot password (basic) | P0 |
| C3 | Customer profile / My Account | P0 |
| C4 | Browse products + categories | P0 |
| C5 | Product detail (photos, description, price, availability) | P0 |
| C6 | Shopping cart | P0 |
| C7 | Checkout + place order | P0 |
| C8 | Customer + recipient info | P0 |
| C9 | Delivery address + preferred date | P0 |
| C10 | Gift/card message + order notes | P0 |
| C11 | Delivery **or** store pickup | P0 |
| C12 | Manual payments (GCash / Maya / Bank / COD) | P0 |
| C13 | Upload payment proof + reference | P0 |
| C14 | Order confirmation + summary (download/print) | P0 |
| C15 | Order history + status tracking timeline | P0 |

### 4.2 Admin / owner

| ID | Feature | Priority |
|----|---------|----------|
| A1 | Admin login | P0 |
| A2 | Product CRUD + categories | P0 |
| A3 | Set availability (+ basic stock qty if simple) | P0 |
| A4 | Manage orders | P0 |
| A5 | Review payment proof | P0 |
| A6 | Update status: Pending → Confirmed → Preparing → Ready/Out for Delivery → Completed | P0 |
| A7 | Basic order / sales summary | P1 |
| A8 | Featured + seasonal product flags | P1 |

### 4.3 Website / launch

| ID | Feature | Priority |
|----|---------|----------|
| W1 | Homepage / storefront | P0 |
| W2 | About + Contact | P0 |
| W3 | Social links | P1 |
| W4 | Mobile-responsive (all 3 themes) | P0 |
| W5 | Basic SEO (titles, meta, sitemap) | P1 |
| W6 | Theme switcher / client preview of 3 designs | P0 |
| W7 | Initial deployment + setup | P0 |
| W8 | Client content encoding (agreed volume) | P1 |

---

## 5. Future enhancements (NOT in ₱15k)

Document these in the proposal follow-up / Phase 2 quote:

| Phase | Feature | Why later |
|-------|---------|-----------|
| F1 | Automated payment gateway (PayMongo / Maya checkout / Stripe) | Needs integration + fees |
| F2 | SMS / email order notifications | Messaging costs + templates |
| F3 | Advanced inventory + auto stock deduction + low-stock alerts | Ops complexity |
| F4 | Rider / GPS tracking | Separate logistics product |
| F5 | Advanced analytics dashboard | Post-launch data needs |
| F6 | Loyalty / rewards | Marketing phase |
| F7 | Promo codes / discount engine | After catalog stabilizes |
| F8 | Multi-branch | Only if business expands |
| F9 | POS integration | Hardware + sync |
| F10 | Native mobile app | New product |
| F11 | AI chatbot / recommendations | Nice-to-have |

---

## 6. Sprint plan (≈ 2–3 weeks)

Assumes client content arrives in parallel. Adjust if materials are late.

### Sprint 0 — Align & design (2–3 days)

**Goal:** Client sees 3 visual directions before heavy build.

- Extract final IA from proposal (done in this plan)  
- Generate mockups with the ChatGPT prompts above (Home, Shop, Product × 3 themes)  
- Client picks **preferred default theme** (all 3 still ship for comparison)  
- Confirm payment methods, pickup address, delivery areas wording  
- Collect logo, photos, prices, hours, QR codes  

**Exit:** Approved visual directions + content checklist started  

---

### Sprint 1 — Foundation & auth (3–4 days)

**Goal:** Real accounts + data layer.

- Project structure: shared core + 3 theme packs  
- Backend: auth (customer + admin roles), DB schema (users, products, categories, orders, order_items)  
- C1–C3, A1  
- Forgot password flow (C2)  
- Protected routes (account, admin)  
- Seed demo catalog for development  

**Exit:** Can register, login, admin login; themes skeleton loads  

---

### Sprint 2 — Catalog & storefront themes (4–5 days)

**Goal:** Beautiful shopping in all 3 designs.

- C4–C6 product browse, detail, cart (persisted)  
- W1 homepage (hero, moments/occasions, bestsellers, how it works) — **per theme**  
- Category filters, search, availability  
- A2–A3, A8 product admin  
- W4 mobile pass for storefront  
- Interactive polish: image hover, toasts, cart badge motion  

**Exit:** Full browse → cart works in themes A/B/C  

---

### Sprint 3 — Checkout, payments, orders (4–5 days)

**Goal:** End-to-end order placement.

- C7–C14 checkout, fulfillment, manual payment, proof upload  
- Order confirmation + downloadable summary  
- C15 order history + timeline  
- A4–A6 admin order + payment verification + status updates  
- A7 basic sales/order summary  
- Email optional later (F2) — for now in-app status only  

**Exit:** Customer can place order; admin can verify and progress status  

---

### Sprint 4 — Polish, SEO, deploy, handoff (2–3 days)

**Goal:** Launch-ready.

- W2–W3 About/Contact/social  
- W5 basic SEO  
- W6 theme preview page (“Choose your look”) for client presentation  
- W7 deploy (Vercel + DB)  
- Load client content (W8)  
- Bug bash, mobile QA all 3 themes  
- 2 revision rounds (per proposal)  
- Handoff: admin credentials, how-to guide, 30-day bug-fix window starts  

**Exit:** Live URL + client training  

---

## 7. Theme implementation approach

```
src/
  themes/
    atelier/   tokens.css + layout accents
    garden/
    noir/
  components/  shared (Button, ProductCard accept theme classes)
  pages/       shared routes
```

- `ThemeProvider` + localStorage + `?theme=atelier|garden|noir`  
- Client launch: set `DEFAULT_THEME` to their choice  
- Keep other themes accessible at `/preview-themes` for sales demos  

---

## 8. Definition of done (₱15k)

- [ ] All P0 features in §4 work with real auth/data  
- [ ] All 3 themes fully styled for Home, Shop, Product, Cart, Checkout, Account, Admin  
- [ ] Mobile verified (iPhone-width + Android-width)  
- [ ] Manual payment + proof upload verified  
- [ ] Admin can complete an order lifecycle  
- [ ] Deployed publicly with client content  
- [ ] Basic SEO + contact/about  
- [ ] Future features listed for Phase 2 quote (not built)  

---

## 9. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Client content delayed | Launch with agreed placeholder count; swap photos later |
| 3 themes inflate schedule | Shared components; theme = tokens + a few layout variants only |
| Scope creep (gateway, SMS) | Redirect to Future backlog; separate quote |
| Design too similar to current demo | New themes from Sprint 0 mockups; do not reuse plain prototype look |

---

## 10. Immediate next steps

1. **Approve this plan** (or request edits).  
2. Generate **3 mockup sets** using the prompts in §2 (or ask the agent to generate image mockups).  
3. Start **Sprint 0 / Sprint 1** when ready (`ce-work` / implementation).  
4. Push plan to GitHub with the project.  

---

## 11. Effort snapshot

| Track | Effort |
|-------|--------|
| Design (3 themes + mockups) | ~20–25% |
| Core features (auth → orders) | ~50–55% |
| Theme application + mobile polish | ~15–20% |
| Deploy + content + revisions | ~10% |

**Calendar:** ~2–3 weeks as in the proposal, if content and feedback are timely.

---

*Salora Tech Solutions — plan derived from the Flower Shop Online Ordering System proposal (₱15,000 starter package).*
