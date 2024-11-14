import { Context, RouterContext } from "https://deno.land/x/oak/mod.ts";

import { images } from "../data/imageData.ts";
import { Image } from "../types/types.ts";
import { ImageProcessingService } from "../services/imageProcessingService.ts";
import { decodeBase64 } from "https://deno.land/std/encoding/base64.ts";

export class ImageController {
  private static getResizeOptions(ctx: Context) {
    return {
      width: Number(ctx.request.url.searchParams.get("w")) || undefined,
      height: Number(ctx.request.url.searchParams.get("h")) || undefined,
      mode: (ctx.request.url.searchParams.get("mode") || "resize") as
        | "resize"
        | "crop",
      quality: Number(ctx.request.url.searchParams.get("q")) || 60,
    };
  }

  private static decodeImageBase64(base64: string): Uint8Array {
    const base64Data = base64.replace(/^data:image\/jpeg;base64,/, "");
    return decodeBase64(base64Data);
  }

  private static setImageHeaders(ctx: Context, length: number, id?: string) {
    ctx.response.headers.set("Content-Type", "image/jpeg");
    ctx.response.headers.set("Content-Length", length.toString());
    ctx.response.headers.set("Cache-Control", "public, max-age=86400");
    if (id) ctx.response.headers.set("ETag", `"${id}"`);
  }

  static async sendImage(ctx: Context, image: Image) {
    const { width, height } = this.getResizeOptions(ctx);

    // If no resize parameters, send original
    if (!width && !height) {
      const imageBytes = this.decodeImageBase64(image.base64);
      this.setImageHeaders(ctx, imageBytes.length, image.id);
      ctx.response.body = imageBytes;
      return;
    }

    // Otherwise process the image
    await this.sendResizedImage(ctx as RouterContext<string>);
  }

  static async sendResizedImage(ctx: RouterContext<string>) {
    const id = ctx.params.id;
    const image = images.find((img) => img.id.toString() === id);

    if (!image) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Image not found" };
      return;
    }

    const { width, height, mode } = this.getResizeOptions(ctx);

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
      const imageBuffer = this.decodeImageBase64(image.base64);
      const processedImage = await ImageProcessingService.processImage(
        imageBuffer,
        { width, height, mode }
      );

      this.setImageHeaders(ctx, processedImage.length);
      ctx.response.body = processedImage;
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { message: "Error processing image" };
    }
  }
}
