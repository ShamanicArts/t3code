import { ProjectId, ProviderDriverKind } from "@shuv2code/contracts";
import { describe, expect, it } from "vite-plus/test";

import { resolveVoiceControlHostProjectId } from "./ChatComposer.voice";

describe("resolveVoiceControlHostProjectId", () => {
  const projectId = ProjectId.make("project-1");

  it("exposes voice control for an available Codex project", () => {
    expect(
      resolveVoiceControlHostProjectId({
        activeProjectId: projectId,
        providerAvailable: true,
        selectedProvider: ProviderDriverKind.make("codex"),
      }),
    ).toBe(projectId);
  });

  it("keeps voice control hidden without a project or Codex provider", () => {
    expect(
      resolveVoiceControlHostProjectId({
        activeProjectId: null,
        providerAvailable: true,
        selectedProvider: ProviderDriverKind.make("codex"),
      }),
    ).toBeNull();
    expect(
      resolveVoiceControlHostProjectId({
        activeProjectId: projectId,
        providerAvailable: true,
        selectedProvider: ProviderDriverKind.make("claude"),
      }),
    ).toBeNull();
    expect(
      resolveVoiceControlHostProjectId({
        activeProjectId: projectId,
        providerAvailable: false,
        selectedProvider: ProviderDriverKind.make("codex"),
      }),
    ).toBeNull();
  });
});
