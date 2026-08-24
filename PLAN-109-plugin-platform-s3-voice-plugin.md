# PLAN-109: Plugin platform S3 — voice as the proving plugin

Issue: none yet · size:XL · depends on [PLAN-107](./PLAN-107-plugin-platform-s15-surface-slots.md), [PLAN-108](./PLAN-108-plugin-platform-s2-vcs-plugins.md)

Status: drafted from the grilled design session (2026-08-24). Not implemented.
Ready for joint review before handoff. This is the hardest slice and the
final proof of the platform: it exercises vocabulary extension, event
subscription, surfaces, mobile declarative bases, and storage namespacing in
one migration.

## Goal

Voice becomes a first-party plugin (`plugins/voice`) while preserving existing
server, web, and mobile-web behavior. Every mechanism the platform offers gets
exercised by the feature that leans on it hardest: realtime Call transport,
controller ownership grants, narration policies, web/mobile-web Call, and a
focused native exact-thread Call client added in this slice.

## Migration inventory (from the audit + phase history)

Server:
- `apps/server/src/voice/**` (Layers, Services, narration/proactive-speech
  policies, transport feedback) → `plugins/voice/server/`
- `apps/server/src/mcp/toolkits/voice` → plugin mcpTools contribution
- Voice persistence includes all current Voice repositories, including call
  events, calls, control/grants, transport sessions, ownership, handoff, and
  modality, plus Voice migrations 036, 037, 039, and 048-054. Migration 038 is
  generic command-receipt provenance. Existing tables and
  migrations remain readable. Storage ownership is logical metadata plus
  plugin-scoped migration and repository registration against the core
  database; existing Voice tables are assigned without physical renames.
- Include currently core-wired deletion guards, SQL projection routing,
  runtime composition, RPC handlers, and lifecycle policy hooks in the
  migration inventory.

Contracts/vocabulary:
- `thread.voice.exchange.append` / `thread.voice.speech.append` decider cases
  become extension namespace `voice.exchange` / `voice.narration`, dispatched
  through the PLAN-105 delegation path. The core decider loses its last
  feature-specific branches — this is the moment the hexagon's center stops
  knowing features exist.
- Voice event kinds register timeline renderers via PLAN-107 slots;
  declarative bases cover transcript and call-status surfaces for mobile.

Web/mobile:
- Voice panel → panel slot registration with web enhancement bundle.
- Existing responsive mobile-web Call moves through the same web registration.
- Native iOS/Android does not yet expose Call. Add a focused native client over
  the existing Call RPC/events and the closed native descriptor vocabulary;
  this is client parity, not a new Voice architecture.

## Dev-mode frontend preview (rides along here)

The dev route from PLAN-107 becomes real in this plan because voice is the
first plugin whose web surface is worth iterating on live: voice web bundle
runnable from its own Vite dev server against a running server, HMR on,
without installing. Backend changes still require restart; that boundary is
the contract, not a limitation to erode later.

## Sequencing within the plan

1. Compatibility: register generic owner/schema identity and dual-read legacy
   Voice plus extension event forms before producing new extension events.
2. Vocabulary: switch command dispatch and projections while legacy event
   history remains replayable and receipt behavior stays idempotent.
3. Server relocation: Layers/Services/policies behind the plugin Layer.
4. Surfaces: panel + timeline registrations, mobile-web parity, and native
   Call client.
5. Storage ownership: repositories re-provided through the settled storage
   mechanism.
6. Dev-mode preview tooling generalized from what Voice needed.

Each step must be forward-compatible with existing data. Downgrade/revert
claims require explicit replay tests and remain open until the event policy is
settled.

## Non-goals

- Any web/mobile-web Call UX, transport, or policy change beyond relocation.
- Migrating automations/review/preview (opportunistic, post-solidification).

## Verification gates

- Focused suites green relocated: voice exchange decider tests (now through
  delegation), narration policy tests, transport feedback tests, mutation
  outcome reconciler, persistence repository tests unchanged.
- Idempotency proof: command receipt retries across the extension path
  behave exactly as the hardwired path did.
- Integrated passes: desktop-width web Call, mobile-width web Call, and the
  native Call flow on one simulator/emulator, verified end-to-end against a
  disposable environment.
- Startup diagnostics show `voice` loaded with its contributions; skipping
  the plugin directory degrades to a no-voice server that boots clean.

## Explicitly open

- Voice legacy/new event compatibility, production cutover, and downgrade
  support window.
- Plugin migration identity, transaction, upgrade, and failure rules.
