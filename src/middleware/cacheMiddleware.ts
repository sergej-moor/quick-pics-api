import { Context, Next } from "https://deno.land/x/oak/mod.ts";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 3600 * 2000;

export async function cacheResponse(ctx: Context, next: Next) {
  const cacheKey = ctx.request.url.toString();
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    ctx.response.body = cached.data;
    return;
  }

  await next();

  if (ctx.response.status === 200) {
    cache.set(cacheKey, {
      data: ctx.response.body,
      timestamp: Date.now(),
    });
  }
}
