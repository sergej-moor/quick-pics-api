# Quick Pics Api

A RESTful API service built with Deno and Oak that provides dynamic image serving and processing capabilities.

## Features
- Placeholder image serving

## Categories

Images are organized into the following categories:
- 3D renders (`3d`)
- Glass art (`glass`)
- Water photography (`water`)
- Paintings (`painting`)
- Pouring art (`pouring`)

## API Endpoints

- `GET /list` - Get a list of all available images
- `GET /` - Get a random image
- `GET /:category` - Get a random image from a specific category
- `GET /:id` - Get a specific image by ID
- `GET /docs` - View API documentation

### Image Processing Parameters

All image endpoints support the following query parameters:
- `w` - Width in pixels (optional)
- `h` - Height in pixels (optional)
- `mode` - Resize mode (`resize` or `crop`) (optional)

Example: `https://quick-pics.deno.dev/glass?w=800&h=600&mode=crop`

![alt text](https://quick-pics.deno.dev/glass?w=800&h=600&mode=crop)

