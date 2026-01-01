import { redis } from "../config/redis.js";

// Allow 5 requests (limit) per 60 seconds (windowSec)
export async function rateLimit(key, limit, windowSec) {
  const fullKey = `ratelimit:${key}`;

  const count = await redis.incr(fullKey);
  if (count === 1) {
    await redis.expire(fullKey, windowSec);
  }

  return count > limit;
}
