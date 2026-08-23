# PLAN-106: Plugin platform S1 — first-party provider plugins

Issue: none yet · size:L · depends on [PLAN-105](./PLAN-105-plugin-platform-s0-machinery.md)

Status: drafted from the grilled design session (2026-08-24). Not implemented.
Ready for joint review before handoff.

## Goal

Codex and shuvcode (OpenCode v2) stop being core-registered drivers and become
**first-party provider plugins**: shipped, maintained, and fully tested by us,
but loaded through the same manifest + Layer path as anything external. The
provider port (`ProviderDriver`) is thereby proven end-to-end by the two
providers that must never break.

## Why this slice first

Multi-provider support through swappable adapters is a primary motivation for
the whole plugin effort. Proving the port with our daily drivers means every
later provider plugin (PLAN-110) inherits a seam already exercised by real
traffic, not fixture traffic.

## Design

### Provider plugin shape

```
plugins/
  codex/
    manifest.json        # contributions.providers: [{driverId: "codex", firstParty: true}]
    server/              # Layer implementing the driver adapter over Codex app-server stdio
    skills/ cli/         # optional contributions
  shuvcode/
    manifest.json        # driverId "shuvcode" (OpenCode v2 protocol)
    server/
```

### Core changes

1. `builtInDrivers.ts` becomes a composition detail of these two plugins; the
   static array disappears from core. `ProviderInstanceRegistry` hydration is
   unchanged — it consumes registered drivers, wherever they came from.
2. Driver registration flows through the plugin loader's contribution
   collection: manifest declares `providers`, the Layer provides the
   `ProviderDriver` implementation, the registry merges.
3. Zero behavioral change: same binaries, same settings schemas
   (`packages/contracts/src/settings.ts` Codex/OpenCode settings), same
   session continuity guarantees. A user upgrading between the before/after
   commits should observe nothing except startup diagnostics naming the two
   loaded plugins.

### What this proves

- Contribution collection for a non-surface capability.
- Settings-schema association with a plugin-owned provider.
- Boot-order interaction: provider plugins ready before HTTP listening, so
  no socket can dispatch against a half-loaded driver set.
- Failure isolation: if a third-party provider plugin fails validation in
  later plans, first-party providers are unaffected — verified here by
  fault-injection tests.

## Non-goals

- No Claude/Cursor/Grok/OpenCode-v1 movement (that is PLAN-110).
- No changes to Codex app-server protocol handling or OpenCode v2 forms flow.
- No capability restriction enforcement beyond what PLAN-105 built.

## Verification gates

- Focused tests: contribution merge order, duplicate-driver-id rejection,
  boot diagnostics content, fault injection (broken sibling plugin does not
  affect provider availability).
- Full focused provider suites green (Codex terminal persistence, paginated
  history, opencode2 ask-questions forms).
- Integrated web pass: create sessions on both providers, verify turns,
  approvals, and ask-questions flow in a controlled browser.
