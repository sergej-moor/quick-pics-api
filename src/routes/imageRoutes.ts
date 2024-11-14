import { Router } from "https://deno.land/x/oak/mod.ts";
import { decodeBase64 } from "https://deno.land/std/encoding/base64.ts";
import { images } from "../data/imageData.ts";
import { ImageCategory } from "../types/types.ts";

const router = new Router();

// Helper function to send image
const sendJpegImage = (ctx: any, image: any) => {
  const base64Data = image.base64.replace(/^data:image\/jpeg;base64,/, "");
  const imageBytes = decodeBase64(base64Data);

  ctx.response.headers.set("Content-Type", "image/jpeg");
  ctx.response.headers.set("Content-Length", imageBytes.length.toString());
  ctx.response.headers.set("Cache-Control", "public, max-age=86400");
  ctx.response.headers.set("ETag", `"${image.id}"`);

  ctx.response.body = imageBytes;
};

router
  // Get random image
  .get("/images", (ctx) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    sendJpegImage(ctx, randomImage);
  })

  // Get random image by category
  .get("/images/category/:category", (ctx) => {
    const category = ctx.params.category as ImageCategory;
    const categoryImages = images.filter((img) => img.category === category);

    if (categoryImages.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Category not found" };
      return;
    }

    const randomIndex = Math.floor(Math.random() * categoryImages.length);
    const randomImage = categoryImages[randomIndex];
    sendJpegImage(ctx, randomImage);
  })

  // Get specific image by ID
  .get("/images/:id", (ctx) => {
    const id = ctx.params.id;
    const image = images.find((img) => img.id === id);

    if (!image) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Image not found" };
      return;
    }

    sendJpegImage(ctx, image);
  });

export default router;
