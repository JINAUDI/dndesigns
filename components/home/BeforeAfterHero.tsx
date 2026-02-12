"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'

// Single slide configuration - update images here or integrate with folder system
const slideData = {
  beforeImage: '/assets/hero/hero-sketch.png',
  afterImage: '/assets/hero/hero.png',
  headline: 'Spaces',
  subtext: 'Designing spaces that inspire living with expert architectural solutions and interior excellence.',
  ctaText: 'View Projects',
  ctaLink: '/projects'
}

export default function BeforeAfterHero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const afterRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(50)
  const rafRef = useRef<number | null>(null)

  // GPU-accelerated position update using transforms
  const updateSliderPosition = useCallback((percentage: number) => {
    positionRef.current = percentage
    
    if (sliderRef.current) {
      sliderRef.current.style.left = `${percentage}%`
    }
    if (afterRef.current) {
      afterRef.current.style.clipPath = `inset(0 0 0 ${percentage}%)`
    }
  }, [])

  // Throttled move handler using requestAnimationFrame
  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current) return

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
      updateSliderPosition(percentage)
    })
  }, [isDragging, updateSliderPosition])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX)
  }, [handleMove])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }, [handleMove])

  const handleEnd = useCallback(() => {
    setIsDragging(false)
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const handleStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      window.addEventListener('mouseup', handleEnd, { passive: true })
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleEnd, { passive: true })
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd])

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
      updateSliderPosition(50)
    }, 100)
    return () => clearTimeout(timer)
  }, [updateSliderPosition])

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <section className="ba-hero" aria-label="Homepage hero">
      <div 
        ref={containerRef}
        className={`ba-hero__container ${isDragging ? 'is-dragging' : ''}`}
      >
        {/* Single slide - before/after comparison */}
        <div className="ba-hero__slide">
          {/* Before Image (Background - Sketch) */}
          <div className="ba-hero__before">
            <img
              src={slideData.beforeImage}
              alt="Before transformation - architectural sketch"
              className="ba-hero__image"
              draggable={false}
            />
            <div className="ba-hero__before-overlay" />
            
            <div className={`ba-hero__content ba-hero__content--before ${isLoaded ? 'is-visible' : ''}`}>
              <h1 className="ba-hero__headline ba-hero__headline--dark">
                {slideData.headline}
              </h1>
              <p className="ba-hero__subtext ba-hero__subtext--dark">
                {slideData.subtext}
              </p>
              <Link href={slideData.ctaLink} className="ba-hero__cta ba-hero__cta--dark">
                {slideData.ctaText}
              </Link>
            </div>
          </div>

          {/* After Image (Clipped - Realistic) */}
          <div 
            ref={afterRef}
            className="ba-hero__after"
            style={{ clipPath: 'inset(0 0 0 50%)' }}
          >
            <img
              src={slideData.afterImage}
              alt="After transformation - realistic render"
              className="ba-hero__image"
              draggable={false}
            />
            <div className="ba-hero__after-overlay" />
            
            <div className={`ba-hero__content ba-hero__content--after ${isLoaded ? 'is-visible' : ''}`}>
              <h1 className="ba-hero__headline ba-hero__headline--light">
                {slideData.headline}
              </h1>
              <p className="ba-hero__subtext ba-hero__subtext--light">
                {slideData.subtext}
              </p>
              <Link href={slideData.ctaLink} className="ba-hero__cta ba-hero__cta--light">
                {slideData.ctaText}
              </Link>
            </div>
          </div>
        </div>

        {/* Slider Handle - Draggable divider for before/after comparison */}
        <div 
          ref={sliderRef}
          className="ba-hero__slider"
          style={{ left: '50%' }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          role="slider"
          aria-label="Drag to compare before and after images"
          aria-valuenow={50}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
        >
          <div className="ba-hero__slider-line" />
          <div className="ba-hero__slider-handle">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5L3 12L8 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 5L21 12L16 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
