# PLAN-107: Plugin platform S1.5 — surface slot framework

Issue: none yet · size:L · depends on [PLAN-106](./PLAN-106-plugin-platform-s1-first-party-provider-plugins.md)

Status: drafted from the grilled design session (2026-08-24). Not implemented.
Ready for joint review before handoff.

## Goal

Surfaces become plugin-behaved before any plugin ships a surface. The web app
gains a slot registration API (panels, sidebar sections, timeline renderers,
settings pages); every existing in-tree surface migrates onto it while still
first-party; mobile renders every surface's declarative base with zero plugin
code. After this plan, PLAN-108+ contribute surfaces through the same API an
external plugin would use.

## Slot model

Four slot kinds, matching `SurfaceSlotKind` in contracts:

| Slot | Host keeps forever | Contributor owns |
|---|---|---|
| `panel` | right-panel chrome, drag-resize, sheet lifecycle | section content, ordering request, visibility rule |
| `sidebar-section` | nav chrome, footer, primary actions | scrolling section content only |
| `timeline-renderer` | timeline container, event routing | rendering of its declared extension event kinds |
| `settings-page` | settings shell/navigation | page content |

Ownership rules (from bb's sidebar discipline, adopted deliberately):

1. One plugin cannot remove or reorder another plugin's surfaces.
2. Exclusive slots are declared exclusive in the host; at most one
   registration is accepted and the conflict fails validation loudly.
3. Chrome never passes through contributor code.

## Declarative base (mobile parity invariant)

Every `SurfaceDescriptor.contributions[].declarativeBase` describes the
surface in props-only form (`{kind, props}`), rendered by first-class mobile
components. Validation rule, enforced at manifest load: **a surface
contribution without a valid declarativeBase fails manifest validation.**
Plugin web bundles enhance the web experience; they are never required for
correctness anywhere.

## In-tree migration inventory

Migrate onto registrations, no visual change:

- Right panel sections currently mounted via `RightPanelSheet.tsx` (voice,
  diffs, preview, files) → `panel` registrations.
- Timeline event switch in `chat/` → per-kind `timeline-renderer`
  registrations; core kinds register exactly like future plugin kinds would.
- Settings pages → `settings-page` registrations.
- Sidebar sections behind feature flags → `sidebar-section`.

Core-owned kinds keep their renderers registered from core during this plan;
they move to their owning plugins in later plans without further framework
work — that is the point of doing this first.

## Web loading path (production + dev route)

- Production: plugin web bundles build to static assets served under
  `/plugins/<id>/`; web discovers contributions from the server's
  contribution snapshot and dynamically imports each `webEntry`.
- Dev route: an *uninstalled* plugin under development can expose its
  surfaces against the running server by pointing its entry at a local Vite
  dev server URL (HMR). Dev-preview state and installed state are distinct;
  installation into the running app always requires restart. This mirrors
  the server's existing staticDir/dev-url duality in `http.ts`.
- No iframe isolation, no module federation runtime, no import maps.

## Non-goals

- Cross-plugin surface composition inside one slot region.
- Server-driven UI theming beyond existing tokens.
- Mobile hot reload (mobile rebuilds stay as they are).

## Verification gates

- Framework tests: registration conflicts (duplicate id, exclusive-slot
  collision), missing-declarative-base rejection, contribution snapshot
  consistency between server and clients.
- Visual regression: in-tree migration produces pixel-identical panels on web.
- Integrated passes: web (all migrated panels function: voice, diff, preview)
  and mobile (declarative bases render for every migrated surface).
