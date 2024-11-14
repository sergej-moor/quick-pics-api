import { Context } from "https://deno.land/x/oak/mod.ts";
import { images } from "../data/imageData.ts";
import { Image, ImageCategory } from "../types/types.ts";
import {
  ImageProcessingService,
  ImageProcessingOptions,
} from "../services/imageProcessingService.ts";
import { decodeBase64 } from "https://deno.land/std/encoding/base64.ts";

export class ImageController {
  static async getAll(ctx: Context) {
    ctx.response.body = Array.from(images.values());
  }

  static async getByCategory(ctx: Context) {
    const category = ctx.params.category as ImageCategory;
    const images = Array.from(images.values()).filter(
      (img) => img.category === category
    );
    ctx.response.body = images;
  }

  static async getById(ctx: Context) {
    const id = ctx.params.id;
    const image = images.get(id);

    if (!image) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Image not found" };
      return;
    }

    ctx.response.body = image;
  }

  static sendJpegImage = (ctx: any, image: any) => {
    const base64Data = image.base64.replace(/^data:image\/jpeg;base64,/, "");
    const imageBytes = decodeBase64(base64Data);

    ctx.response.headers.set("Content-Type", "image/jpeg");
    ctx.response.headers.set("Content-Length", imageBytes.length.toString());
    ctx.response.headers.set("Cache-Control", "public, max-age=86400");
    ctx.response.headers.set("ETag", `"${image.id}"`);

    ctx.response.body = imageBytes;
  };

  static async sendImage(ctx: Context, image: Image) {
    const width =
      Number(ctx.request.url.searchParams.get("width")) || undefined;
    const height =
      Number(ctx.request.url.searchParams.get("height")) || undefined;
    const mode = (ctx.request.url.searchParams.get("mode") || "resize") as
      | "resize"
      | "crop";

    // If no resize parameters, send original
    if (!width && !height) {
      return this.sendJpegImage(ctx, image);
    }

    // Otherwise process the image
    await this.sendResizedImage(ctx);
  }

  static async sendResizedImage(ctx: Context) {
    const id = ctx.params.id;
    const image = images.find((img) => img.id.toString() === id);

    if (!image) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Image not found" };
      return;
    }

    const width =
      Number(ctx.request.url.searchParams.get("width")) || undefined;
    const height =
      Number(ctx.request.url.searchParams.get("height")) || undefined;
    const mode = (ctx.request.url.searchParams.get("mode") || "resize") as
      | "resize"
      | "crop";

    const validationError = ImageProcessingService.validateDimensions(
      width,
      height
    );
    if (validationError) {
      ctx.response.status = 400;
      ctx.response.body = { message: validationError };
      return;
    }

    try {
      const base64Data = image.base64.replace(/^data:image\/jpeg;base64,/, "");
      const imageBuffer = decodeBase64(base64Data);

      const processedImage = await ImageProcessingService.processImage(
        imageBuffer,
        {
          width,
          height,
          mode,
        }
      );

      ctx.response.headers.set("Content-Type", "image/jpeg");
      ctx.response.headers.set(
        "Content-Length",
        processedImage.length.toString()
      );
      ctx.response.headers.set("Cache-Control", "public, max-age=86400");
      ctx.response.body = processedImage;
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { message: "Error processing image" };
    }
  }
}
