# PLAN-105: Plugin platform S0 — manifest, loader, extension vocabulary

Status: drafted from a grilled design session (2026-08-24). Not yet implemented.
This plan is the foundation slice; PLAN-106 through PLAN-110 depend on its
contracts and loader.

## Goal

Make shuv2code extensible at runtime by user-authored plugins while completing
its existing hexagonal architecture: pure orchestration core, ports as Effect
services, adapters at the edges. After S0, a plugin is a directory with a
validated `manifest.json` and an Effect Layer that the server composes at boot,
and features can extend command/event vocabulary without editing core files.

## Design principles (settled)

1. **Full trust by default.** Plugins are trusted code, like npm lifecycle
   scripts or vite plugins. The capability block in the manifest exists so a
   cautious operator can *restrict* a plugin; it is not a consent gate. The
   software validates declarations and gets out of the way. Open by default,
   locked down as needed — never the reverse.
2. **Hexagonal completion, not rewrite.** The decider/projector stay pure;
   persistence stays behind Effect services (`OrchestrationEventStore`,
   `OrchestrationCommandReceipts`); providers and VCS already sit behind
   interfaces (`ProviderDriver`, `VcsDriver`). S0 adds dynamic composition on
   top of these seams.
3. **In-process only, remote-capable shapes.** No daemon split, no bridge
   protocols, no distribution machinery. Every port's type shape must permit a
   future implementation behind a network boundary without changing the port.
   *(Final non-goals wording pending Shuv's review.)*
4. **Mobile first-class.** Any contributed surface ships a declarative base
   descriptor rendered by mobile without plugin code. Web-only surfaces fail
   manifest validation.
5. **Upstream independence.** No t3code sync constraints. Ideas may be
   cherry-picked; ancestry does not constrain architecture.

## Non-goals

- Process isolation, provider bridges, content-addressed distribution,
  marketplace manifests, grammar versioning, conformance kits. Each exists in
  other harnesses to protect untrusted third parties at distance; our users
  are developers running code they chose.
- Hot install/uninstall into a running server. Installing requires restart.
- Plugin hot-reload of backend Layers. (Dev-mode frontend preview is
  PLAN-109 scope.)
- Capability enforcement against hostile plugins. Brokered chokepoints
  (secrets read, process exec, filesystem outside workspace) enforce declared
  restrictions only.

## Contracts (new file: `packages/contracts/src/plugins.ts`, scaffolded)

- `PluginManifest` (manifestVersion 1): id, semver, displayName,
  capabilities?, contributions?
- `PluginCapabilities`: optional restrictions — orchestration namespaces,
  storage namespace, network, processExec, filesystem scope, secretsRead
  patterns
- `PluginContributions`: surfaces (with declarativeBase for mobile),
  providers, vcs, mcpTools, cli, skills
- `ExtensionNamespace` / envelopes: dotted namespaces (e.g. `voice.exchange`)
  owning commands/events; generic command/event envelopes carry
  namespace-scoped payloads
- `ScopedPluginEntry` / `PluginEnablement`: opencode-v2-style layered config —
  `{source: string | {path, options}, enabled?}` entries at global scope and
  per-project scope, resolved location-relatively; same-id conflict resolves
  project-wins and is logged to diagnostics

## Server work

### Loader (`apps/server/src/plugins/` new module)

1. Discover enabled plugins: merge global settings enablement with per-project
   declarations (location-relative resolution).
2. Validate manifests; on any failure skip loudly — structured diagnostics in
   startup output, server continues. Never block boot on a broken plugin.
3. Compose each plugin's Layer; merge into the runtime via the existing
   startup sequence (`serverRuntimeStartup.ts`), after core services, before
   HTTP listening.
4. First-party plugins live in monorepo `plugins/` workspace packages.
   External-repo source resolution (`{path}` entries) is implemented but
   flagged experimental until a real external consumer exists.

### Extension vocabulary delegation

1. `decider.ts` gains exactly one new case: a command envelope whose
   namespace is registered by an enabled plugin dispatches to that plugin's
   decider fragment `(command, state) => events`, pure like the core decider.
   Unknown/unregistered namespaces reject with a domain error.
2. `projector.ts` gains the mirror-image case for extension events.
3. Extension events persist in the existing event store; no schema migration
   (payloads are opaque `unknown` at the storage boundary, validated at the
   plugin boundary by the owning plugin's Schema).
4. Feature-specific cases currently hardwired in core (voice exchange/speech)
   become extension namespaces consumed from `plugins/voice` in PLAN-108;
   during S0 they remain in core untouched — no behavioral change lands here.

### Domain-event subscription API

Generalize the existing committed-event publication (already used by reactors
and voice) into the documented way any plugin observes core facts:
`thread.turn.settled`, `session.status.changed`, etc., gated through the same
scope model as `RPC_REQUIRED_SCOPE`. This is promotion of 7 existing call
sites, not new machinery.

## Verification gates

- Focused tests: loader discovery/validation/merge (including conflict
  project-wins), decider delegation happy path + unknown namespace rejection +
  retry idempotency through the durable receipt path, projector extension
  routing, subscription scope checks.
- `vp test run` on changed test files; contracts typecheck.
- Existing full behavior unchanged: voice, automations, PR pages all green
  under focused suites; one integrated web pass confirming normal workspace
  flows are unaffected.

## Explicitly open (resolve during implementation or PLAN review)

- Final non-goals wording (Shuv input wanted).
- Whether extension payloads get a size cap at the envelope boundary.
- Diagnostics surface for skipped plugins (startup log vs Settings page).
