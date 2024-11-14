import { assertEquals, describe, it } from "../test_deps.ts";
import { validateQueryParams } from "../../middleware/validationMiddleware.ts";

describe("ValidationMiddleware", () => {
  it("should validate numeric parameters", async () => {
    const ctx = {
      request: {
        url: new URL("/?h=invalid", "http://test"),
      },
      response: {},
    } as any;

    await validateQueryParams(ctx, async () => {});
    assertEquals(ctx.response.status, 400);
    assertEquals(
      ctx.response.body.message,
      "Invalid h parameter. Must be a positive number."
    );
  });

  it("should validate mode parameter", async () => {
    const ctx = {
      request: {
        url: new URL("/?mode=invalid", "http://test"),
      },
      response: {},
    } as any;

    await validateQueryParams(ctx, async () => {});
    assertEquals(ctx.response.status, 400);
    assertEquals(
      ctx.response.body.message,
      "Mode must be either 'resize' or 'crop'"
    );
  });
});
