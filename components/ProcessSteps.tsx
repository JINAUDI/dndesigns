'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const steps = [
  {
    number: '01',
    title: 'Discovery & Dialogue',
    description: 'We commence with an immersive consultation to explore the nuances of your vision, lifestyle, and spatial aspirations. This foundational exchange enables us to conceive a design that authentically reflects your individuality and fulfils your deepest requirements.',
  },
  {
    number: '02',
    title: 'Site Appraisal & Analysis',
    description: 'Our team conducts an exhaustive site evaluation, meticulously assessing spatial dimensions, natural illumination, structural considerations, and contextual influences. Every observation is precisely documented to inform an impeccable design blueprint.',
  },
  {
    number: '03',
    title: 'Creative Conception',
    description: 'We develop comprehensive design narratives encompassing spatial compositions, photorealistic visualisations, material curation, and chromatic palettes. Multiple bespoke concepts are presented for your considered review and selection.',
  },
  {
    number: '04',
    title: 'Masterful Orchestration',
    description: 'We coordinate a symphony of distinguished contractors, premium suppliers, and master artisans to ensure seamless execution. Regular site inspections and transparent progress reports ensure you remain intimately informed throughout every phase.',
  },
  {
    number: '05',
    title: 'Artful Installation & Styling',
    description: 'Our team personally oversees the installation of every element with consummate precision and care. The final layer of curated styling and bespoke accessories completes the transformative experience.',
  },
  {
    number: '06',
    title: 'Perfection & Handover',
    description: 'We conduct a meticulous walkthrough to ensure every detail meets our uncompromising standards of excellence. Your considered feedback is thoughtfully addressed, and we provide expert guidance for the enduring care of your newly realised space.',
  },
]

export default function ProcessSteps() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              ref={index === 0 ? ref : undefined}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="mb-16 last:mb-0"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="text-6xl lg:text-7xl font-bold text-gray-200 leading-none">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="ml-8 md:ml-16 mt-8 mb-8">
                  <div className="w-px h-16 bg-gray-200" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

