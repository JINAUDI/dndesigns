'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

export default function StoryContent() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Atelier</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              DND (Drishti Nimawat Designs) was established with an unwavering conviction: that
              thoughtfully conceived spaces possess the power to transform lives. We transcend the
              conventional boundaries of design to curate environments that inspire the soul, nurture
              the spirit, and fundamentally elevate the human experience of living and working.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our distinguished collective of visionary designers and architects brings to bear
              decades of refined expertise across residential and commercial spheres, seamlessly
              uniting avant-garde thinking with an uncompromising devotion to the subtlest of details.
              Each commission we undertake represents a bespoke journey, artfully tailored to honour
              our clients' most discerning tastes, aspirations, and philosophies.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From the genesis of an idea through to its triumphant realisation, we engage in a
              deeply collaborative partnership with every client, ensuring that each element of the
              design resonates with their vision whilst upholding the most exacting standards of
              craft, quality, and enduring functionality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-96 lg:h-[500px] mb-16"
          >
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="DND Design Team"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Philosophy</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              To conceive exquisite, purposeful, and enduring spaces that enrich lives and inspire
              communities. We are devoted to the pursuit of excellence in every endeavour, regardless
              of scale, and to cultivating lasting relationships with our clientele founded upon
              trust, transparency, and an unwavering commitment to extraordinary service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our methodology is inherently collaborative and client-centred. We listen with intent
              to comprehend your deepest aspirations, explore inventive solutions with intellectual
              rigour, and deliver designs that consistently surpass expectations whilst remaining
              faithfully aligned with your vision and investment.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

