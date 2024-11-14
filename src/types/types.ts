export interface Image {
  id: string;
  category: ImageCategory;
  title: string;
  base64: string;
}

export enum ImageCategory {
  ABSTRACT = "abstract",
  NATURE = "nature",
  PEOPLE = "people",
}
