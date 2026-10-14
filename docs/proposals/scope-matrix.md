# Scope Matrix — Meeting Summary → Track B / Track A

**Client package:** Flower Shop POS + Messenger  
**Track B:** Manual Messenger encode + Admin POS (₱30,000)  
**Track A:** Meta + AI automation (Phase 2, ₱55k–₱85k + monthly)  
**Legend:** **Include** = in Track B · **Later** = after Track B / paid add-on · **Track A** = Meta automation only · **Out** = not sold in this package  

---

## 1. Centralized order management

| Requirement (from Meeting Summary) | Track B | Track A | Notes |
|------------------------------------|---------|---------|-------|
| Orders from Facebook Messenger recorded in the system | **Include** | Include (auto) | B = staff encodes; A = bot creates |
| Central place to manage orders regardless of channel | **Include** | Include | Walk-in / call also encodable in POS |
| Reduce missed orders, duplicates, confusion | **Include** | Include | Process change: “no order without POS record” |
| Automatic import from Messenger inbox | **Out** of B | **Track A** | Needs Meta permissions + review |

---

## 2. Automatic stock and availability

| Requirement | Track B | Track A | Notes |
|-------------|---------|---------|-------|
| Stock decreases when order is confirmed | **Include** | Include | Same POS rule |
| Display Sold Out / Unavailable at zero | **Include** | Include | Shown in admin; bot can read in A |
| Prevent overbooking by checking qty before accept | **Include** | Include | Staff checks POS (B); bot checks (A) |
| Owner can adjust stock when supplies arrive | **Include** | Include | Restock UI |
| Multi-warehouse / supplier inventory ERP | **Out** | Out | Beyond boutique POS |

---

## 3. Pre-order management for imported flowers

| Requirement | Track B | Track A | Notes |
|-------------|---------|---------|-------|
| Support pre-orders for imported / scarce flowers | **Include** | Include | Pre-order flag on order/product |
| Notify owner that supplier order is needed | **Include** | Include | In-app reminder list / dashboard |
| Follow-up reminders (1 day, 2 days, interval) | **Include** | Include | In-app due dates / checklist |
| SMS / email push reminders to owner phone | **Later** | Later | Messaging cost; optional add-on |
| Automatic purchase orders to suppliers | **Out** | Out | Separate ops product |

---

## 4. Calendar and delivery scheduling

| Requirement | Track B | Track A | Notes |
|-------------|---------|---------|-------|
| Confirmed pickup/delivery appear on calendar | **Include** | Include | Auto from confirmed order date |
| Show scheduled date for prep planning | **Include** | Include | |
| Monitor upcoming pickups and deliveries | **Include** | Include | Calendar + “today / tomorrow” views |
| Driver GPS / live map | **Out** | Out | Explicitly out of package |

---

## 5. Order filtering by date and location

| Requirement | Track B | Track A | Notes |
|-------------|---------|---------|-------|
| Filter by scheduled date | **Include** | Include | |
| Filter by delivery / pickup location | **Include** | Include | e.g. San Jose today |
| Peak-season organization (Valentine’s, Mother’s Day) | **Include** | Include | Filters + calendar |
| Route optimization / batching algorithm | **Later** | Later | Nice-to-have after volume known |

---

## 6. Flower information and reference

| Requirement | Track B | Track A | Notes |
|-------------|---------|---------|-------|
| Meanings of flowers and colors | **Include** | Include | Staff reference section |
| Common arrangements / gift tips | **Include** | Include | Static / editable content |
| Customer-facing public encyclopedia website | **Out** | Out | Staff tool only; no public site |
| Bot answers meanings in Messenger | **Out** of B | **Track A** | AI uses same content |

---

## 7. Customer requests, customization, and changes

| Requirement | Track B | Track A | Notes |
|-------------|---------|---------|-------|
| Special instructions section per order | **Include** | Include | |
| Ribbon color | **Include** | Include | |
| Wrapper color / design | **Include** | Include | |
| Greeting card message | **Include** | Include | |
| Additional decorations / add-ons | **Include** | Include | |
| Update when customer changes request | **Include** | Include | Edit + simple change history |
| Cancellation request recorded | **Include** | Include | Cancelled status |
| Photo mockup designer for bouquets | **Out** | Out | Design tool, not POS |

---

## 8. Budget / packaging constraints

| Requirement | Track B | Track A | Notes |
|-------------|---------|---------|-------|
| Practical, affordable essentials first | **Include** | Premium | B = ₱30k; A = separate |
| Additional features later if needed | **Later** | Track A / Later | See proposal §7 Out list |
| ₱15,000 website starter (old offer) | **Out** | Out | Superseded; see website-scope-parked |
| Auto Messenger + AI inside ₱15–30k | **Out** | Out | Not financially viable |

---

## 9. Problems listed in Meeting Summary §II (coverage)

| Problem | Solved by |
|---------|-----------|
| Facebook orders not centrally recorded | Track B (manual) / Track A (auto) |
| Manual stock hard in peak season | Track B stock + sold out |
| Imported pre-orders / supplier follow-ups forgotten | Track B pre-order reminders |
| Pickup/delivery schedules manual | Track B calendar |
| Hard to organize by date/location in peak | Track B filters |
| Customer requests overlooked | Track B customization fields |
| Overbooking without stock check | Track B confirm + stock |
| Staff need flower meanings reference | Track B reference section |

---

## 10. Build screens implied by Track B (implementation hint)

Not a commitment to exact UI, but scope completeness check:

1. Login  
2. Dashboard (today)  
3. New Order / Edit Order  
4. Orders list + filters  
5. Calendar  
6. Inventory / products  
7. Pre-orders / reminders  
8. Reference (flower meanings)  
9. Settings (locations, users)  

No customer storefront routes in the sold system.
