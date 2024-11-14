import { Context, Next } from "https://deno.land/x/oak/mod.ts";

export async function validateQueryParams(ctx: Context, next: Next) {
  const params = ctx.request.url.searchParams;

  // Validate numeric parameters
  const numericParams = ["w", "h", "q"];
  for (const param of numericParams) {
    const value = params.get(param);
    if (value && (!Number(value) || Number(value) < 0)) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: `Invalid ${param} parameter. Must be a positive number.`,
      };
      return;
    }
  }

  // Validate mode parameter
  const mode = params.get("mode");
  if (mode && !["resize", "crop"].includes(mode)) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Mode must be either 'resize' or 'crop'" };
    return;
  }

  await next();
}
