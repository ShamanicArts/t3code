import { Schema } from "effect"

export const PluginId = Schema.String.check(
  Schema.isMaxLength(63),
  Schema.isPattern(/^[a-z][a-z0-9-]*$/),
)
export type PluginId = typeof PluginId.Type

export const SemVer = Schema.String.check(
  Schema.isPattern(/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/),
)
export type SemVer = typeof SemVer.Type

export const ExtensionNamespace = Schema.String.check(
  Schema.isMaxLength(128),
  Schema.isPattern(/^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/),
)
export type ExtensionNamespace = typeof ExtensionNamespace.Type

export const FilesystemScope = Schema.Literals(["workspace", "system"])
export type FilesystemScope = typeof FilesystemScope.Type

export const OrchestrationCapabilities = Schema.Struct({
  commands: Schema.Array(ExtensionNamespace),
  events: Schema.Array(ExtensionNamespace),
})
export type OrchestrationCapabilities = typeof OrchestrationCapabilities.Type

export const PluginCapabilities = Schema.Struct({
  orchestration: Schema.optional(OrchestrationCapabilities),
  storageNamespace: Schema.optional(Schema.String),
  network: Schema.optional(Schema.Boolean),
  processExec: Schema.optional(Schema.Boolean),
  filesystem: Schema.optional(FilesystemScope),
  secretsRead: Schema.optional(Schema.Array(Schema.String)),
})
export type PluginCapabilities = typeof PluginCapabilities.Type

export const PluginCapabilitiesFullTrust: PluginCapabilities = {}

export const SurfaceSlotKind = Schema.Literals([
  "panel",
  "sidebar-section",
  "timeline-renderer",
  "settings-page",
])
export type SurfaceSlotKind = typeof SurfaceSlotKind.Type

export const DeclarativeSurfaceBase = Schema.Struct({
  kind: Schema.String,
  props: Schema.Record(Schema.String, Schema.Unknown),
})
export type DeclarativeSurfaceBase = typeof DeclarativeSurfaceBase.Type

export const SurfaceDescriptor = Schema.Struct({
  slot: SurfaceSlotKind,
  surfaceId: Schema.String,
  title: Schema.String,
  declarativeBase: DeclarativeSurfaceBase,
  webEntry: Schema.optional(Schema.String),
})
export type SurfaceDescriptor = typeof SurfaceDescriptor.Type

export const ProviderContribution = Schema.Struct({
  driverId: Schema.String,
  displayName: Schema.String,
  firstParty: Schema.Boolean,
})
export type ProviderContribution = typeof ProviderContribution.Type

export const VcsContribution = Schema.Struct({
  vcsId: Schema.String,
  displayName: Schema.String,
})
export type VcsContribution = typeof VcsContribution.Type

export const McpToolsContribution = Schema.Struct({
  toolkitId: Schema.String,
  toolNames: Schema.Array(Schema.String),
})
export type McpToolsContribution = typeof McpToolsContribution.Type

export const PluginContributions = Schema.Struct({
  surfaces: Schema.optional(Schema.Array(SurfaceDescriptor)),
  providers: Schema.optional(Schema.Array(ProviderContribution)),
  vcs: Schema.optional(Schema.Array(VcsContribution)),
  mcpTools: Schema.optional(Schema.Array(McpToolsContribution)),
  cli: Schema.optional(Schema.Array(Schema.String)),
  skills: Schema.optional(Schema.Array(Schema.String)),
})
export type PluginContributions = typeof PluginContributions.Type

export const MANIFEST_VERSION = 1

export const PluginManifest = Schema.Struct({
  manifestVersion: Schema.Literal(MANIFEST_VERSION),
  id: PluginId,
  version: SemVer,
  displayName: Schema.String,
  description: Schema.optional(Schema.String),
  capabilities: Schema.optional(PluginCapabilities),
  contributions: Schema.optional(PluginContributions),
})
export type PluginManifest = typeof PluginManifest.Type

export const ExtensionCommandEnvelope = Schema.Struct({
  namespace: ExtensionNamespace,
  name: Schema.String,
  payload: Schema.Unknown,
  threadId: Schema.optional(Schema.String),
})
export type ExtensionCommandEnvelope = typeof ExtensionCommandEnvelope.Type

export const ExtensionEventEnvelope = Schema.Struct({
  namespace: ExtensionNamespace,
  name: Schema.String,
  payload: Schema.Unknown,
  threadId: Schema.optional(Schema.String),
})
export type ExtensionEventEnvelope = typeof ExtensionEventEnvelope.Type

export const PluginSource = Schema.Union([
  Schema.String,
  Schema.Struct({
    path: Schema.String,
    options: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
  }),
])
export type PluginSource = typeof PluginSource.Type

export const ScopedPluginEntry = Schema.Struct({
  source: PluginSource,
  enabled: Schema.optional(Schema.Boolean),
})
export type ScopedPluginEntry = typeof ScopedPluginEntry.Type

export const PluginEnablement = Schema.Struct({
  global: Schema.optional(Schema.Array(ScopedPluginEntry)),
  perProject: Schema.optional(Schema.Record(Schema.String, Schema.Array(ScopedPluginEntry))),
  surfaceOverrides: Schema.optional(Schema.Record(Schema.String, Schema.Array(Schema.String))),
})
export type PluginEnablement = typeof PluginEnablement.Type
