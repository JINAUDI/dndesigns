'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ProjectCardProps {
  src: string
  category: string
  subCategory: string
  fileName: string
  index: number
  isSample?: boolean
}

export default function ProjectCard({ src, category, subCategory, fileName, index, isSample }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Format the filename for display (replace dashes/underscores with spaces, capitalize)
  const formatTitle = (name: string) => {
    return name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sample Badge */}
      {isSample && (
        <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded">
          Sample
        </div>
      )}

      {/* Image */}
      {!imageError ? (
        <Image
          src={src}
          alt={formatTitle(fileName)}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-400">Image not found</span>
        </div>
      )}

      {/* Gradient Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-0'
        } sm:group-hover:opacity-100`}
      />

      {/* Content Overlay */}
      <div 
        className={`absolute inset-0 flex flex-col justify-end p-4 sm:p-5 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } sm:group-hover:opacity-100 sm:group-hover:translate-y-0`}
      >
        {/* Category Tags */}
        <div className="flex gap-2 mb-2">
          <span className="px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded">
            {category}
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-amber-500/80 backdrop-blur-sm text-white rounded">
            {subCategory}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-white leading-tight">
          {formatTitle(fileName)}
        </h3>
      </div>

      {/* Corner Accent */}
      <div 
        className={`absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400 transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        } sm:group-hover:opacity-100 sm:group-hover:scale-100`}
      />
    </motion.div>
  )
}
