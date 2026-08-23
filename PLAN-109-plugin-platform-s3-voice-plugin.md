# PLAN-109: Plugin platform S3 — voice as the proving plugin

Issue: none yet · size:XL · depends on [PLAN-107](./PLAN-107-plugin-platform-s15-surface-slots.md), [PLAN-108](./PLAN-108-plugin-platform-s2-vcs-plugins.md)

Status: drafted from the grilled design session (2026-08-24). Not implemented.
Ready for joint review before handoff. This is the hardest slice and the
final proof of the platform: it exercises vocabulary extension, event
subscription, surfaces, mobile declarative bases, and storage namespacing in
one migration.

## Goal

Voice becomes a first-party plugin (`plugins/voice`) with zero behavioral
change. Every mechanism the platform offers gets exercised by the feature
that leans on it hardest: realtime Call transport, controller ownership
grants, narration policies, and the native exact-thread Call experience.

## Migration inventory (from the audit + phase history)

Server:
- `apps/server/src/voice/**` (Layers, Services, narration/proactive-speech
  policies, transport feedback) → `plugins/voice/server/`
- `apps/server/src/mcp/toolkits/voice` → plugin mcpTools contribution
- Voice persistence layers (`VoiceCalls`, `VoiceControl*`,
  `VoiceTransportSessions`, migrations 036–039, 048, 049) stay in core
  persistence **but** move behind the plugin's `storageNamespace`
  declaration; repositories are provided by the plugin Layer against its own
  namespace. Migrations are never rewritten — they remain core-numbered and
  owned.

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
- Native iOS/Android Call experience keeps its existing architecture; it
  consumes the same declarative descriptors and durable events as today.
  No native rewrite in this plan.

## Dev-mode frontend preview (rides along here)

The dev route from PLAN-107 becomes real in this plan because voice is the
first plugin whose web surface is worth iterating on live: voice web bundle
runnable from its own Vite dev server against a running server, HMR on,
without installing. Backend changes still require restart; that boundary is
the contract, not a limitation to erode later.

## Sequencing within the plan

1. Vocabulary: register namespaces, switch dispatch, delete decider cases —
   behavior identical, receipts idempotent.
2. Server relocation: Layers/Services/policies behind the plugin Layer.
3. Surfaces: panel + timeline registrations with declarative bases.
4. Storage namespacing: repositories re-provided by the plugin.
5. Dev-mode preview tooling generalized from what voice needed.

Each step lands independently revertable.

## Non-goals

- Any Call UX change, transport change, or policy change.
- Rewriting native mobile Call code.
- Migrating automations/review/preview (opportunistic, post-solidification).

## Verification gates

- Focused suites green relocated: voice exchange decider tests (now through
  delegation), narration policy tests, transport feedback tests, mutation
  outcome reconciler, persistence repository tests unchanged.
- Idempotency proof: command receipt retries across the extension path
  behave exactly as the hardwired path did.
- Integrated passes: web Call flow (start call, narrate, complete) and
  mobile Call flow on one simulator/emulator, verified end-to-end against a
  disposable environment.
- Startup diagnostics show `voice` loaded with its contributions; skipping
  the plugin directory degrades to a no-voice server that boots clean.
