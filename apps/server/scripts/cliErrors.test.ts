import { assert, describe, it } from "@effect/vitest";

import {
  ServerCliBuildAssetMissingError,
  ServerCliCommandExitError,
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

  it("reports missing build and publish assets with their exact paths", () => {
    const build = new ServerCliBuildAssetMissingError({ assetPath: "/repo/dist/bin.mjs" });
    const source = new ServerCliPublishIconSourceMissingError({
      sourcePath: "/repo/assets/prod/favicon.ico",
    });
    const target = new ServerCliPublishIconTargetMissingError({
      targetPath: "/repo/dist/client/favicon.ico",
    });

    assert.equal(build.message, "Missing server build asset: /repo/dist/bin.mjs");
    assert.equal(source.message, "Missing publish icon source: /repo/assets/prod/favicon.ico");
    assert.equal(
      target.message,
      "Missing publish icon target: /repo/dist/client/favicon.ico. Build web first.",
    );
  });
});
