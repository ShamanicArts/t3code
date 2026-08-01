# Development log

## 2026-07-30 — Project automations checkpoint

- Added project-scoped scheduled and manual automations with persisted schedules and run history.
- Added scheduler execution, overlap policy, model/runtime selection, WebSocket RPCs, authorization scopes, and an MCP automation toolkit.
- Added the Automations settings route and client state for creating, editing, running, pausing, and deleting automations.
- Verified the database migration and authenticated Automations route in an isolated live environment; formatting, lint, and affected client/shared type checks pass.
- Focused tests are present, but the current Vite+ runner fails before collecting any suite (`runner.config` is undefined). Server type checking also retains unrelated pre-existing errors in local desktop attach and replay-event tests.
- Remaining work: render image content returned by model tools directly in the chat timeline. Browser-profile and Tailnet proxy changes remain separate from this checkpoint.

## 2026-07-30 — Project automations final audit

- Audited the feature in three independent lanes: code/safety, scope/spec, and tests.
- Fixed scheduler startup ordering so due work cannot dispatch before orchestration reactors subscribe; added a scoped clock-driven scheduler lifecycle test.
- Enforced monotonic MCP permissions for create, enable/update, and run-now operations, generalized capability errors, marked durable MCP creation destructive, and added real capability/project-delegation tests.
- Made automation updates transactional and deletion atomic with active-run admission, preventing resurrection and delete/run races.
- Removed the 60-second missing-turn failure heuristic so slow but valid provider startup is not misclassified.
- Added user documentation for host-running, downtime, missed-run, overlap, deletion, and unattended-permission semantics, plus an in-product full-access warning.
- Focused verification: 11 files and 51 tests passed through direct Vitest. The affected contracts, client-runtime, and web packages typecheck; server typecheck has no automation errors and remains blocked only by pre-existing `localDesktopAttach` and replay-test failures.
- Re-verified migration 35 and the authenticated Automations route in a fresh isolated environment. Product-native preview actions failed at the preview transport after navigation, so the earlier successful real automation run remains the end-to-end CRUD/run evidence for this change.

## 2026-07-30 — Review feedback

- Resume a recovered queued run from its existing thread instead of issuing a duplicate `thread.create`; added a regression double that rejects duplicate creation like the live engine.
- Enforce the invoking thread's permission ceiling whenever an MCP update explicitly changes runtime mode, including while the automation is paused.
- Exclude automations belonging to soft-deleted projects from due-run claims.
- Document that deletion is blocked while a run is queued or running.
- Focused verification: 11 files and 52 tests passed; affected formatting, lint, and client/shared type checks pass. Server type checking remains blocked only by the pre-existing `localDesktopAttach` missing-`Path` context error.

## 2026-07-31 — Realtime voice recovery regression fix

- Added the two realtime voice orchestration events to the exhaustive projection routing table as cursor-only events, restoring server type safety without inventing materialized projection work.
- Recognized Codex app-server's actual `no rollout found for thread id ...` response as a recoverable stale-thread resume failure so voice setup can create a replacement provider thread instead of failing permanently.
- Updated focused regression expectations for both behaviors.
- Targeted formatting, lint, and `git diff --check` pass. Server type checking now reaches only the existing automation `preferSchemaOverJson` diagnostic in `AutomationStore.test.ts`; the current Vite+ runner remains unable to collect focused suites because `runner.config` is undefined.
- Remaining investigation: determine why an automation run could not request screenshots and why installed-app copy CTAs fail.

## 2026-08-01 — Desktop remote-auth and preview checkpoint

- Kept desktop backends loopback-bound behind configured HTTPS proxies while explicitly enabling the remote-reachable authentication policy and advertising the proxy as the preferred endpoint.
- Preserved user-configured HTTPS pairing links on their advertised backend instead of rewriting them through the hosted app.
- Hardened background preview screenshots with compositor keepalive flags and a bounded automation timeout.
- Preserved actionable Codex version errors during voice model selection while continuing to redact unrelated provider failures.
- Remaining work: publish the separate external image-view capability fix upstream; these desktop/auth, preview, and voice changes remain local.
