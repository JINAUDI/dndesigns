'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from './ProjectCard'

interface ProjectImage {
  id: string
  src: string
  category: 'Residential' | 'Commercial'
  subCategory: 'Interior' | 'Elevation' | 'Landscape'
  fileName: string
  isSample?: boolean
}

interface ProjectsResponse {
  images: ProjectImage[]
  total: number
  hasRealImages: boolean
  categories: { residential: number; commercial: number }
  subCategories: { interior: number; elevation: number; landscape: number }
}

const primaryCategories = ['All', 'Residential', 'Commercial'] as const
const subCategories = ['Interior', 'Elevation', 'Landscape'] as const

export default function DynamicProjectsGallery() {
  const [projects, setProjects] = useState<ProjectImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [hasRealImages, setHasRealImages] = useState(true)
  const [counts, setCounts] = useState<ProjectsResponse['categories'] & ProjectsResponse['subCategories'] | null>(null)

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data: ProjectsResponse = await response.json()
        setProjects(data.images)
        setHasRealImages(data.hasRealImages)
        setCounts({ ...data.categories, ...data.subCategories })
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects based on active category and subcategory
  const filteredProjects = projects.filter(project => {
    if (activeCategory !== 'All' && project.category !== activeCategory) return false
    if (activeSubCategory && project.subCategory !== activeSubCategory) return false
    return true
  })

  // Get counts for current category filter
  const getSubCategoryCount = (subCat: string) => {
    return projects.filter(p => {
      if (activeCategory !== 'All' && p.category !== activeCategory) return false
      return p.subCategory === subCat
    }).length
  }

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return projects.length
    return projects.filter(p => p.category === cat).length
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    setActiveSubCategory(null)
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gray-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative container mx-auto px-4 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-6"
          >
            Our Portfolio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Featured Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Explore our collection of architectural masterpieces across residential and commercial spaces
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Sample Images Banner */}
        {!loading && !hasRealImages && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">📸</span>
              <div>
                <p className="text-amber-800 font-medium">Showing Sample Images</p>
                <p className="text-amber-700 text-sm mt-1">
                  These are placeholder images. Add your own images to the project folders to replace them:
                </p>
                <code className="text-xs text-amber-600 mt-2 block bg-amber-100 p-2 rounded">
                  public/projects/residential/(interior|elevation|landscape)/<br/>
                  public/projects/commercial/(interior|elevation|landscape)/
                </code>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {primaryCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/25'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeCategory === category ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {getCategoryCount(category)}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Subcategory Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <button
            onClick={() => setActiveSubCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeSubCategory === null
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Types
          </button>
          {subCategories.map((subCat) => (
            <button
              key={subCat}
              onClick={() => setActiveSubCategory(subCat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeSubCategory === subCat
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {subCat}
              <span className="ml-1.5 opacity-60">({getSubCategoryCount(subCat)})</span>
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-600 mb-2">Failed to load projects</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {projects.length === 0 
                ? "Add images to the project folders to see them here automatically."
                : "No projects match your current filters. Try selecting different categories."}
            </p>
            {projects.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-lg mx-auto text-left">
                <p className="text-amber-800 text-sm font-medium mb-2">📁 Add images to:</p>
                <code className="text-xs text-amber-700 block">
                  public/projects/residential/interior/<br/>
                  public/projects/residential/elevation/<br/>
                  public/projects/residential/landscape/<br/>
                  public/projects/commercial/interior/<br/>
                  public/projects/commercial/elevation/<br/>
                  public/projects/commercial/landscape/
                </code>
              </div>
            )}
          </motion.div>
        )}

        {/* Projects Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  src={project.src}
                  category={project.category}
                  subCategory={project.subCategory}
                  fileName={project.fileName}
                  index={index}
                  isSample={project.isSample}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Results Count */}
        {!loading && !error && filteredProjects.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 text-sm mt-8"
          >
            Showing {filteredProjects.length} of {projects.length} projects
          </motion.p>
        )}
      </div>
    </section>
  )
}
