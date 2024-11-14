import { Router } from "https://deno.land/x/oak/mod.ts";

const healthRouter = new Router();

healthRouter.get("/health", (ctx) => {
  ctx.response.body = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: process.uptime(),
  };
});

export default healthRouter;
