import {
  CommandId,
  EventId,
  ProjectId,
  ThreadId,
  type OrchestrationEvent,
} from "@shuv2code/contracts";
import { expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";

import { createEmptyReadModel, projectEvent } from "./projector.ts";

function makeEvent(input: {
  readonly sequence: number;
  readonly type: OrchestrationEvent["type"];
  readonly occurredAt: string;
  readonly commandId: string;
  readonly payload: unknown;
}): OrchestrationEvent {
  return {
    sequence: input.sequence,
    eventId: EventId.make(`voice-event-${input.sequence}`),
    type: input.type,
    aggregateKind: "thread",
    aggregateId: ThreadId.make("thread-voice"),
    occurredAt: input.occurredAt,
    commandId: CommandId.make(input.commandId),
    causationEventId: null,
    correlationId: null,
    metadata: {},
    payload: input.payload as never,
  } as OrchestrationEvent;
}

it.effect("projects realtime voice as a completed model turn with exact delegated speech", () =>
  Effect.gen(function* () {
    const createdAt = "2026-01-01T00:00:00.000Z";
    const completedAt = "2026-01-01T00:00:02.000Z";
    const afterCreate = yield* projectEvent(
      createEmptyReadModel(createdAt),
      makeEvent({
        sequence: 1,
        type: "thread.created",
        occurredAt: createdAt,
        commandId: "cmd-create-voice",
        payload: {
          threadId: "thread-voice",
          projectId: ProjectId.make("project-1"),
          title: "voice",
          modelSelection: { provider: "codex", model: "gpt-5-codex" },
          runtimeMode: "full-access",
          branch: null,
          worktreePath: null,
          createdAt,
          updatedAt: createdAt,
        },
      }),
    );
    const next = yield* projectEvent(
      afterCreate,
      makeEvent({
        sequence: 2,
        type: "thread.voice-exchange-appended",
        occurredAt: completedAt,
        commandId: "cmd-voice-exchange",
        payload: {
          threadId: "thread-voice",
          turnId: "turn-voice-1",
          userMessage: { messageId: "message-voice-user", text: "Are we nearly done?" },
          assistantMessage: {
            messageId: "message-voice-assistant",
            text: "Yes, nearly.",
          },
          createdAt,
          completedAt,
        },
      }),
    );

    expect(next.threads[0]?.messages).toEqual([
      expect.objectContaining({
        id: "message-voice-user",
        role: "user",
        text: "Are we nearly done?",
        turnId: "turn-voice-1",
      }),
      expect.objectContaining({
        id: "message-voice-assistant",
        role: "assistant",
        text: "Yes, nearly.",
        turnId: "turn-voice-1",
      }),
    ]);
    expect(next.threads[0]?.latestTurn).toEqual({
      turnId: "turn-voice-1",
      state: "completed",
      requestedAt: createdAt,
      startedAt: createdAt,
      completedAt,
      assistantMessageId: "message-voice-assistant",
    });

    const withDelegatedSpeech = yield* projectEvent(
      next,
      makeEvent({
        sequence: 3,
        type: "thread.voice-speech-appended",
        occurredAt: completedAt,
        commandId: "cmd-voice-speech",
        payload: {
          threadId: "thread-voice",
          turnId: "turn-voice-1",
          messageId: "message-voice-speech",
          text: "The spoken summary appears here exactly.",
          createdAt: completedAt,
        },
      }),
    );
    expect(withDelegatedSpeech.threads[0]?.messages.at(-1)).toEqual(
      expect.objectContaining({
        id: "message-voice-speech",
        role: "assistant",
        text: "The spoken summary appears here exactly.",
        turnId: "turn-voice-1",
        streaming: false,
      }),
    );
    expect(withDelegatedSpeech.threads[0]?.latestTurn).toEqual(next.threads[0]?.latestTurn);
  }),
);
