import type { TurnId } from "@shuv2code/contracts";

export type ComposerTurnDispatch =
  | { readonly _tag: "start" }
  | { readonly _tag: "steer"; readonly expectedTurnId: TurnId }
  | { readonly _tag: "queue"; readonly reason: "steering-unsupported" | "synchronizing" };

export type ComposerTurnSteeringCapability = "same-turn" | "unsupported" | undefined;

export function resolveComposerTurnDispatch(input: {
  readonly isServerThread: boolean;
  readonly turnSteering: ComposerTurnSteeringCapability;
  readonly session:
    | {
        readonly status: string;
        readonly activeTurnId: TurnId | null;
      }
    | null
    | undefined;
}): ComposerTurnDispatch {
  if (!input.isServerThread || input.session?.status !== "running") {
    return { _tag: "start" };
  }
  if (input.turnSteering !== "same-turn") {
    return { _tag: "queue", reason: "steering-unsupported" };
  }
  return input.session.activeTurnId
    ? { _tag: "steer", expectedTurnId: input.session.activeTurnId }
    : { _tag: "queue", reason: "synchronizing" };
}

export async function dispatchComposerTurn<TStartResult, TSteerResult>(input: {
  readonly dispatch: ComposerTurnDispatch;
  readonly start: () => Promise<TStartResult>;
  readonly steer: (expectedTurnId: TurnId) => Promise<TSteerResult>;
}): Promise<TStartResult | TSteerResult | null> {
  switch (input.dispatch._tag) {
    case "start":
      return input.start();
    case "steer":
      return input.steer(input.dispatch.expectedTurnId);
    case "queue":
      return null;
  }
}

export function shouldRestoreComposerDraftAfterSendFailure(input: {
  readonly promptEmpty: boolean;
  readonly imagesEmpty: boolean;
  readonly terminalContextsEmpty: boolean;
  readonly elementContextsEmpty: boolean;
  readonly previewAnnotationsEmpty: boolean;
  readonly reviewCommentsEmpty: boolean;
}): boolean {
  return Object.values(input).every(Boolean);
}
