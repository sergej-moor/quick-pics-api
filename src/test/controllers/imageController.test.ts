import { assertEquals, describe, it } from "../test_deps.ts";
import { ImageController } from "../../controllers/imageController.ts";
import { Image, ImageCategory } from "../../types/types.ts";

describe("ImageController", () => {
  const mockImage: Image = {
    id: "1",
    category: ImageCategory.GLASS,
    title: "test",
    base64: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
  };

  it("should set correct headers when sending image", async () => {
    const ctx = {
      request: {
        url: new URL("/image", "http://test"),
      },
      response: {
        headers: new Map(),
      },
    } as any;

    await ImageController.sendImage(ctx, mockImage);
    assertEquals(ctx.response.headers.get("Content-Type"), "image/jpeg");
    assertEquals(
      ctx.response.headers.get("Cache-Control"),
      "public, max-age=86400"
    );
  });
});
