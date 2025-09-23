'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function IntroductionPage() {
  const [hovered, setHovered] = useState<'left' | 'right' | null>(null)
  const router = useRouter()

  return (
    <main className="relative min-h-screen bg-white text-black overflow-hidden">
      {/* Marcos decorativos */}
      <DiamondFrame side="left" />
      <DiamondFrame side="right" />

      {/* Contenedor centrado */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.h1
          animate={{
            x:
              hovered === 'left'
                ? 250 // hacia la derecha
                : hovered === 'right'
                ? -250 // hacia la izquierda
                : 0, // centrado
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="text-4xl md:text-6xl lg:text-[120px] leading-[0.9] font-light text-center"
        >
          Sophisticated
          <br />
          skincare
        </motion.h1>
      </div>

      {/* Botón izquierda */}
      <div
        onMouseEnter={() => setHovered('left')}
        onMouseLeave={() => setHovered(null)}
        className={`absolute top-1/2 left-8 -translate-y-1/2 flex items-center gap-2 transition-opacity duration-500 ${
          hovered === 'right' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <DiamondButton direction="left" />
        <span className="text-xs tracking-widest">DISCOVER A.I.</span>
      </div>

      {/* Botón derecha */}
      <div
        onMouseEnter={() => setHovered('right')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => router.push('/introduction/step1')}
        className={`absolute top-1/2 right-8 -translate-y-1/2 flex items-center gap-2 transition-opacity duration-500 cursor-pointer ${
          hovered === 'left' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="text-xs tracking-widest">TAKE TEST</span>
        <DiamondButton direction="right" />
      </div>

      {/* Texto inferior izquierda */}
      <p className="absolute left-6 md:left-8 bottom-8 text-[11px] max-w-xs tracking-widest opacity-70">
        SKINSTRIC DEVELOPED AN A.I. THAT CREATES A HIGHLY-PERSONALISED ROUTINE
        TAILORED TO WHAT YOUR SKIN NEEDS.
      </p>
    </main>
  )
}

/* --- Componentes auxiliares --- */
function DiamondFrame({ side }: { side: 'left' | 'right' }) {
  const common =
    'hidden md:block absolute top-1/2 -translate-y-1/2 w-[26vw] h-[26vw] rotate-45'
  const pos =
    side === 'left'
      ? 'left-[-6vw] border border-dotted border-gray-300/60'
      : 'right-[-6vw] border border-dotted border-gray-300/60'

  return <div aria-hidden className={`${common} ${pos}`} />
}

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
