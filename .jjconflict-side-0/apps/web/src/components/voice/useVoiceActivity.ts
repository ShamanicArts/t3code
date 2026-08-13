import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceMediaActivity = "listening" | "user-speaking" | "assistant-speaking";

interface AudioProbe {
  readonly analyser: AnalyserNode;
  readonly samples: Float32Array<ArrayBuffer>;
}

interface AudioSignal {
  readonly context: AudioContext;
  readonly input: AudioProbe;
  output?: AudioProbe;
}

function createProbe(context: AudioContext, stream: MediaStream): AudioProbe {
  const analyser = context.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.72;
  context.createMediaStreamSource(stream).connect(analyser);
  return { analyser, samples: new Float32Array(analyser.fftSize) };
}

function sampledLevel(probe: AudioProbe): number {
  probe.analyser.getFloatTimeDomainData(probe.samples);
  let sum = 0;
  for (const sample of probe.samples) sum += sample * sample;
  const rms = Math.sqrt(sum / probe.samples.length);
  return Math.min(1, Math.max(0, (rms - 0.008) * 10.5));
}

/**
 * Samples live Call media outside React's render loop. Only speech-boundary
 * changes reach React; the shader reads continuous energy through a ref.
 */
export function useVoiceActivity(enabled: boolean) {
  const activityLevel = useRef(0);
  const signalRef = useRef<AudioSignal | null>(null);
  const remoteSpeakingUntilRef = useRef(0);
  const activityRef = useRef<VoiceMediaActivity>("listening");
  const [activity, setActivity] = useState<VoiceMediaActivity>("listening");

  const publishActivity = useCallback((next: VoiceMediaActivity) => {
    if (activityRef.current === next) return;
    activityRef.current = next;
    setActivity(next);
  }, []);

  const dispose = useCallback(() => {
    const signal = signalRef.current;
    signalRef.current = null;
    remoteSpeakingUntilRef.current = 0;
    activityLevel.current = 0;
    publishActivity("listening");
    if (signal) void signal.context.close().catch(() => undefined);
  }, [publishActivity]);

  const attachMicrophone = useCallback(
    async (stream: MediaStream) => {
      dispose();
      try {
        const context = new AudioContext();
        signalRef.current = { context, input: createProbe(context, stream) };
        await context.resume();
      } catch {
        // Voice media remains usable if a browser refuses the optional analyser.
        dispose();
      }
    },
    [dispose],
  );

  const attachRemoteAudio = useCallback((stream: MediaStream) => {
    const signal = signalRef.current;
    if (!signal) return;
    try {
      signal.output = createProbe(signal.context, stream);
      void signal.context.resume().catch(() => undefined);
    } catch {
      // Remote playback is owned by WebRTC; visual analysis must never break it.
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      dispose();
      return;
    }

    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(sample, 1_000 / 30);
    };
    const sample = () => {
      timer = 0;
      if (document.visibilityState !== "visible") return;
      const signal = signalRef.current;
      if (!signal) {
        activityLevel.current = 0;
        schedule();
        return;
      }

      const now = performance.now();
      const inputLevel = sampledLevel(signal.input);
      const outputLevel = signal.output ? sampledLevel(signal.output) : 0;
      if (outputLevel > 0.012) {
        remoteSpeakingUntilRef.current = now + 420;
        publishActivity("assistant-speaking");
      } else if (now < remoteSpeakingUntilRef.current) {
        publishActivity("assistant-speaking");
      } else if (inputLevel > 0.018) {
        publishActivity("user-speaking");
      } else {
        publishActivity("listening");
      }
      activityLevel.current =
        activityRef.current === "assistant-speaking" && signal.output ? outputLevel : inputLevel;
      schedule();
    };
    const handleVisibilityChange = () => {
      window.clearTimeout(timer);
      timer = 0;
      if (document.visibilityState === "visible") sample();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    sample();
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispose, enabled, publishActivity]);

  useEffect(() => dispose, [dispose]);

  return { activity, activityLevel, attachMicrophone, attachRemoteAudio };
}
