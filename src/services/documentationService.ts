interface EndpointDoc {
  path: string;
  method: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  responses: {
    status: number;
    description: string;
    type: string;
  }[];
}

export class DocumentationService {
  static getApiDocs(): Record<string, EndpointDoc> {
    return {
      listImages: {
        path: "/list",
        method: "GET",
        description:
          "Returns a list of all available images with their metadata",
        responses: [
          {
            status: 200,
            description: "List of images",
            type: "Array<{ id: string, category: string, title: string }>",
          },
        ],
      },
      randomImage: {
        path: "/",
        method: "GET",
        description: "Returns a random image from the collection",
        parameters: [
          {
            name: "w",
            type: "number",
            required: false,
            description: "Desired width of the image",
          },
          {
            name: "h",
            type: "number",
            required: false,
            description: "Desired height of the image",
          },
          {
            name: "mode",
            type: "string",
            required: false,
            description: "Resize mode: 'resize' or 'crop'. Default: 'resize'",
          },
        ],
        responses: [
          {
            status: 200,
            description: "Random image",
            type: "image/jpeg",
          },
        ],
      },
      randomImageByCategory: {
        path: "/:category",
        method: "GET",
        description: "Returns a random image from the specified category",
        parameters: [
          {
            name: "category",
            type: "string",
            required: true,
            description: "Image category (3d, glass, water, painting, pouring)",
          },
          {
            name: "w",
            type: "number",
            required: false,
            description: "Desired width of the image",
          },
          {
            name: "h",
            type: "number",
            required: false,
            description: "Desired height of the image",
          },
          {
            name: "mode",
            type: "string",
            required: false,
            description: "Resize mode: 'resize' or 'crop'. Default: 'resize'",
          },
        ],
        responses: [
          {
            status: 200,
            description: "Random image from category",
            type: "image/jpeg",
          },
          {
            status: 404,
            description: "Category not found",
            type: "{ message: string }",
          },
          {
            status: 400,
            description: "Invalid category",
            type: "{ message: string }",
          },
        ],
      },
      imageById: {
        path: "/:id",
        method: "GET",
        description: "Returns a specific image by ID",
        parameters: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "Image ID",
          },
          {
            name: "w",
            type: "number",
            required: false,
            description: "Desired width of the image",
          },
          {
            name: "h",
            type: "number",
            required: false,
            description: "Desired height of the image",
          },
          {
            name: "mode",
            type: "string",
            required: false,
            description: "Resize mode: 'resize' or 'crop'. Default: 'resize'",
          },
        ],
        responses: [
          {
            status: 200,
            description: "Requested image",
            type: "image/jpeg",
          },
          {
            status: 404,
            description: "Image not found",
            type: "{ message: string }",
          },
        ],
      },
    };
  }
}
