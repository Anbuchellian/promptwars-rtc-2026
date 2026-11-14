import { describe, expect, it } from "vitest";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("allows requests up to maxRequests and blocks excess until window expires", () => {
    let currentTime = 1_000_000;
    const limiter = createRateLimiter({
      windowMs: 10_000,
      maxRequests: 3,
      now: () => currentTime,
    });

    expect(limiter.check("client-a")).toMatchObject({
      allowed: true,
      remaining: 2,
    });
    expect(limiter.check("client-a")).toMatchObject({
      allowed: true,
      remaining: 1,
    });
    expect(limiter.check("client-a")).toMatchObject({
      allowed: true,
      remaining: 0,
    });

    const blocked = limiter.check("client-a");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(10);

    // Other client is unaffected
    expect(limiter.check("client-b").allowed).toBe(true);

    // Advance past window
    currentTime += 10_001;
    expect(limiter.check("client-a").allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("extracts the first IP from x-forwarded-for", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.10, 10.0.0.1",
    });
    expect(getClientIp(headers)).toBe("203.0.113.10");
  });

  it("falls back to x-real-ip and anonymous", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "198.51.100.5" }))).toBe(
      "198.51.100.5"
    );
    expect(getClientIp(new Headers())).toBe("anonymous");
  });
});
