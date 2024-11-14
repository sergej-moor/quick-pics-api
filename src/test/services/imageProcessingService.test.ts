import { assertEquals, describe, it } from "../test_deps.ts";
import { ImageProcessingService } from "../../services/imageProcessingService.ts";

describe("ImageProcessingService", () => {
  describe("validateDimensions", () => {
    it("should return error when no dimensions provided", () => {
      const result = ImageProcessingService.validateDimensions();
      assertEquals(
        result,
        "At least one dimension (width or height) must be specified"
      );
    });

    it("should return error when dimensions exceed max", () => {
      const result = ImageProcessingService.validateDimensions(3000, 1000);
      assertEquals(result, "Dimensions cannot exceed 2048px");
    });

    it("should return null for valid dimensions", () => {
      const result = ImageProcessingService.validateDimensions(800, 600);
      assertEquals(result, null);
    });
  });

  describe("calculateDimensions", () => {
    it("should maintain aspect ratio when only width provided", async () => {
      const result = await ImageProcessingService["calculateDimensions"](
        1000,
        500,
        500,
        undefined
      );
      assertEquals(result, { width: 500, height: 250 });
    });
  });
});
