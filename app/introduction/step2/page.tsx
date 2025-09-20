'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Step2Page() {
  const [location, setLocation] = useState('')
  const router = useRouter()

  return (
    <main className="relative min-h-screen bg-white text-black overflow-hidden">
      {/* Diamante decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] md:w-[35vw] aspect-square rotate-45 border border-dotted border-gray-300/60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] md:w-[45vw] aspect-square rotate-45 border border-dotted border-gray-200/40" />

      {/* Texto superior */}
      <p className="absolute top-[25%] left-1/2 -translate-x-1/2 text-xs tracking-widest text-gray-400">
        WHERE ARE YOU FROM?
      </p>

      {/* Input central */}
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Melbourne"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl md:text-5xl font-light text-center outline-none border-b border-black/40 placeholder-gray-400"
      />

      {/* Back */}
      <button
        onClick={() => router.push('/introduction/step1')}
        className="absolute bottom-8 left-8 flex items-center gap-2 text-xs tracking-widest"
      >
        <DiamondButton direction="left" />
        BACK
      </button>

      {/* Proceed */}
      <button
        onClick={() => router.push('/upload')}
        disabled={!location.trim()}
        className="absolute bottom-8 right-8 flex items-center gap-2 text-xs tracking-widest disabled:opacity-40"
      >
        PROCEED
        <DiamondButton direction="right" />
      </button>
    </main>
  )
}

/* --- Reutilizable --- */
function DiamondButton({ direction }: { direction: 'left' | 'right' }) {
  return (
    <div className="relative w-6 h-6 rotate-45 border border-black grid place-items-center">
      <div
        className={[
          'absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 -rotate-45',
          'w-0 h-0',
          direction === 'right'
            ? 'border-l-[6px] border-l-black border-y-[6px] border-y-transparent'
            : 'border-r-[6px] border-r-black border-y-[6px] border-y-transparent',
        ].join(' ')}
      />
    </div>
  )
}
