# Plugin Platform Audit Reconciliation

Status: second-grill input

This document classifies every finding in
[`plugin-platform-audit.md`](./plugin-platform-audit.md) against the settled decisions in
[`plugin-platform-decision-ledger.md`](./plugin-platform-decision-ledger.md).

Classifications:

- **Factual correction**: the plan names current code incorrectly or omits current inventory.
- **Missing specification**: the direction survives, but an implementer lacks required semantics.
- **Genuine contradiction**: the bundle cannot satisfy two of its own settled claims as written.
- **Invalid relitigation**: the audit proposes replacing a settled decision without proving it
  impossible.

## Findings

| # | Classification | Disposition |
| --- | --- | --- |
| 1 | Missing specification | Define server entrypoint, export, module format, built artifact, and host compatibility for the intentionally experimental external loader. |
| 2 | Missing specification | Make extension envelopes real durable command/event union members with command ID, aggregate identity, timestamp, event intents, and receipt rules. |
| 3 | Missing specification | Add mandatory namespace ownership registration, duplicate handling, project lookup, and namespaced decision state. Ownership is not an optional restriction. |
| 4 | Missing specification | Define owner/schema identity, upcasting or compatibility, missing-owner replay, re-enable behavior, downgrade behavior, and rejected-receipt semantics. “Opaque payload, no migration” is withdrawn. |
| 5 | Missing specification | Generic extension routing must cover SQL projections, WebSocket delivery, snapshots, and client reduction as well as the pure decider/projector. |
| 6 | Genuine contradiction | The arbitrary `{kind, props}` scaffold cannot enforce native parity. Replace it with a closed, versioned native primitive/action/binding vocabulary. Reject the audit’s fallback-only remedy because native parity is settled. |
| 7 | Factual correction | Mobile web Call exists; native mobile Call does not. S3 adds the focused native client and verifies both surfaces. This is not grounds to weaken the mobile invariant. |
| 8 | Factual correction | Correct Voice repository/migration inventory, including migrations 050-054 and call events. Define what storage ownership means before implementation. |
| 9 | Missing specification | Include deletion policy hooks, SQL projection routing, runtime composition, RPC handlers, lifecycle contributions, and clean no-Voice readiness in the extraction inventory. |
| 10 | Genuine contradiction | A raw `cwd` port is not placement-flexible. S2 must introduce an opaque repository/environment target while keeping cross-instance execution out of scope. Do not defer S2. |
| 11 | Genuine contradiction | New extension events are not independently downgrade-safe. Specify dual-read/upcast compatibility and rollback tests or remove the independent-revert claim. |
| 12 | Factual correction | Preserve persisted `opencodeV2` driver identity. `shuvcode` may name the plugin/product only. |
| 13 | Missing specification | Define the mixed transition where Codex/OpenCode v2 are contributed and the other four drivers remain statically registered until S4; update hydration accordingly. |
| 14 | Factual correction | Plugin discovery must precede runtime Layer construction in `server.ts`; command readiness, not HTTP bind alone, gates dispatch. |
| 15 | Factual correction | Inventory the switch/state in `ChatView` and `rightPanelStore`, not only `RightPanelSheet`; include scope, cardinality, callbacks, persistence, and keep-alive. |
| 16 | Missing specification | Define web export/SDK version, React sharing, static/HMR asset routing, containment/CORS, cache behavior, dev discovery, and load failure. Keep the chosen dev route. |
| 17 | Missing specification | Persist replay-stable plugin owner, source/version, project selection, and schema identity while retaining layered project-wins scoping. |
| 18 | Genuine contradiction | `network` is advertised without an enforcement seam. Broker it honestly or remove it from enforceable restrictions. Separate ownership from restriction. |
| 19 | Invalid relitigation | Reject the proposed Voice-first reorder and deferral of providers, VCS, external loading, and second-party adapters. The proof sequence is settled. Clarify deliberate sequence versus strict technical dependencies. |
| 20 | Genuine contradiction | Second-party plugins are monorepo-shipped; they are not the first external checkouts. Remove `storageNamespace` as a provider-settings escape hatch and state any external-path conformance test separately. |
| 21 | Missing specification | Replace broad gates with named fixtures/assertions for replay, missing owners, collisions, malformed payloads, bundle failures, native descriptors, Voice disablement, and readiness ordering. |
| 22 | Factual correction | Fix PLAN references: surfaces are PLAN-107; Voice is PLAN-109. |
| 23 | Factual correction | Remove the stale “7 call sites” and RPC-scope analogy. Trusted internal event observation is the default; optional restriction needs its own model. |
| 24 | Factual correction | Export the plugin contract through a supported contracts package entrypoint and verify a real consumer import. |

## Result

- 8 factual corrections
- 10 missing specifications
- 5 genuine contradictions
- 1 invalid relitigation

The audit blocks handoff of the current scaffold, as expected. It does not block the settled
architecture. The second grill resolves the ten-item frontier in the decision ledger; the plans and
contracts are then deepened against those answers.
