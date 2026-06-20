# Vow — Wedding Planner MVP

A premium, editorial-style wedding planning app for couples who want to feel in control of their day.

## Running the app

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

---

## What's included in the MVP

| Module | Features |
|--------|---------|
| **Overview** | Wedding name, venue, countdown, planning progress ring, budget summary, RSVP summary, next 3 tasks, quick-add actions |
| **Checklist** | 25 seeded tasks across 5 planning phases, mark complete, add/delete, filter by status, progress per phase |
| **Budget** | 10 expense categories, planned vs. actual amounts, status (paid/partial/upcoming), add/edit/delete, running totals |
| **Guests** | 30 seeded guests, RSVP status, side, group, dietary needs, plus-ones, search, sort, filter |
| **Seating** | 8 named tables, capacity tracking, assign/unassign guests per table, add/edit/delete tables |

All state is in-memory (no backend, no localStorage persistence). Seeded mock data makes the app feel immediately alive.

---

## Intentionally left out (V1 scope)

- **No backend / auth** — this is a frontend-only demo
- **No data persistence** — state resets on refresh by design
- **No vendor directory or marketplace** — out of scope
- **No drag-and-drop floor plan** — table-based assignment is simpler and more reliable
- **No payments or contract management**
- **No social features, sharing, or chat**
- **No email/RSVP collection** — guests are managed manually
- **No mobile app** — responsive web only

---

## Suggested V2 features

1. **Supabase backend** — auth + real-time sync across devices
2. **RSVP collection link** — shareable URL guests can fill out themselves
3. **Drag-and-drop seating** — visual floor plan with table positioning
4. **Vendor contacts** — lightweight CRM: name, category, phone, contract status
5. **Timeline view** — Gantt-style visual of tasks and deadlines
6. **Budget by vendor** — link budget items to specific vendors
7. **Photo uploads** — mood board and inspiration images
8. **PDF export** — seating chart, guest list, budget summary
9. **Multi-user** — couple can both access and edit on separate devices
10. **Push reminders** — task due-date notifications

---

## Product rationale

**The editorial aesthetic is functional, not decorative.** By using generous whitespace, a restrained neutral palette, and a display serif only for headings, the interface signals calm and confidence rather than busyness. Couples planning a wedding are often overwhelmed — the app deliberately avoids adding to that noise.

**One accent color (warm tan/camel) does all the work.** It appears on progress fills, the countdown ring, and primary actions. Limiting it to a single hue keeps the interface from feeling cluttered while still giving the eye a place to rest.

**Typography hierarchy creates the premium feel.** Cormorant Garant for names and section heads gives editorial weight without being ornate. Inter handles data cleanly. The contrast between serif and sans-serif creates visual structure with zero additional decoration.

**Empty states are designed, not default.** Each module has a considered empty state with a headline and a prompt — because the first-time experience is part of the product.

**Dark mode is a first-class feature.** At 11pm when one person is scrolling the guest list in bed, a warm dark mode matters. It uses the same neutral palette — no aggressive blacks, just deep warm charcoal.
