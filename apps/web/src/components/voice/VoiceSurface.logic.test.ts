// @ts-expect-error Direct Vitest import bypasses the broken Vite+ test adapter on this checkout.
import { describe, expect, it } from "vitest";

import { resolveVoicePresencePhase } from "./VoiceSurface.logic";

describe("resolveVoicePresencePhase", () => {
  it("keeps incoming agent speech visible while the microphone is muted", () => {
    expect(
      resolveVoicePresencePhase(
        true,
        { type: "connected", activity: "assistant-speaking" },
        true,
        "listening",
      ),
    ).toBe("speaking");
    expect(
      resolveVoicePresencePhase(
        true,
        { type: "connected", activity: "listening" },
        true,
        "assistant-speaking",
      ),
    ).toBe("speaking");
  });

  it("shows muted only while no incoming agent speech is active", () => {
    expect(
      resolveVoicePresencePhase(
        true,
        { type: "connected", activity: "listening" },
        true,
        "listening",
      ),
    ).toBe("muted");
  });
});
