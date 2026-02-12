'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Image from 'next/image'
import { ScrollReveal } from './Scroll'

interface Project {
  slug: string
  title: string
  category: string
  subCategory?: string
  image: string
}

interface DynamicImage {
  id: string
  src: string
  category: string
  subCategory: string
  fileName: string
}

// Helper to format filename to title
const formatTitle = (name: string) => {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

export default function ProjectsPreview() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch projects from folder system
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects?samples=false')
        if (!response.ok) return
        const data = await response.json()
        
        if (data.images && data.images.length > 0) {
          // Convert to project format and take first 4 for homepage preview
          const dynamicProjects: Project[] = data.images.map((img: DynamicImage) => ({
            slug: img.id,
            title: formatTitle(img.fileName),
            category: img.category,
            subCategory: img.subCategory,
            image: img.src,
          }))
          
          // Show up to 4 projects on homepage (mix of residential and commercial)
          const residential = dynamicProjects.filter(p => p.category === 'Residential')
          const commercial = dynamicProjects.filter(p => p.category === 'Commercial')
          
          // Alternate between categories for variety
          const featured: Project[] = []
          const maxCount = 4
          for (let i = 0; featured.length < maxCount; i++) {
            if (residential[i]) featured.push(residential[i])
            if (featured.length < maxCount && commercial[i]) featured.push(commercial[i])
            if (!residential[i] && !commercial[i]) break
          }
          
          setProjects(featured.slice(0, 4))
        }
      } catch (error) {
        console.log('Error loading projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <ScrollReveal as="h2" duration={0.7} distance={32} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Featured Projects
          </ScrollReveal>
          <ScrollReveal as="p" delay={0.1} duration={0.7} distance={24} className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Explore our portfolio of exceptional design projects
          </ScrollReveal>
          <ScrollReveal delay={0.2} duration={0.7} distance={20}>
            <Link
              href="/projects"
              className="inline-block text-sm font-medium uppercase tracking-wider border-b-2 border-black hover:border-gray-600 transition-colors"
            >
              View All Projects
            </Link>
          </ScrollReveal>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Add images to the projects folder to display them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} inView={inView} />
            ))}
          </div>
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
      <Link href="/projects">
        <div className="relative h-96 overflow-hidden bg-gray-100">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isHovered ? 'opacity-40' : 'opacity-0'
          }`} />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-300">
            <div className="text-sm uppercase tracking-wider mb-2 opacity-90">{project.category}{project.subCategory ? ` • ${project.subCategory}` : ''}</div>
            <h3 className="text-2xl font-semibold">{project.title}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
