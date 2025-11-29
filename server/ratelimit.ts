"use server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

// Create Redis client using KV_REST_API_* variables
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Create a new ratelimiter that allows 2 requests per day
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(2, "1 d"), // 2 requests per day
  analytics: true,
  prefix: "christmas-photo",
});

async function getIdentifier(): Promise<string> {
  const headersList = await headers();
  // Try to get real IP from various headers (for production behind proxy)
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  if (realIp) {
    return realIp;
  }

  // Fallback - in development this might be localhost
  return "anonymous";
}

export interface RateLimitInfo {
  success: boolean;
  remaining: number;
  limit: number;
  reset: number; // timestamp when the limit resets
}

export async function checkRateLimit(): Promise<RateLimitInfo> {
  const identifier = await getIdentifier();
  const { success, remaining, limit, reset } = await ratelimit.limit(
    identifier
  );

  return {
    success,
    remaining: success ? remaining : 0,
    limit,
    reset,
  };
}

export async function getRateLimitStatus(): Promise<RateLimitInfo> {
  const identifier = await getIdentifier();

  // Use remaining() to check without consuming
  const { remaining, reset } = await ratelimit.getRemaining(identifier);

  return {
    success: remaining > 0,
    remaining,
    limit: 2, // Fixed limit value
    reset,
  };
}
