export interface Image {
  id: string;
  category: ImageCategory;
  title: string;
  base64: string;
}

export enum ImageCategory {
  THREE_D = "3d",
  GLASS = "glass",
  WATER = "water",
  PAINTING = "painting",
  POURING = "pouring",
}
