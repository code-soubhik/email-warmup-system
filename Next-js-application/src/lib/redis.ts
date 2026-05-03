import "server-only";
import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
  redis?: ReturnType<typeof createClient>;
};

export const redis =
  globalForRedis.redis ??
  createClient({
    url: process.env.REDIS_URL,
    socket: {
      connectTimeout: 5000,
    },
  });

if (!globalForRedis.redis) {
  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("reconnecting", () => {
    console.warn("Redis reconnecting...");
  });

  redis.connect().catch((err) => {
    console.error("Redis connection failed:", err);
  });

  globalForRedis.redis = redis;
}