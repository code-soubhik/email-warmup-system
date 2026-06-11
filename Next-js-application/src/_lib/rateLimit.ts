import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "./redis";
import rateLimitConfig from "@/_utils/rateLimitConfig";

export function withRateLimit(handler: any) {
  return async (req: NextRequest) => {
    try {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";
      const method = req.method;
      const pathname = new URL(req.url).pathname;
      
      /* ---------------- GLOBAL LIMIT ---------------- */
      const {limit: globalLimit, window: globalWindow} = rateLimitConfig.global;
      
      const globalKey = `ratelimit:global:${ip}`;
      const globalCount = await redis.incr(globalKey);
      
      if (globalCount === 1) {
        await redis.expire(globalKey, globalWindow);
      }
      
      if (globalCount > globalLimit) {
        return NextResponse.json(
          { error: "Global rate limit exceeded" },
          { status: 429 }
        );
      }
      
      /* ---------------- ROUTE LIMIT ---------------- */
      const { limit, window } = rateLimitConfig.routes[pathname] ?? rateLimitConfig.default;

      const routeKey = `ratelimit:${method}:${pathname}:${ip}`;
      const count = await redis.incr(routeKey);

      if (count === 1) {
        await redis.expire(routeKey, window);
      }

      if (count > limit) {
        return NextResponse.json(
          { error: "Rate limit exceeded" },
          { status: 429 }
        );
      }

      /* ---------------- PASS THROUGH ---------------- */

      return handler(req);
    } catch (err) {
      console.error("Rate limiter error:", err);

      // fail-open for availability
      return handler(req);
    }
  };
}