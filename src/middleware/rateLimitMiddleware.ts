import { Context, Next } from "https://deno.land/x/oak/mod.ts";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // 100 requests per window allowed

const requests = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(ctx: Context, next: Next) {
  const ip = ctx.request.ip;
  const now = Date.now();

  let request = requests.get(ip);
  if (!request || now > request.resetTime) {
    request = { count: 0, resetTime: now + WINDOW_MS };
  }

  if (request.count >= MAX_REQUESTS) {
    ctx.response.status = 429;
    ctx.response.headers.set(
      "Retry-After",
      String(Math.ceil((request.resetTime - now) / 1000))
    );
    ctx.response.body = { message: "Too many requests" };
    return;
  }

  request.count++;
  requests.set(ip, request);

  await next();
}
