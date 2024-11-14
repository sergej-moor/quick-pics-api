import { Router } from "https://deno.land/x/oak/mod.ts";

import { images } from "../data/imageData.ts";
import { ImageCategory } from "../types/types.ts";
import { ImageController } from "../controllers/imageController.ts";

const router = new Router();

router
  .get("/images/list", (ctx) => {
    ctx.response.body = images.map((img) => ({
      id: img.id,
      category: img.category,
      title: img.title,
    }));
  })
  // Get random image
  .get("/images", (ctx) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];

    // Check for resize params
    if (
      ctx.request.url.searchParams.has("width") ||
      ctx.request.url.searchParams.has("height")
    ) {
      ctx.params.id = randomImage.id.toString(); // Set the id param for the resize function
      return ImageController.sendResizedImage(ctx);
    }

    ImageController.sendImage(ctx, randomImage);
  })

  // Get random image by category
  .get("/images/:category", (ctx) => {
    const category = ctx.params.category as ImageCategory;
    const categoryImages = images.filter((img) => img.category === category);

    if (categoryImages.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Category not found" };
      return;
    }

    const randomIndex = Math.floor(Math.random() * categoryImages.length);
    const randomImage = categoryImages[randomIndex];

    // Check for resize params
    if (
      ctx.request.url.searchParams.has("width") ||
      ctx.request.url.searchParams.has("height")
    ) {
      ctx.params.id = randomImage.id.toString(); // Set the id param for the resize function
      return ImageController.sendResizedImage(ctx);
    }

    ImageController.sendImage(ctx, randomImage);
  })

  // Get specific image by ID
  .get("/images/:id", (ctx) => {
    // Check for resize params
    if (
      ctx.request.url.searchParams.has("width") ||
      ctx.request.url.searchParams.has("height")
    ) {
      return ImageController.sendResizedImage(ctx);
    }

    // If no resize params, send original
    const id = ctx.params.id;
    const image = images.find((img) => img.id.toString() === id);

    if (!image) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Image not found" };
      return;
    }

    ImageController.sendImage(ctx, image);
  });

export default router;
