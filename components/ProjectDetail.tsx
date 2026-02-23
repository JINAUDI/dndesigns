'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

// Helper to format filename to title
const formatTitle = (name: string) => {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

// Location data for categories
const locationData: Record<string, { location: string; year: string; size: string }> = {
  'Residential': { location: 'India', year: '2024', size: '3,500 sq ft' },
  'Commercial': { location: 'India', year: '2024', size: '5,000 sq ft' },
}

// Description templates by category + subCategory
const descriptionTemplates: Record<string, string> = {
  'Residential-Interior': 'An exquisitely crafted residential interior that marries contemporary sophistication with the warmth of purposeful living. The design philosophy centres upon the interplay of natural luminance, premium materiality, and considered spatial orchestration — yielding a home of remarkable elegance and comfort.',
  'Residential-Elevation': 'A commanding residential elevation that showcases the pinnacle of contemporary architectural expression. The facade presents a masterful composition of clean geometries, harmonious proportions, and distinguished material selections that establish a striking and enduring presence.',
  'Residential-Landscape': 'A meticulously envisioned residential landscape that extends the art of living into the open air. The grounds feature lavish verdure, refined hardscaping, and tranquil water elements that together compose a serene private sanctuary.',
  'Commercial-Interior': 'A distinguished commercial interior conceived to amplify productivity and elevate the patron experience. The space features curated furnishings, strategic illumination, and an articulate layout that mirrors brand identity whilst ensuring optimal functional excellence.',
  'Commercial-Elevation': 'A monumental commercial elevation that commands attention through bold architectural conviction. The building facade synthesises contemporary materiality with timeless design tenets to establish an unmistakable landmark presence.',
  'Commercial-Landscape': 'A fastidiously planned commercial landscape that augments the property\'s distinction and operational character. The outdoor realm features inviting promenades, professionally curated plantings, and gathering spaces that complement the architectural narrative.',
}

// Hardcoded project data for legacy slugs
const projectData: Record<string, {
  title: string
  category: string
  location: string
  year: string
  size: string
  description: string
  heroImage: string
  gallery: string[]
}> = {
  'luxury-residence-mumbai': {
    title: 'Luxury Residence, Mumbai',
    category: 'Residential',
    location: 'Mumbai, India',
    year: '2024',
    size: '4,500 sq ft',
    description: 'A stunning modern residence featuring open-plan living spaces, premium finishes, and seamless indoor-outdoor connectivity. The design emphasizes natural light, clean lines, and sophisticated material choices.',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'modern-office-delhi': {
    title: 'Modern Office Space, Delhi',
    category: 'Commercial',
    location: 'Delhi, India',
    year: '2024',
    size: '8,000 sq ft',
    description: 'Contemporary office design promoting collaboration and productivity. The space features flexible work zones, modern amenities, and a vibrant aesthetic that reflects the company culture.',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366754035-f200168a620e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200168a620e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'boutique-hotel-goa': {
    title: 'Boutique Hotel, Goa',
    category: 'Hotels',
    location: 'Goa, India',
    year: '2023',
    size: '15,000 sq ft',
    description: 'A luxurious boutique hotel with coastal-inspired interiors. The design blends local craftsmanship with modern luxury, creating a serene and sophisticated atmosphere.',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'fine-dining-restaurant': {
    title: 'Fine Dining Restaurant',
    category: 'Restaurant & Bar',
    location: 'Bangalore, India',
    year: '2023',
    size: '3,500 sq ft',
    description: 'Elegant restaurant design creating an intimate dining experience. The space features sophisticated lighting, premium materials, and a warm, inviting atmosphere.',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'penthouse-apartment': {
    title: 'Penthouse Apartment',
    category: 'Residential',
    location: 'Mumbai, India',
    year: '2023',
    size: '3,200 sq ft',
    description: 'Sophisticated penthouse with panoramic city views. The design features luxury finishes, open-plan living, and seamless integration of indoor and outdoor spaces.',
    heroImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'retail-store': {
    title: 'Premium Retail Store',
    category: 'Commercial',
    location: 'Delhi, India',
    year: '2023',
    size: '2,500 sq ft',
    description: 'Modern retail space designed to showcase products beautifully. The design creates an engaging shopping experience with strategic lighting and layout.',
    heroImage: 'https://images.unsplash.com/photo-1555529908-3ba0359ef759?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555529908-3ba0359ef759?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'resort-spa': {
    title: 'Resort & Spa',
    category: 'Hotels',
    location: 'Kerala, India',
    year: '2022',
    size: '25,000 sq ft',
    description: 'Tranquil resort design blending nature with luxury. The space features organic materials, natural lighting, and serene environments for relaxation and rejuvenation.',
    heroImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'rooftop-bar': {
    title: 'Rooftop Bar',
    category: 'Restaurant & Bar',
    location: 'Mumbai, India',
    year: '2022',
    size: '2,000 sq ft',
    description: 'Vibrant rooftop bar with stunning city skyline views. The design features modern furnishings, ambient lighting, and an energetic atmosphere perfect for socializing.',
    heroImage: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
}

interface DynamicImage {
  id: string
  src: string
  category: string
  subCategory: string
  fileName: string
}

interface ProjectInfo {
  title: string
  category: string
  subCategory?: string
  location: string
  year: string
  size: string
  description: string
  heroImage: string
  gallery: string[]
}

export default function ProjectDetail({ slug }: { slug: string }) {
  const [project, setProject] = useState<ProjectInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    // First check hardcoded data
    if (projectData[slug]) {
      setProject(projectData[slug])
      setLoading(false)
      return
    }

    // Otherwise fetch from API and find the matching project
    const fetchProject = async () => {
      try {
        const response = await fetch('/api/projects?samples=false')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()

        if (data.images && data.images.length > 0) {
          const match = data.images.find((img: DynamicImage) => img.id === slug)
          if (match) {
            // Find related images in the same category + subcategory for gallery
            const related = data.images.filter(
              (img: DynamicImage) =>
                img.category === match.category &&
                img.subCategory === match.subCategory &&
                img.id !== match.id
            )

            const categoryInfo = locationData[match.category] || { location: 'India', year: '2024', size: '3,000 sq ft' }
            const descKey = `${match.category}-${match.subCategory}`
            const description = descriptionTemplates[descKey] || `A professionally designed ${match.category.toLowerCase()} ${match.subCategory.toLowerCase()} project showcasing our commitment to excellence in design.`

            setProject({
              title: formatTitle(match.fileName),
              category: match.category,
              subCategory: match.subCategory,
              location: categoryInfo.location,
              year: categoryInfo.year,
              size: categoryInfo.size,
              description,
              heroImage: match.src,
              gallery: related.slice(0, 5).map((img: DynamicImage) => img.src),
            })
          }
        }
      } catch (error) {
        console.error('Error loading project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-8">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/projects"
            className="inline-block px-8 py-3 bg-black text-white font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            View All Projects
          </Link>
        </div>
      </div>
    )
  }

  const allImages = [project.heroImage, ...project.gallery]

  return (
    <div className="pt-20">
      {/* Hero Image */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src={allImages[selectedImage]}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16 text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-sm uppercase tracking-wider mb-2">
              {project.category}{project.subCategory ? ` • ${project.subCategory}` : ''}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{project.title}</h1>
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">{project.description}</p>
              <p className="text-gray-600 leading-relaxed">
                This commission exemplifies our unwavering dedication to creating spaces of extraordinary
                beauty and consummate functionality. Every element was thoughtfully curated to ensure the
                final realisation transcends expectations whilst remaining faithfully aligned with the
                client&apos;s singular vision.
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">Location</div>
                <div className="text-lg font-semibold">{project.location}</div>
              </div>
              <div>
                <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">Year</div>
                <div className="text-lg font-semibold">{project.year}</div>
              </div>
              <div>
                <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">Size</div>
                <div className="text-lg font-semibold">{project.size}</div>
              </div>
              <div>
                <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">Category</div>
                <div className="text-lg font-semibold">
                  {project.category}{project.subCategory ? ` — ${project.subCategory}` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {allImages.length > 1 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative h-64 cursor-pointer overflow-hidden group ${selectedImage === index ? 'ring-4 ring-black' : ''
                    }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Projects */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Link
            href="/projects"
            className="inline-block text-sm font-medium uppercase tracking-wider border-b-2 border-black hover:border-gray-600 transition-colors"
          >
            ← Back to Projects
          </Link>
        </div>
      </section>
    </div>
  )
}
