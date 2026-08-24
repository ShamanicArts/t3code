import { assert, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import * as CodexSchema from "./schema.ts";
import { decodeOptionalPayload } from "./_internal/shared.ts";

const activity = {
  type: "subAgentActivity",
  id: "activity-1",
  agentPath: "/root/worker",
  agentThreadId: "child-thread",
  kind: "completed",
} as const;
const thread = {
  id: "parent-thread",
  sessionId: "parent-session",
  cliVersion: "0.153.3",
  createdAt: 1,
  updatedAt: 2,
  cwd: "/tmp/project",
  ephemeral: false,
  modelProvider: "openai",
  preview: "",
  source: "cli",
  status: { type: "idle" },
  turns: [{ id: "turn-1", status: "completed", items: [activity] }],
};

it.effect("decodes thread/resume history containing completed subagent activity", () =>
  Effect.gen(function* () {
    const response = yield* decodeOptionalPayload(
      "thread/resume",
      CodexSchema.V2ThreadResumeResponse,
      {
        approvalPolicy: "never",
        approvalsReviewer: "user",
        cwd: "/tmp/project",
        model: "gpt-6-astra",
        modelProvider: "openai",
        sandbox: { type: "dangerFullAccess" },
        thread,
      },
    );
    assert.deepEqual(response.thread.turns[0]?.items[0], activity);
  }),
);

it.effect("decodes thread/read history containing completed subagent activity", () =>
  Effect.gen(function* () {
    const response = yield* decodeOptionalPayload("thread/read", CodexSchema.V2ThreadReadResponse, {
      thread,
    });
    assert.deepEqual(response.thread.turns[0]?.items[0], activity);
  }),
);

it("decodes completed subagent activity in live item notifications", () => {
  const payload = {
    threadId: thread.id,
    turnId: "turn-1",
    item: activity,
    startedAtMs: 1,
    completedAtMs: 2,
  };
  for (const schema of [
    CodexSchema.V2ItemStartedNotification,
    CodexSchema.V2ItemCompletedNotification,
  ]) {
    assert.deepEqual(Schema.decodeUnknownSync(schema)(payload).item, activity);
  }
});

it("preserves existing subagent activity kinds and rejects malformed values", () => {
  const accepts = Schema.is(CodexSchema.V2ThreadResumeResponse__ThreadItem);
  for (const kind of ["started", "interacted", "interrupted", "completed"]) {
    assert.isTrue(accepts({ ...activity, kind }), kind);
  }
  for (const kind of [null, 42, {}, "unknown-kind"]) {
    assert.isFalse(accepts({ ...activity, kind }));
  }
});
