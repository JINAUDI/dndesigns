# Dynamic Projects Gallery

A folder-based project gallery system that automatically loads images from your folder structure.

## How It Works

Simply drop images into the appropriate folders and they'll automatically appear in the Projects gallery on page reload.

## Folder Structure

```
public/
└── projects/
    ├── residential/
    │   ├── interior/      ← Drop residential interior images here
    │   ├── elevation/     ← Drop residential elevation images here
    │   └── landscape/     ← Drop residential landscape images here
    └── commercial/
        ├── interior/      ← Drop commercial interior images here
        ├── elevation/     ← Drop commercial elevation images here
        └── landscape/     ← Drop commercial landscape images here
```

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`

## Naming Convention

The filename (without extension) becomes the project title displayed in the gallery:
- `modern-living-room.jpg` → "Modern Living Room"
- `luxury_bedroom.png` → "Luxury Bedroom"
- `CorpTower.webp` → "CorpTower"

**Tip:** Use hyphens `-` or underscores `_` to separate words in filenames for better display.

## Features

### Automatic Category Detection
Images are automatically categorized based on their folder location:
- **Category**: Residential or Commercial (from parent folder)
- **Subcategory**: Interior, Elevation, or Landscape (from direct folder)

### Filtering
The gallery includes:
- **Primary tabs**: All | Residential | Commercial
- **Subcategory filters**: All Types | Interior | Elevation | Landscape

### Sample Images
When no images are in the folders, sample images from Unsplash are displayed as placeholders. Once you add your own images, the samples are automatically replaced.

## API Endpoint

The gallery fetches images from `/api/projects` which scans the folder structure server-side.

### Response Format
```json
{
  "images": [
    {
      "id": "residential-interior-modern-living-room",
      "src": "/projects/residential/interior/modern-living-room.jpg",
      "category": "Residential",
      "subCategory": "Interior",
      "fileName": "modern-living-room"
    }
  ],
  "total": 1,
  "hasRealImages": true,
  "categories": { "residential": 1, "commercial": 0 },
  "subCategories": { "interior": 1, "elevation": 0, "landscape": 0 }
}
```

### Query Parameters
- `?samples=false` - Disable sample images when folders are empty

## Quick Start

1. Navigate to `public/projects/`
2. Choose the appropriate category and subcategory folder
3. Paste your images
4. Refresh the website - images appear automatically!

## Components

| Component | Path | Description |
|-----------|------|-------------|
| `DynamicProjectsGallery` | `components/DynamicProjectsGallery.tsx` | Main gallery with filters |
| `ProjectCard` | `components/ProjectCard.tsx` | Individual project card |
| `API Route` | `app/api/projects/route.ts` | Server-side folder scanner |
