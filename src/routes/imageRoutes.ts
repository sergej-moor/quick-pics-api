import { Router } from "https://deno.land/x/oak/mod.ts";

import { images } from "../data/imageData.ts";
import { ImageCategory } from "../types/types.ts";
import { ImageController } from "../controllers/imageController.ts";
import { DocumentationService } from "../services/documentationService.ts";

const router = new Router();

function isValidCategory(category: string): category is ImageCategory {
  return Object.values(ImageCategory).includes(category as ImageCategory);
}

router
  .get("/list", (ctx) => {
    ctx.response.body = images.map((img) => ({
      id: img.id,
      category: img.category,
      title: img.title,
    }));
  })
  // Get documentation
  .get("/docs", (ctx) => {
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = DocumentationService.getApiDocs();
  })

  // Get random image
  .get("/", (ctx) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];

    // Check for resize params
    if (
      ctx.request.url.searchParams.has("w") ||
      ctx.request.url.searchParams.has("h")
    ) {
      ctx.params.id = randomImage.id.toString(); // Set the id param for the resize function
      return ImageController.sendResizedImage(ctx);
    }

    ImageController.sendImage(ctx, randomImage);
  })

  // Get random image by category
  .get("/:category", (ctx) => {
    const category = ctx.params.category;

    if (!isValidCategory(category)) {
      ctx.response.status = 400;
      ctx.response.body = {
        message:
          "Invalid category. Must be one of: 3d, glass, water, painting, pouring",
      };
      return;
    }

    const categoryImages = images.filter((img) => img.category === category);

    if (categoryImages.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "No images found in this category" };
      return;
    }

    const randomIndex = Math.floor(Math.random() * categoryImages.length);
    const randomImage = categoryImages[randomIndex];

    // Check for resize params
    if (
      ctx.request.url.searchParams.has("w") ||
      ctx.request.url.searchParams.has("h")
    ) {
      ctx.params.id = randomImage.id.toString();
      return ImageController.sendResizedImage(ctx);
    }

    ImageController.sendImage(ctx, randomImage);
  })

  // Get specific image by ID
  .get("/:id", (ctx) => {
    // Check for resize params
    if (
      ctx.request.url.searchParams.has("w") ||
      ctx.request.url.searchParams.has("h")
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
