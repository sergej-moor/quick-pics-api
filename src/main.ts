import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./routes/imageRoutes.ts";
import { ImageProcessingService } from "./services/imageProcessingService.ts";
import { validateQueryParams } from "./middleware/validationMiddleware.ts";

const app = new Application();
const port = 8000;

// Add this before creating the Application

// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = { message: err.message };
  }
});

// CORS middleware
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  await next();
});

app.use(validateQueryParams);

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server running on port ${port}`);
await app.listen({ port });
