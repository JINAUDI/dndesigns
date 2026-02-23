'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { ScrollReveal } from './Scroll'


const features = [
  {
    id: 1,
    category: 'Residential',
    title: 'Residential Design',
    description: 'Bespoke residential compositions that harmonise refined aesthetics with purposeful living, crafting sanctuaries of enduring elegance.',
    image: '/assets/features/residential-design.jpg',
  },
  {
    id: 2,
    category: 'Commercial',
    title: 'Commercial Spaces',
    description: 'Distinguished commercial environments engineered to amplify productivity and patron engagement, while articulating your brand\'s singular narrative.',
    image: '/assets/features/commercial-spaces.jpg',
  },
  {
    id: 3,
    category: 'Interior',
    title: 'Interior Design',
    description: 'Comprehensive interior transformations orchestrated from initial concept through flawless execution, ensuring every nuance embodies your distinctive sensibility.',
    image: '/assets/features/interior-design.jpg',
  },
  {
    id: 4,
    category: 'Architectural',
    title: 'Architectural Services',
    description: 'Visionary architectural planning and design expertise for landmark constructions and transformative renovations of lasting distinction.',
    image: '/assets/features/architectural-services.jpg',
  },
  {
    id: 5,
    category: 'Residential',
    title: 'Kitchen Design',
    description: 'Exquisitely conceived culinary spaces that serve as the heart of the home, where impeccable craftsmanship meets intuitive functionality.',
    image: '/assets/features/kitchen-design.jpg',
  },
  {
    id: 6,
    category: 'Interior',
    title: 'Living Room Design',
    description: 'Inviting living environments that achieve a masterful equilibrium of comfort, sophistication, and effortless functionality for both daily life and distinguished entertaining.',
    image: '/assets/features/living-room-design.jpg',
  },
  {
    id: 7,
    category: 'Interior',
    title: 'Bathroom Design',
    description: 'Sumptuous bathroom retreats that elevate daily rituals into indulgent, spa-inspired experiences through the finest materials and finishes.',
    image: '/assets/features/bathroom-design.jpg',
  },
  {
    id: 8,
    category: 'Commercial',
    title: 'Restaurant & Bar',
    description: 'Captivating hospitality environments that curate unforgettable dining and social experiences, fostering lasting patron engagement and brand distinction.',
    image: '/assets/features/restaurant-and-bar.jpg',
  },
]

export default function Features() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="features" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <ScrollReveal as="h2" duration={0.7} distance={32} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Explore Features
          </ScrollReveal>
          <ScrollReveal as="p" delay={0.1} duration={0.7} distance={24} className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unveil our distinguished suite of design disciplines, each meticulously refined to elevate your vision
          </ScrollReveal>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Image
          src={feature.image}
          alt={feature.title}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'
            }`}
        />
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isHovered ? 'opacity-30' : 'opacity-0'
          }`} />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  )
}

