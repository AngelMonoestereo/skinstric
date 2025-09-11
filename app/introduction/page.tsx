'use client'
import { FiChevronRight } from 'react-icons/fi'

export default function IntroductionPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Top bar */}
      <div className="flex items-center justify-between py-6 px-8 text-xs tracking-widest">
        <div className="flex items-center gap-3">
          <span className="font-medium">SKINSTRIC</span>
          <span className="opacity-60">[ INTRO ]</span>
        </div>
        <button className="border px-3 py-1 rounded-sm hover:bg-black hover:text-white transition">
          ENTER CODE
        </button>
      </div>

      {/* Content */}
      <div className="relative flex-1 grid grid-cols-12 h-[80vh]">
        {/* Left hover rail */}
        <button
          className="col-span-2 hidden lg:flex items-center justify-start group"
          aria-label="Discover AI"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rotate-45 border border-dotted border-gray-400" />
            <span className="text-[11px] tracking-widest">DISCOVER A.I.</span>
          </div>
        </button>

        {/* Center */}
        <div className="col-span-12 lg:col-span-8 flex items-center justify-center">
          <div className="transition-transform duration-300 will-change-transform">
            <h1 className="text-5xl md:text-7xl font-light leading-tight text-center">
              Sophisticated
              <br />
              skincare
            </h1>
            <div className="mt-12 flex items-center justify-center">
              <button className="inline-flex items-center gap-2 text-xs tracking-widest border px-4 py-2 rounded-sm hover:bg-black hover:text-white transition">
                PROCEED <FiChevronRight />
              </button>
            </div>
            <p className="mt-14 text-[11px] tracking-widest opacity-70 max-w-sm text-left mx-auto">
              SKINSTRIC DEVELOPED AN A.I. THAT CREATES A HIGHLY-PERSONALISED
              ROUTINE TAILORED TO WHAT YOUR SKIN NEEDS.
            </p>
          </div>
        </div>

        {/* Right hover rail */}
        <button
          className="col-span-2 hidden lg:flex items-center justify-end group"
          aria-label="Take Test"
        >
          <div className="flex items-center gap-3">
            <span className="text-[11px] tracking-widest">TAKE TEST</span>
            <div className="w-6 h-6 rotate-45 border border-dotted border-gray-400" />
          </div>
        </button>
      </div>

      {/* Back button placeholder */}
      <div className="absolute bottom-6 left-6">
        <div className="w-8 h-8 rotate-45 border border-black flex items-center justify-center">
          <span className="-rotate-45 text-xs">←</span>
        </div>
      </div>
    </main>
  )
}
