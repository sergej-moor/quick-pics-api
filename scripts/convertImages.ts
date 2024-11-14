import { walk } from "https://deno.land/std/fs/mod.ts";
import { encodeBase64 } from "https://deno.land/std/encoding/base64.ts";
import { ImageCategory } from "../src/types/types.ts";

// Helper function to map directory names to enum keys
function mapCategoryToEnumKey(category: string): string {
  const categoryMap: Record<string, string> = {
    "3d": "THREE_D",
    glass: "GLASS",
    water: "WATER",
    painting: "PAINTING",
    pouring: "POURING",
  };
  return categoryMap[category];
}

async function convertImagesToBase64() {
  const images: Record<string, any>[] = [];
  const publicDir = "./public";
  let id = 1;

  for await (const entry of walk(publicDir, { exts: [".jpg", ".jpeg"] })) {
    if (entry.isFile) {
      const imageData = await Deno.readFile(entry.path);
      const base64 = encodeBase64(imageData);

      const pathParts = entry.path.split("\\");
      const category = pathParts[pathParts.length - 2];
      const title = entry.name.split(".")[0];

      images.push({
        id: String(id++),
        category: mapCategoryToEnumKey(category),
        title,
        base64: `data:image/jpeg;base64,${base64}`,
      });

      console.log(`Converted: ${category} ${entry.name}`);
    }
  }

  // Generate TypeScript file with explicit enum references
  const tsContent = `
// This file is auto-generated. Do not edit manually.
import { Image, ImageCategory } from '../types/types.ts';

export const images: Image[] = [
${images
  .map(
    (img) => `  {
    id: "${img.id}",
    category: ImageCategory.${img.category},
    title: "${img.title}",
    base64: "${img.base64}"
  }`
  )
  .join(",\n")}
];
`;

  await Deno.writeTextFile("./src/data/imageData.ts", tsContent);
  console.log("Image conversion complete!");
}

await convertImagesToBase64();
