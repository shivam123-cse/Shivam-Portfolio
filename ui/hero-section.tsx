// components/ui/hero-section.tsx
"use client"

import * as React from "react"
import { GradientButton } from "./gradient-button"

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 overflow-hidden">
      {/* Background Subtle Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-xs font-medium text-zinc-400 mb-6 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Powered by Next.js & AI
        </div>

        {/* Main Heading with Gradient Text */}
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-3xl leading-[1.1]">
          Build the Future of <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">
            Web Development
          </span>
        </h1>

        {/* Subtitle description */}
        <p className="text-zinc-400 text-base md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
          Create high-converting, ultra-premium websites using component-driven AI architectures. No legacy code, just pure performant design.
        </p>

        {/* Actions Container - Placing your buttons here! */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <GradientButton>Get Started</GradientButton>
          <GradientButton variant="variant">Explore Features</GradientButton>
        </div>
      </div>
    </section>
  )
}