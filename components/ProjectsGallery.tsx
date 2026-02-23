'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Image from 'next/image'

const primaryCategories = ['All', 'Residential', 'Commercial']

const subCategoryData = [
  {
    name: 'Interior',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Thoughtfully designed indoor spaces',
  },
  {
    name: 'Elevation',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Striking architectural facades',
  },
  {
    name: 'Landscape',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Beautiful outdoor environments',
  },
]

// No static projects - only show real images from folders

interface DynamicProject {
  id: string
  src: string
  category: 'Residential' | 'Commercial'
  subCategory: 'Interior' | 'Elevation' | 'Landscape'
  fileName: string
}

interface Project {
  slug: string
  title: string
  category: string
  subCategory: string
  location?: string
  year?: string
  size?: string
  image: string
  description?: string
}

// Helper to format filename to title
const formatTitle = (name: string) => {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

export default function ProjectsGallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch dynamic projects from folders
  useEffect(() => {
    const fetchDynamicProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/projects?samples=false')
        if (!response.ok) return
        const data = await response.json()

        if (data.images && data.images.length > 0) {
          // Convert dynamic images to project format
          const dynamicProjects: Project[] = data.images.map((img: DynamicProject) => ({
            slug: img.id,
            title: formatTitle(img.fileName),
            category: img.category,
            subCategory: img.subCategory,
            image: img.src,
            description: `${img.category} ${img.subCategory} project`,
          }))

          // Only show real projects from folders
          setProjects(dynamicProjects)
        }
      } catch (error) {
        console.log('Error loading projects')
      } finally {
        setLoading(false)
      }
    }

    fetchDynamicProjects()
  }, [])

  const filteredProjects = projects.filter(p => {
    // If "All" is selected, show all projects (optionally filtered by sub-category)
    if (activeCategory === 'All') {
      if (activeSubCategory) {
        return p.subCategory === activeSubCategory
      }
      return true
    }
    // Filter by primary category
    if (p.category !== activeCategory) return false
    // If sub-category is selected, filter by it too
    if (activeSubCategory && p.subCategory !== activeSubCategory) return false
    return true
  })

  const handlePrimaryCategoryClick = (category: string) => {
    setActiveCategory(category)
    setActiveSubCategory(null) // Reset sub-category when primary changes
  }

  return (
    <section className="py-20 lg:py-32 bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Our Projects
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A curated anthology of distinguished design commissions
          </p>
        </motion.div>

        {/* Primary Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {primaryCategories.map((category) => (
            <button
              key={category}
              onClick={() => handlePrimaryCategoryClick(category)}
              className={`px-6 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${activeCategory === category
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sub-Category Image Cards */}
        {!activeSubCategory && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-center mb-8">
              {activeCategory === 'All' ? 'Browse by Type' : `${activeCategory} Projects`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subCategoryData.map((subCat, index) => (
                <SubCategoryCard
                  key={subCat.name}
                  subCategory={subCat}
                  index={index}
                  inView={inView}
                  onClick={() => setActiveSubCategory(subCat.name)}
                  activeCategory={activeCategory}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Sub-Category Header & Back Button */}
        {activeSubCategory && (
          <div className="mb-8">
            <button
              onClick={() => setActiveSubCategory(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Categories
            </button>
            <h2 className="text-2xl font-semibold">
              {activeCategory === 'All' ? activeSubCategory : `${activeCategory} ${activeSubCategory}`} Projects
            </h2>
          </div>
        )}

        {/* Projects Grid - Only shown when a subdivision is selected */}
        {activeSubCategory && (
          <>
            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading projects...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project, index) => (
                    <ProjectCard key={project.slug} project={project} index={index} inView={inView} />
                  ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg mb-2">No projects found in this category.</p>
                    <p className="text-gray-400 text-sm">
                      Add images to: <code className="bg-gray-100 px-2 py-1 rounded">public/projects/(residential|commercial)/{activeSubCategory?.toLowerCase()}/</code>
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project, index, inView }: { project: Project, index: number, inView: boolean }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="relative h-80 overflow-hidden bg-gray-100">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'
              }`}
          />
          <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isHovered ? 'opacity-40' : 'opacity-0'
            }`} />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300">
            <div className="text-xs uppercase tracking-wider mb-2 opacity-90">{project.category} • {project.subCategory}</div>
            <h3 className="text-xl font-semibold">{project.title}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function SubCategoryCard({
  subCategory,
  index,
  inView,
  onClick,
  activeCategory
}: {
  subCategory: typeof subCategoryData[0]
  index: number
  inView: boolean
  onClick: () => void
  activeCategory: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative h-80 overflow-hidden bg-gray-100">
        <Image
          src={subCategory.image}
          alt={subCategory.name}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'
            }`}
        />
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isHovered ? 'opacity-50' : 'opacity-30'
          }`} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
          <div className="text-xs uppercase tracking-wider mb-2 opacity-90">
            {activeCategory === 'All' ? 'All Projects' : activeCategory}
          </div>
          <h3 className="text-2xl font-semibold mb-2">{subCategory.name}</h3>
          <p className="text-sm opacity-80">{subCategory.description}</p>
          <div className={`mt-4 flex items-center gap-2 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''
            }`}>
            <span className="text-sm font-medium">View Projects</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

