import { Context } from "https://deno.land/x/oak/mod.ts";
import { imageStore } from "../data/images.ts";
import { ImageCategory } from "../types/types.ts";

export class ImageController {
  static async getAll(ctx: Context) {
    ctx.response.body = Array.from(imageStore.values());
  }

  static async getByCategory(ctx: Context) {
    const category = ctx.params.category as ImageCategory;
    const images = Array.from(imageStore.values()).filter(
      (img) => img.category === category
    );
    ctx.response.body = images;
  }

  static async getById(ctx: Context) {
    const id = ctx.params.id;
    const image = imageStore.get(id);

    if (!image) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Image not found" };
      return;
    }

    ctx.response.body = image;
  }

  static async create(ctx: Context) {
    try {
      const body = await ctx.request.body().value;
      const id = crypto.randomUUID();

      const image = {
        id,
        ...body,
        createdAt: new Date(),
      };

      imageStore.set(id, image);

      ctx.response.status = 201;
      ctx.response.body = image;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }
}
