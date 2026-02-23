import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export interface ProjectImage {
  id: string
  src: string
  category: 'Residential' | 'Commercial'
  subCategory: 'Interior' | 'Elevation' | 'Landscape'
  fileName: string
  isSample?: boolean
}

const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

// Sample images to show when folders are empty (for demo purposes)
const SAMPLE_IMAGES: ProjectImage[] = [
  {
    id: 'sample-res-int-1',
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    category: 'Residential',
    subCategory: 'Interior',
    fileName: 'Modern Living Room',
    isSample: true,
  },
  {
    id: 'sample-res-int-2',
    src: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80',
    category: 'Residential',
    subCategory: 'Interior',
    fileName: 'Luxury Bedroom',
    isSample: true,
  },
  {
    id: 'sample-res-elev-1',
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    category: 'Residential',
    subCategory: 'Elevation',
    fileName: 'Modern Villa Facade',
    isSample: true,
  },
  {
    id: 'sample-res-elev-2',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    category: 'Residential',
    subCategory: 'Elevation',
    fileName: 'Contemporary Home',
    isSample: true,
  },
  {
    id: 'sample-res-land-1',
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Residential',
    subCategory: 'Landscape',
    fileName: 'Garden Design',
    isSample: true,
  },
  {
    id: 'sample-com-int-1',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    category: 'Commercial',
    subCategory: 'Interior',
    fileName: 'Modern Office Space',
    isSample: true,
  },
  {
    id: 'sample-com-int-2',
    src: 'https://images.unsplash.com/photo-1555529908-3ba0359ef759?w=800&q=80',
    category: 'Commercial',
    subCategory: 'Interior',
    fileName: 'Retail Store Design',
    isSample: true,
  },
  {
    id: 'sample-com-elev-1',
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    category: 'Commercial',
    subCategory: 'Elevation',
    fileName: 'Corporate Tower',
    isSample: true,
  },
  {
    id: 'sample-com-land-1',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    category: 'Commercial',
    subCategory: 'Landscape',
    fileName: 'Corporate Campus',
    isSample: true,
  },
]

function scanDirectory(dirPath: string, category: string, subCategory: string): ProjectImage[] {
  const images: ProjectImage[] = []
  
  if (!fs.existsSync(dirPath)) {
    return images
  }
  
  const files = fs.readdirSync(dirPath)
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (VALID_EXTENSIONS.includes(ext)) {
      const fileName = path.basename(file, ext)
      images.push({
        id: `${category}-${subCategory}-${fileName}`.toLowerCase().replace(/\s+/g, '-'),
        src: `/projects/${category.toLowerCase()}/${subCategory.toLowerCase()}/${file}`,
        category: category as 'Residential' | 'Commercial',
        subCategory: subCategory as 'Interior' | 'Elevation' | 'Landscape',
        fileName: fileName,
      })
    }
  }
  
  return images
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const includeSamples = searchParams.get('samples') !== 'false'
  
  const projectsDir = path.join(process.cwd(), 'public', 'projects')
  const allImages: ProjectImage[] = []
  
  const categories = ['residential', 'commercial']
  const subCategories = ['interior', 'elevation', 'landscape']
  
  for (const category of categories) {
    for (const subCategory of subCategories) {
      const dirPath = path.join(projectsDir, category, subCategory)
      const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1)
      const capitalizedSubCategory = subCategory.charAt(0).toUpperCase() + subCategory.slice(1)
      
      const images = scanDirectory(dirPath, capitalizedCategory, capitalizedSubCategory)
      allImages.push(...images)
    }
  }
  
  // If no real images found and samples are requested, include sample images
  const finalImages = allImages.length === 0 && includeSamples 
    ? SAMPLE_IMAGES 
    : allImages
  
  // Sort by filename for consistent ordering
  finalImages.sort((a, b) => a.fileName.localeCompare(b.fileName))
  
  return NextResponse.json({
    images: finalImages,
    total: finalImages.length,
    hasRealImages: allImages.length > 0,
    categories: {
      residential: finalImages.filter(img => img.category === 'Residential').length,
      commercial: finalImages.filter(img => img.category === 'Commercial').length,
    },
    subCategories: {
      interior: finalImages.filter(img => img.subCategory === 'Interior').length,
      elevation: finalImages.filter(img => img.subCategory === 'Elevation').length,
      landscape: finalImages.filter(img => img.subCategory === 'Landscape').length,
    }
  })
}
