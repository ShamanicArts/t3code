# Plugin Platform Decision Ledger

Status: authoritative input for PLAN-105 through PLAN-110 reconciliation

Source: the 2026-08-24 design grill in thread `9f1df8f9-65f0-467a-8afe-02145e0c1783`.
The transcript remains the evidence; this document records the durable project decisions without
carrying the conversation itself.

## Authority

1. Human-settled decisions in this ledger constrain the plan bundle.
2. The audit may expose factual errors, missing specification, or contradictions with these
   decisions. It does not silently replace them.
3. Agent proposals that were not accepted remain proposals.
4. Open items belong on the second-grill frontier before implementation.

## Settled direction

### Architecture and scope

- Complete the existing hexagonal direction: pure decision/projection logic at the center, ports
  as Effect services, and adapters at the edges.
- Optimize for shuv2code rather than upstream t3code merge compatibility. Upstream remains a source
  of ideas and selective changes.
- Build the plugin boundary first while migrating selected vertical slices that prove it under real
  use. This is boundary-first, not migration-never.
- Keep plugins in-process initially. Port interfaces must remain instance-agnostic and
  placement-flexible so a later adapter can sit behind a network seam without changing callers.
- Do not implement cross-instance plugin execution, daemon, bridge, marketplace, or process
  isolation machinery in this bundle.

### Trust and configuration

- Plugins are fully trusted when enabled. Restrictions are optional operator configuration, not a
  mandatory consent gate.
- The host must enforce only restrictions it can enforce honestly. In-process code is not treated
  as contained hostile code.
- The restriction vocabulary may cover orchestration, storage, network, process execution,
  filesystem scope, secrets, surfaces, providers, VCS, and MCP tools. Ownership declarations are
  separate from restrictions.
- Configuration follows the OpenCode v2 layered model: location-relative global and project
  declarations use the same shape; project declarations may replace the same global plugin ID and
  the resolution is diagnosed.
- Enablement is generally machine-global. Projects may declare plugins and override surface
  visibility.

### Plugin and extension model

- A plugin is a manifest plus an in-process server module and optional web, CLI, skill, and MCP
  contributions.
- Plugin-owned command and event namespaces extend orchestration through generic delegation rather
  than feature-specific core branches.
- A broken plugin fails loudly with structured diagnostics while unrelated capabilities remain
  available. Durable history compatibility may impose a stronger readiness rule for a plugin that
  already owns persisted state; that exact rule is open.
- Installed plugin composition changes require restart.
- Development preview is distinct from installation: an uninstalled plugin may connect to a running
  app through a dev route and update the code that route owns without changing the installed Layer
  graph.
- First- and second-party plugins live in the monorepo initially. External source loading is an
  experimental path, not the initial authoring default.
- The process may load multiple resolved sources or versions of the same plugin ID. Each resolved
  implementation has its own runtime instance; each project maps to the instance selected by its
  layered project-wins configuration.
- A missing, disabled, broken, or incompatible durable owner quarantines that plugin capability,
  not the server or unrelated project functionality. Its durable envelopes remain readable, new
  commands fail transiently without a permanent receipt, and the capability catches up before it
  becomes ready when the owner returns.
- Core destructive operations fail conservatively when a missing plugin-owned lifecycle guard is
  required to establish safety.
- Every extension command targets exactly one required project or thread aggregate. A pure plugin
  fragment emits event intents only for that aggregate. Cross-aggregate workflows use reactors that
  issue additional commands.

### Client surfaces

- Web, mobile web, and native mobile are first-class surfaces.
- Every contributed surface must have a valid declarative native representation. A web-only surface
  fails validation; fallback-only parity is not the target.
- Host chrome, placement, lifecycle, and conflict policy remain host-owned. Contributors own their
  declared content.
- Mobile web Call exists today. Native mobile Call does not; S3 includes a focused native client
  implementation using the existing Call protocol and mobile-web behavior as its reference.
- Native descriptors are closed, versioned semantic component trees composed from host-owned
  primitives, typed data bindings, and brokered action identifiers. Arbitrary props and placeholder
  fallbacks do not satisfy parity.
- The host owns each slot and region's scope, cardinality, exclusivity, ordering resolution,
  visibility evaluation, and keep-alive policy. Contributors may request only the host-supported
  scope, region, order bucket, visibility conditions, and keep-alive behavior.

### Storage and placement

- Plugin storage uses logical ownership metadata plus plugin-scoped migration and repository
  registration against the core database. Existing Voice tables are assigned to Voice ownership
  without physical renames.
- S0 does not advertise an enforceable network restriction. It may return only when a real network
  broker makes the claim honest.
- VCS ports receive an opaque branded repository target carrying stable project, environment, and
  repository identity. A resolver maps it to local paths now and may map it to remote placement
  later; callers never receive or construct raw working-directory paths.

### Slice order

The order is intentional. Later slices exercise machinery established by earlier slices.

| Slice | Plan | Scope | Why it is early |
| --- | --- | --- | --- |
| S0 | PLAN-105 | manifest, loader, ownership, extension vocabulary, subscriptions | establishes the plugin seam |
| S1 | PLAN-106 | Codex and OpenCode v2 first-party provider plugins | proves provider contributions under daily traffic |
| S1.5 | PLAN-107 | surface slots and in-tree registrations | establishes client contribution/lifecycle semantics before Voice |
| S2 | PLAN-108 | Git and Jujutsu VCS plugins | proves a second deep adapter family and forge-forward extension |
| S3 | PLAN-109 | Voice first-party plugin | exercises vocabulary, storage, lifecycle, RPC, web, mobile web, and native mobile together |
| S4 | PLAN-110 | Claude, Cursor, Grok, and OpenCode v1 second-party plugins | proves non-first-party authoring and the maintenance tier |

- Automations, review/PR, and preview migrate opportunistically after these seams stabilize.
- The audit may identify a false technical dependency between slices. It must not replace this
  deliberate proof order with a Voice-first architecture.

### Party tiers

| Tier | Members | Maintenance contract |
| --- | --- | --- |
| First-party | Codex, OpenCode v2/shuvcode, Voice | full support and focused parity coverage |
| Second-party | Claude, Cursor, Grok, OpenCode v1 | preserve current behavior with honest smoke coverage |
| Third-party | external authors | experimental loading path; no support promise |

Persisted driver identity remains `opencodeV2`; `shuvcode` is the product/plugin name, not a new
driver identity.

## Handoff shape

- Independent PLAN documents and compiling contract scaffolding are design artifacts for agents.
- Human-readable architecture explainers accompany the plan bundle.
- The first generated bundle was explicitly an input to a second grill, not implementation-ready
  sign-off.

## Superseded proposals

- Install-time CLI or GUI permission approval as the trust mechanism.
- Migrating only Voice while providers and VCS remain permanently core-wired.
- Converting only Claude and deleting the other existing provider adapters.
- Treating a generic arbitrary-props object as sufficient proof of native mobile parity.
- Treating mobile web Call as evidence that native mobile Call already exists.

## Second-grill frontier

1. Executable server and web module ABI, compatibility versioning, and explicit dev discovery.
2. Durable extension identity, schema upcasting, namespace registry construction, and projection
   catch-up mechanics.
3. Permanent versus transient receipt outcomes once an owner is present but rejects a command.
4. Exact native primitive, action, and data-binding vocabulary.
5. Per-slot scope, region, cardinality, ordering, visibility, and keep-alive matrix.
6. Plugin migration identity, transaction, upgrade, and failure rules.
7. Voice legacy/new event compatibility and bounded rollback policy.
