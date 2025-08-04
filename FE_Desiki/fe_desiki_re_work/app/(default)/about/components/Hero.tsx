import React from 'react'
import { ChevronDownIcon } from 'lucide-react'
interface HeroProps {
  scrollToNextSection: () => void
}
const Hero = ({ scrollToNextSection }: HeroProps) => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Skincare products on marble surface"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative z-10 text-center max-w-3xl px-6">
        <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
          Our Story
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
          Desiki was born from a simple belief: skincare should be effective,
          sustainable, and a moment of daily luxury.
        </p>
        <button
          onClick={scrollToNextSection}
          className="flex items-center mx-auto text-gray-500 hover:text-black transition-colors"
        >
          Discover more{' '}
          <ChevronDownIcon className="ml-2 w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  )
}
export default Hero
