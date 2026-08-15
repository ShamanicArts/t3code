import type { RealtimeVoiceSessionState } from "@shuv2code/client-runtime/state/realtime-voice";

import type { VoiceMediaActivity } from "./useVoiceActivity";
import type { VoicePresencePhase } from "./voicePresenceTheme";

/**
 * Microphone mute controls only local input. Incoming agent audio and its
 * transcript remain live, so speaking must take precedence over muted
 * presentation whenever either the session or media analyser observes it.
 */
export function resolveVoicePresencePhase(
  sessionHere: boolean,
  phase: RealtimeVoiceSessionState["phase"],
  muted: boolean,
  mediaActivity: VoiceMediaActivity,
): VoicePresencePhase {
  if (!sessionHere || phase.type === "idle") return "idle";
  if (phase.type !== "connected") return "thinking";
  if (phase.activity === "assistant-speaking" || mediaActivity === "assistant-speaking") {
    return "speaking";
  }
  if (phase.activity === "thinking") return "thinking";
  if (muted) return "muted";
  return "listening";
}
