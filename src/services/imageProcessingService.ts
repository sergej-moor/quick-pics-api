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

  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    targetWidth?: number,
    targetHeight?: number
  ): { width: number; height: number } {
    // If only width is provided, maintain aspect ratio
    if (targetWidth && !targetHeight) {
      const ratio = targetWidth / originalWidth;
      return {
        width: targetWidth,
        height: Math.round(originalHeight * ratio),
      };
    }
    // If only height is provided, maintain aspect ratio
    if (targetHeight && !targetWidth) {
      const ratio = targetHeight / originalHeight;
      return {
        width: Math.round(originalWidth * ratio),
        height: targetHeight,
      };
    }
    // If both dimensions are provided, use them directly
    return {
      width: targetWidth || originalWidth,
      height: targetHeight || originalHeight,
    };
  }

  static async processImage(
    imageBuffer: Uint8Array,
    options: ImageProcessingOptions
  ): Promise<Uint8Array> {
    const image = await ImageScript.decode(imageBuffer);

    if (options.mode === "resize") {
      const { width, height } = this.calculateDimensions(
        image.width,
        image.height,
        options.width,
        options.height
      );
      image.resize(width, height);
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
