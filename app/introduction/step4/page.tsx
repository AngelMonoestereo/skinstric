'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Step4Page() {
  const router = useRouter()

  // Auto-redirect after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      router.push('/analysis')
    }, 3000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black relative overflow-hidden">
      {/* Top bar */}
      <header className="absolute top-6 left-6 text-xs font-semibold tracking-widest">
        SKINSTRIC <span className="text-gray-500">[ INTRO ]</span>
      </header>

      {/* Rotating Diamond */}
      <div className="w-64 h-64 border-2 border-dotted border-black rotate-45 animate-spin-slow flex items-center justify-center">
        <span className="-rotate-45 text-xs md:text-sm tracking-widest font-medium">
          A.I. ANALYSIS
        </span>
      </div>

      {/* Text */}
      <p className="mt-12 text-sm md:text-lg font-light tracking-widest text-center">
        PREPARING YOUR ANALYSIS…
      </p>
    </main>
  )
}
