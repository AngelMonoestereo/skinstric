'use client'

import { useEffect, useState } from 'react'

type RaceData = Record<string, number>

export default function AnalysisPage() {
  const [race, setRace] = useState<RaceData>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem('analysis-data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.race) {
          // ordenar descendente
          const sorted = Object.entries(parsed.race)
            .sort((a, b) => b[1] - a[1])
            .reduce((acc, [k, v]) => {
              acc[k] = v
              return acc
            }, {} as RaceData)

          setRace(sorted)
        }
      }
    } catch (err) {
      console.error('Error loading analysis data', err)
    }
  }, [])

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Top bar */}
      <div className="flex items-center justify-between py-6 px-8 border-b text-xs tracking-widest">
        <div className="flex gap-3">
          <span className="font-medium">SKINSTRIC</span>
          <span className="opacity-60">[ ANALYSIS ]</span>
        </div>
      </div>

      <section className="p-10">
        <h1 className="text-5xl font-light mb-8">DEMOGRAPHICS</h1>

        <div className="grid grid-cols-2 gap-12">
          {/* Main circle */}
          <div className="flex flex-col items-center">
            <p className="text-xl mb-4">{Object.keys(race)[0]}</p>
            <div className="w-64 h-64 rounded-full border flex items-center justify-center text-4xl">
              {race[Object.keys(race)[0]]
                ? (race[Object.keys(race)[0]] * 100).toFixed(2) + '%'
                : '--'}
            </div>
            <p className="mt-6 text-xs opacity-60 text-center">
              If A.I. estimate is wrong, select the correct one.
            </p>
          </div>

          {/* Race list */}
          <div>
            <div className="flex justify-between font-medium border-b pb-2">
              <span>Race</span>
              <span>A.I. Confidence</span>
            </div>
            {Object.entries(race).map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between py-2 border-b last:border-none"
              >
                <span>{k}</span>
                <span>{(v * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom buttons */}
      <div className="flex justify-end gap-3 px-8 py-6 border-t">
        <button className="border px-4 py-2 hover:bg-black hover:text-white transition">
          Reset
        </button>
        <button className="border px-4 py-2 hover:bg-black hover:text-white transition">
          Confirm
        </button>
      </div>
    </main>
  )
}
