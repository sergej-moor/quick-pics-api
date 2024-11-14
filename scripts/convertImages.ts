import { walk } from "https://deno.land/std/fs/mod.ts";
import { encodeBase64 } from "https://deno.land/std/encoding/base64.ts";

async function convertImagesToBase64() {
  const images: Record<string, any>[] = [];
  const publicDir = "./public";

  for await (const entry of walk(publicDir, { exts: [".jpg", ".jpeg"] })) {
    if (entry.isFile) {
      // Read image file
      const imageData = await Deno.readFile(entry.path);
      // Convert to base64 using the standard library encoder
      const base64 = encodeBase64(imageData);

      // Get category from path
      const pathParts = entry.path.split("\\");
      console.log(pathParts);
      const category = pathParts[pathParts.length - 2];

      // Get filename without extension
      const title = entry.name.split(".")[0];

      images.push({
        id: crypto.randomUUID(),
        category,
        title,
        base64: `data:image/jpeg;base64,${base64}`,
      });

      console.log(`Converted:${category} ${entry.name}`);
    }
  }

  // Generate TypeScript file
  const tsContent = `
// This file is auto-generated. Do not edit manually.
import { Image, ImageCategory } from '../types/types.ts';

export const images: Image[] = ${JSON.stringify(images, null, 2)};
`;

  await Deno.writeTextFile("./src/data/imageData.ts", tsContent);
  console.log("Image conversion complete!");
}

await convertImagesToBase64();
