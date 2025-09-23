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

/* Tailwind animation (add in globals.css if not present)
--------------------------------------------------------- */
/* 
@keyframes spin-slow {
  0% { transform: rotate(45deg); }
  100% { transform: rotate(405deg); }
}
.animate-spin-slow {
  animation: spin-slow 6s linear infinite;
}
*/

// 'use client'

// import { useRouter } from 'next/navigation'

// export default function Step4Page() {
//   const router = useRouter()

//   const options = [
//     {
//       label: 'DEMOGRAPHICS',
//       active: true,
//       onClick: () => router.push('/introduction/demographics'),
//     },
//     { label: 'COSMETIC CONCERNS', active: false },
//     { label: 'SKIN TYPE DETAILS', active: false },
//     { label: 'WEATHER', active: false },
//   ]

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-white text-black">
//       <div className="grid grid-cols-2 gap-6 rotate-45">
//         {options.map((opt, idx) => (
//           <button
//             key={idx}
//             disabled={!opt.active}
//             onClick={opt.onClick}
//             className={`w-40 h-40 flex items-center justify-center border rotate-[-45deg] text-xs tracking-widest
//               ${
//                 opt.active
//                   ? 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
//                   : 'bg-gray-50 text-gray-400 cursor-not-allowed'
//               }
//             `}
//           >
//             {opt.label}
//           </button>
//         ))}
//       </div>
//     </main>
//   )
// }
