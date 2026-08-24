# PLAN-110: Plugin platform S4 — second-party provider plugins

Issue: none yet · size:M · depends on [PLAN-106](./PLAN-106-plugin-platform-s1-first-party-provider-plugins.md)

Status: drafted from the grilled design session (2026-08-24). Not implemented.
Ready for joint review before handoff.

## Goal

Claude, Cursor, Grok, and OpenCode v1 move out of core into **second-party
plugins**: shipped from this repo, dogfoodable, minimally smoke-tested — but
explicitly not first-party and not committed to maintenance beyond current
behavior.

## Party taxonomy (settled in grill)

| Tier | Members | Contract |
|---|---|---|
| First-party | codex, shuvcode | full support, full test parity |
| Second-party | claude, cursor, grok, opencode1 | works as it works today; CI smoke only; breakage fixed when someone cares |
| Third-party | anything external | loads via experimental external-source path; unsupported |

Rationale: neither maintainer uses these harnesses day-to-day. Keeping them
in core would mean maintaining seams nobody exercises; deleting them would
discard working adapters and the second-party proof of the port. Second-party
is the honest middle.

## Design

1. One plugin per driver (`plugins/claude`, `plugins/cursor`,
   `plugins/grok`, `plugins/opencode1`), same shape as PLAN-106's
   first-party providers with `firstParty: false` on the contribution.
2. Each ships disabled-by-default? No — enabled like today (settings-driven),
   preserving current behavior for existing instances. The party tier affects
   maintenance commitment, not default enablement.
3. Settings schemas for these providers stay in contracts for now; provider
   instance `config` remains the driver-decoded settings evolution envelope.
4. These four plugins remain monorepo packages. The experimental external
   source path belongs to PLAN-105 and may receive a separate conformance
   fixture here, but second-party location does not change for that test.

## Smoke policy (the whole maintenance contract)

Per second-party plugin, one CI job: manifest validates, Layer boots against
a fixture, one dispatch round-trip succeeds. Failure marks the PR red and
nothing more. No fixture provider processes in CI beyond what already exists;
if a harness CLI is unavailable in CI, the smoke asserts load+register only
and says so in its name.

## Non-goals

- Feature work on any second-party driver.
- Test parity with first-party.
- Deleting any driver.

## Verification gates

- All four drivers pass smoke via plugin path.
- Provider registry diagnostics list all loaded providers with their party
  tier.
- Focused regression: provider instance hydration unaffected; a disabled or
  broken second-party plugin never blocks first-party availability.
