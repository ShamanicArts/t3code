# PLAN-108: Plugin platform S2 — VCS plugins (git + jj)

Issue: none yet · size:M · depends on [PLAN-107](./PLAN-107-plugin-platform-s15-surface-slots.md)

Status: drafted from the grilled design session (2026-08-24). Not implemented.
Ready for joint review before handoff.

## Goal

Git and Jujutsu stop being core-wired drivers and become VCS plugins. Deep
VCS management — the thing this fork uniquely has via `JjVcsDriver` — becomes
the template for future forge integrations (ERSC being the immediate target),
and the second capability port proven through the plugin path.

## Why this matters beyond tidiness

A jj-native forge integration will need richer jj surface than git ever had
(bookmarks, operation log, conflict state, multi-remote semantics). Owning
that surface in a plugin means iterating on ERSC integration without touching
core, and without pretending git needs the same vocabulary. The port must be
shaped so a future ERSC driver can expose forge-specific operations as
extension namespaces rather than forcing everything into a lowest-common-
denominator interface.

## Design

### Plugin shape

```
plugins/
  vcs-git/
    manifest.json   # contributions.vcs: [{vcsId: "git"}]
    server/         # GitVcsDriverCore-based Layer
  vcs-jj/
    manifest.json   # contributions.vcs: [{vcsId: "jj"}]
    server/         # JjVcsDriver Layer incl. bookmarks + multi-remote fixture behavior
```

### Core changes

1. `VcsDriverRegistry` consumes registered drivers from contribution
   collection instead of static imports. Selection by project config is
   unchanged (`VcsProjectConfig.ts`).
2. Preserve the depth of `VcsDriver.ts` and `VcsCheckpointOps`, but replace raw
   local `cwd` assumptions with an opaque branded repository target carrying
   stable project, environment, and repository identity. A resolver service
   maps that target to a working directory for local Git/JJ adapters today and
   may map it to remote placement later. Cross-instance execution remains out of
   scope, but adding it later must not change callers.
3. VCS-aware bootstrap keeps its guardrails: the git-only remote-exists
   pre-check stays off the jj path; jj packaging commit-hash resolution in
   isolated worktrees keeps working (recent fix territory — regression tests
   move with the code).
4. Forge-forward extension point: drivers may register extension namespaces
   for operations beyond the core port (e.g. `vcs.jj.oplog`,
   `vcs.ersc.review`). Core never interprets these; UI surfaces render them
   through timeline-renderer slots when present.

### What moves vs. stays

Move: driver implementations, their focused test suites (including
`jjMultiRemoteFixture`), provider-side change-request service wiring that is
driver-coupled.

Stay in core: registry, project config schema, status broadcasting,
checkpoint reactor orchestration (it calls the port, not drivers).

## Non-goals

- No new jj capabilities in this plan — relocation plus the extension point
  declaration only.
- No ERSC integration work; that follows once EA access reveals their API.

## Explicitly open

- Exact fields and branding for the repository target and resolver result.
- Registry cache key once target identity includes instance and placement.

## Verification gates

- Focused suites green with drivers loaded via plugin path: GitVcsDriver
  runtime tests, JjVcsDriver runtime/bookmarks tests, registry selection,
  checkpoint revert flows against both drivers.
- Regression proof for recent scars: null bookmark target handling,
  multi-remote fixtures, isolated-worktree commit-hash resolution.
- Integrated web pass: create a jj-backed project and a git-backed project,
  verify branch toolbar, checkpoints, and diffs on both.
