import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import type { AdvertisedEndpoint } from "@shuv2code/contracts";

import {
  resolveAdvertisedEndpointPairingUrl,
  resolveDesktopPairingUrl,
  resolveHostedPairingUrl,
} from "./pairingUrls";

describe("settings pairing URL helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses direct backend pairing URLs for HTTP endpoints", () => {
    expect(resolveHostedPairingUrl("http://192.168.1.44:3773", "PAIRCODE")).toBeNull();
    expect(resolveDesktopPairingUrl("http://192.168.1.44:3773", "PAIRCODE")).toBe(
      "http://192.168.1.44:3773/pair#token=PAIRCODE",
    );
  });

  it("uses hosted pairing URLs for HTTPS endpoints", () => {
    vi.stubEnv("VITE_HOSTED_APP_URL", "https://preview.shuv2code.example");

    expect(resolveHostedPairingUrl("https://host.tailnet.example.ts.net:3773", "PAIRCODE")).toBe(
      "https://preview.shuv2code.example/pair?host=https%3A%2F%2Fhost.tailnet.example.ts.net%3A3773#token=PAIRCODE",
    );
  });

  it("does not invent a hosted pairing origin when none is configured", () => {
    expect(
      resolveHostedPairingUrl("https://host.tailnet.example.ts.net:3773", "PAIRCODE"),
    ).toBeNull();
  });

  it("keeps user-configured HTTPS pairing links on the advertised backend", () => {
    vi.stubEnv("VITE_HOSTED_APP_URL", "https://preview.shuv2code.example");
    const endpoint = {
      source: "user",
      httpBaseUrl: "https://code.example.test/",
      compatibility: { hostedHttpsApp: "compatible" },
    } as AdvertisedEndpoint;

    expect(resolveAdvertisedEndpointPairingUrl(endpoint, "PAIRCODE")).toBe(
      "https://code.example.test/pair#token=PAIRCODE",
    );
  });
});
