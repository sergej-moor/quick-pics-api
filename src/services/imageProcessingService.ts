import { Image as ImageScript } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  mode: "resize" | "crop";
}

export class ImageProcessingService {
  private static readonly MAX_DIMENSION = 2048;

  static validateDimensions(width?: number, height?: number): string | null {
    if (!width && !height) {
      return "At least one dimension (width or height) must be specified";
    }
    if ((width && width < 0) || (height && height < 0)) {
      return "Dimensions cannot be negative";
    }
    if (
      (width && width > this.MAX_DIMENSION) ||
      (height && height > this.MAX_DIMENSION)
    ) {
      return `Dimensions cannot exceed ${this.MAX_DIMENSION}px`;
    }
    return null;
  }

  static async processImage(
    imageBuffer: Uint8Array,
    options: ImageProcessingOptions
  ): Promise<Uint8Array> {
    const image = await ImageScript.decode(imageBuffer);

    if (options.mode === "resize") {
      image.resize(
        options.width || image.width,
        options.height || image.height
      );
    } else {
      image.crop(
        0,
        0,
        options.width || image.width,
        options.height || image.height
      );
    }

    return await image.encode();
  }
}
