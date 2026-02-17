# Reading Routes UI — Querétaro Mock Data

**Date**: 2026-02-16
**Status**: Approved
**Stack**: Next.js 15 + React 19 + Tailwind + Leaflet + shadcn/ui

## Overview

Two-module UI for the reading routes system with mock data for Querétaro, Mexico. Supervisor dashboard for route management and capturista mobile view for field work.

## Pages

### Supervisor Dashboard (`/routes`)

- **Stats cards**: Total routes (5), total meters (247), capturistas assigned (3), avg completion (68%)
- **Map (60% left)**: Leaflet centered on Querétaro (20.5888, -100.3899). Color-coded route polylines, numbered stop markers. Click route to highlight and show tooltip stats.
- **Route table (40% right)**: Name, capturista, stops count, distance, status, progress bar. Click to expand stop details. "Optimizar" button triggers mock optimization animation.

### Capturista View (`/capturista`)

- **Mobile-first** (max-width 480px centered)
- **Header**: Capturista name, route name, progress counter "12/47 lecturas"
- **Map**: Current route only, current position, next stop highlighted
- **Stop list**: Ordered stops with address, meter serial, last reading. Tap to expand reading capture form (meter value input, photo placeholder, observation code dropdown). Completed stops show green checkmark.

## Mock Data: Querétaro

5 routes across real neighborhoods with actual lat/lng coordinates:

1. **Ruta Centro Histórico** — ~50 stops (Jardín Zenea, Plaza Corregidora area)
2. **Ruta Juriquilla** — ~45 stops (residential northwest)
3. **Ruta El Pueblito** — ~40 stops (south Corregidora)
4. **Ruta Milenio III** — ~55 stops (newer eastern development)
5. **Ruta Satélite** — ~57 stops (north residential)

3 capturistas: Juan Pérez (routes 1,2), María López (routes 3,4), Carlos Ramírez (route 5)

## File Structure

```
supra-water/web/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.ts
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout, sidebar nav, SUPRA branding
│   │   ├── page.tsx             # Redirect to /routes
│   │   ├── routes/
│   │   │   └── page.tsx         # Supervisor dashboard
│   │   └── capturista/
│   │       └── page.tsx         # Capturista mobile view
│   ├── components/
│   │   ├── route-map.tsx        # Leaflet map with polylines + markers
│   │   ├── route-table.tsx      # Route list table with progress bars
│   │   ├── stats-cards.tsx      # Summary metric cards
│   │   ├── stop-list.tsx        # Ordered stops for capturista
│   │   ├── reading-form.tsx     # Mock reading capture form
│   │   └── period-selector.tsx  # Billing period dropdown
│   ├── data/
│   │   └── mock-queretaro.ts    # All mock data: routes, stops, capturistas
│   └── lib/
│       └── types.ts             # TypeScript types matching API schema
```

## Dependencies

- `next` 15, `react` 19, `react-dom` 19
- `tailwindcss` 4, `postcss`, `autoprefixer`
- `react-leaflet`, `leaflet`, `@types/leaflet`
- shadcn/ui components: card, table, badge, progress, button, select, input, dialog

## Implementation Tasks (10 agents)

1. **Scaffold agent**: `npx create-next-app`, install deps, configure Tailwind
2. **Types agent**: Shared TypeScript types in `lib/types.ts`
3. **Mock data agent**: `data/mock-queretaro.ts` with 5 routes, 247 stops, real coordinates
4. **Layout agent**: Root layout with sidebar navigation and SUPRA branding
5. **Stats cards agent**: Reusable metric card components
6. **Route map agent**: Leaflet map component with polylines, markers, click interactions
7. **Route table agent**: Data table with progress bars, expand/collapse, filtering
8. **Supervisor page agent**: Compose map + table + stats into dashboard page
9. **Stop list + reading form agent**: Capturista components (ordered list + capture form)
10. **Capturista page agent**: Compose mobile view with map + stop list + progress
