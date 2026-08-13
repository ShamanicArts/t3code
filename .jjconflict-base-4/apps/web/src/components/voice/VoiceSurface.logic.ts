import type { RealtimeVoiceSessionState } from "@shuv2code/client-runtime/state/realtime-voice";
import type { EnvironmentId } from "@shuv2code/contracts";

import type { VoiceSurfaceContext } from "./VoiceSurface";

export interface VoiceCallPresentation {
  readonly sessionHere: boolean;
  readonly context: VoiceSurfaceContext;
}

/**
 * A Call belongs to its durable Voice owner, not to the currently selected
 * thread. Keep presenting that owner while navigation remounts the surface.
 */
export function resolveVoiceCallPresentation(
  environmentId: EnvironmentId,
  state: RealtimeVoiceSessionState,
  currentContext: VoiceSurfaceContext,
): VoiceCallPresentation {
  const sessionHere = state.environmentId === environmentId && state.owner?.kind === "thread-call";
  if (!sessionHere) return { sessionHere: false, context: currentContext };

  const presentation = state.controller;
  if (presentation === null || presentation.environmentId !== environmentId) {
    return { sessionHere: true, context: currentContext };
  }

  return {
    sessionHere: true,
    context: {
      ...currentContext,
      threadId: presentation.threadId,
      threadTitle: presentation.title,
    },
  };
}
