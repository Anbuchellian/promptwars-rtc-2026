export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  now?: () => number;
}

export function createRateLimiter({
  windowMs,
  maxRequests,
  now = () => Date.now(),
}: RateLimiterOptions) {
  const buckets = new Map<string, number[]>();

  return {
    check(key: string): RateLimitResult {
      const currentTime = now();
      const windowStart = currentTime - windowMs;
      const existing = buckets.get(key) ?? [];
      const active = existing.filter((timestamp) => timestamp > windowStart);

      if (active.length >= maxRequests) {
        const oldestActive = active[0];
        const retryAfterMs = Math.max(0, oldestActive + windowMs - currentTime);
        buckets.set(key, active);
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
        };
      }

      active.push(currentTime);
      buckets.set(key, active);

      // Periodic cleanup of stale buckets to keep memory bounded
      if (buckets.size > 1000) {
        for (const [bucketKey, timestamps] of buckets.entries()) {
          if (timestamps.every((ts) => ts <= windowStart)) {
            buckets.delete(bucketKey);
          }
        }
      }

      return {
        allowed: true,
        remaining: Math.max(0, maxRequests - active.length),
        retryAfterSeconds: 0,
      };
    },
    reset() {
      buckets.clear();
    },
  };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "anonymous";
}

// Default API limiter: 30 requests per 60 seconds per client IP
export const apiRateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 30,
});
