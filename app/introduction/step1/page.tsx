'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Step1Page() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleProceed = () => {
    if (name.trim() === '') return
    localStorage.setItem('user-name', name)
    router.push('/introduction/step2')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black relative">
      {/* Top bar */}
      <header className="absolute top-6 left-6 text-xs font-semibold tracking-widest">
        SKINSTRIC <span className="text-gray-500">[ INTRO ]</span>
      </header>

      <h2 className="absolute top-16 left-6 text-sm font-semibold tracking-widest">
        TO START ANALYSIS
      </h2>

      {/* Diamond input */}
      <div className="w-96 h-96 border border-dotted border-gray-400 rotate-45 flex items-center justify-center">
        <div className="-rotate-45 text-center">
          <p className="text-xs text-gray-400 mb-2 tracking-widest">
            CLICK TO TYPE
          </p>
          <input
            type="text"
            placeholder="Introduce Yourself"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl md:text-3xl font-light text-center focus:outline-none border-b border-black"
          />
        </div>
      </div>

      {/* Back + Proceed */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 cursor-pointer">
        <div className="w-6 h-6 border border-black rotate-45 flex items-center justify-center">
          <div className="-rotate-45">{'<'}</div>
        </div>
        <span className="text-xs font-medium">BACK</span>
      </div>

      <div
        onClick={handleProceed}
        className="absolute bottom-6 right-6 flex items-center gap-2 cursor-pointer"
      >
        <span className="text-xs font-medium">PROCEED</span>
        <div className="w-6 h-6 border border-black rotate-45 flex items-center justify-center">
          <div className="-rotate-45">{'>'}</div>
        </div>
      </div>
    </main>
  )
}
