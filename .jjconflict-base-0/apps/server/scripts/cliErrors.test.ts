import { assert, describe, it } from "@effect/vitest";

import {
  ServerCliBuildAssetMissingError,
  ServerCliCommandExitError,
  ServerCliDevelopmentIconSourceMissingError,
  ServerCliDevelopmentIconTargetMissingError,
  ServerCliPublishIconSourceMissingError,
  ServerCliPublishIconTargetMissingError,
} from "./cliErrors.ts";

describe("server CLI errors", () => {
  it("preserves failed command context without changing its message", () => {
    const error = new ServerCliCommandExitError({
      command: process.execPath,
      args: ["--run", "build:bundle"],
      cwd: "/repo",
      exitCode: 17,
    });

    assert.equal(error._tag, "ServerCliCommandExitError");
    assert.equal(error.command, process.execPath);
    assert.deepEqual(error.args, ["--run", "build:bundle"]);
    assert.equal(error.cwd, "/repo");
    assert.equal(error.exitCode, 17);
    assert.equal(error.message, "Command exited with non-zero exit code (17)");
  });

  it("preserves a representative missing development icon path", () => {
    const error = new ServerCliDevelopmentIconTargetMissingError({
      targetPath: "/repo/dist/client/favicon.ico",
    });

    assert.equal(error.targetPath, "/repo/dist/client/favicon.ico");
    assert.equal(
      error.message,
      "Missing development icon target: /repo/dist/client/favicon.ico. Build web first.",
    );
  });

  it("preserves every missing build and icon asset path", () => {
    const errors = [
      new ServerCliBuildAssetMissingError({ assetPath: "/repo/dist/bin.mjs" }),
      new ServerCliDevelopmentIconSourceMissingError({ sourcePath: "/repo/assets/dev.png" }),
      new ServerCliPublishIconSourceMissingError({ sourcePath: "/repo/assets/prod.png" }),
      new ServerCliPublishIconTargetMissingError({ targetPath: "/repo/dist/favicon.ico" }),
    ];

    assert.deepEqual(
      errors.map((error) => error.message),
      [
        "Missing build asset: /repo/dist/bin.mjs. Run the build subcommand first.",
        "Missing development icon source: /repo/assets/dev.png",
        "Missing publish icon source: /repo/assets/prod.png",
        "Missing publish icon target: /repo/dist/favicon.ico. Run the build subcommand first.",
      ],
    );
  });
});
