import { TurnId } from "@shuv2code/contracts";
import { describe, expect, it } from "vite-plus/test";

import {
  dispatchComposerTurn,
  resolveComposerTurnDispatch,
  shouldRestoreComposerDraftAfterSendFailure,
} from "./composerTurnDispatch";

describe("resolveComposerTurnDispatch", () => {
  it("steers a running server thread against its exact active turn", () => {
    expect(
      resolveComposerTurnDispatch({
        isServerThread: true,
        turnSteering: "same-turn",
        session: { status: "running", activeTurnId: TurnId.make("turn-1") },
      }),
    ).toEqual({ _tag: "steer", expectedTurnId: "turn-1" });
  });

  it("starts an idle server thread or local draft", () => {
    expect(
      resolveComposerTurnDispatch({
        isServerThread: true,
        turnSteering: "same-turn",
        session: { status: "ready", activeTurnId: null },
      }),
    ).toEqual({ _tag: "start" });
    expect(
      resolveComposerTurnDispatch({
        isServerThread: false,
        turnSteering: undefined,
        session: null,
      }),
    ).toEqual({ _tag: "start" });
  });

  it("queues a running provider that does not support same-turn steering", () => {
    expect(
      resolveComposerTurnDispatch({
        isServerThread: true,
        turnSteering: "unsupported",
        session: { status: "running", activeTurnId: TurnId.make("turn-1") },
      }),
    ).toEqual({ _tag: "queue", reason: "steering-unsupported" });
  });

  it("briefly queues a steering provider while its active turn synchronizes", () => {
    expect(
      resolveComposerTurnDispatch({
        isServerThread: true,
        turnSteering: "same-turn",
        session: { status: "running", activeTurnId: null },
      }),
    ).toEqual({ _tag: "queue", reason: "synchronizing" });
  });
});

describe("dispatchComposerTurn", () => {
  it("routes an exact active turn to steer and propagates a command failure", async () => {
    const failure = { _tag: "Failure" as const, error: new Error("stale target") };
    const started: string[] = [];
    const steered: string[] = [];

    await expect(
      dispatchComposerTurn({
        dispatch: { _tag: "steer", expectedTurnId: TurnId.make("turn-1") },
        start: async () => {
          started.push("start");
          return { _tag: "Success" as const };
        },
        steer: async (turnId) => {
          steered.push(turnId);
          return failure;
        },
      }),
    ).resolves.toBe(failure);
    expect(started).toEqual([]);
    expect(steered).toEqual(["turn-1"]);
  });

  it("does not dispatch while queued", async () => {
    const calls: string[] = [];
    await expect(
      dispatchComposerTurn({
        dispatch: { _tag: "queue", reason: "steering-unsupported" },
        start: async () => {
          calls.push("start");
          return "start";
        },
        steer: async () => {
          calls.push("steer");
          return "steer";
        },
      }),
    ).resolves.toBeNull();
    expect(calls).toEqual([]);
  });
});

describe("shouldRestoreComposerDraftAfterSendFailure", () => {
  it("restores only when the user has not started a replacement draft", () => {
    expect(
      shouldRestoreComposerDraftAfterSendFailure({
        promptEmpty: true,
        imagesEmpty: true,
        terminalContextsEmpty: true,
        elementContextsEmpty: true,
        previewAnnotationsEmpty: true,
        reviewCommentsEmpty: true,
      }),
    ).toBe(true);
    expect(
      shouldRestoreComposerDraftAfterSendFailure({
        promptEmpty: false,
        imagesEmpty: true,
        terminalContextsEmpty: true,
        elementContextsEmpty: true,
        previewAnnotationsEmpty: true,
        reviewCommentsEmpty: true,
      }),
    ).toBe(false);
  });
});
