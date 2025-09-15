'use client'

import { useEffect, useState } from 'react'

type DemographicData = Record<string, number>

export default function AnalysisPage() {
  const [race, setRace] = useState<DemographicData>({})
  const [age, setAge] = useState<DemographicData>({})
  const [gender, setGender] = useState<DemographicData>({})

  const sortDesc = (obj: Record<string, number>) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [k, v]) => {
        acc[k] = v
        return acc
      }, {} as Record<string, number>)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phase2-data')
      if (saved) {
        const parsed = JSON.parse(saved)
        console.log('Parsed localStorage:', parsed)

        if (parsed?.data?.race) setRace(sortDesc(parsed.data.race))
        if (parsed?.data?.age) setAge(sortDesc(parsed.data.age))
        if (parsed?.data?.gender) setGender(sortDesc(parsed.data.gender))
      }
    } catch (err) {
      console.error('Error loading analysis data', err)
    }
  }, [])

  const renderBlock = (title: string, data: DemographicData) => (
    <div>
      <h2 className="text-2xl font-light mb-4">{title}</h2>
      {Object.keys(data).length > 0 ? (
        <div>
          {Object.entries(data).map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between py-1 border-b last:border-none"
            >
              <span>{k}</span>
              <span>{(v * 100).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="opacity-60">No data available</p>
      )}
    </div>
  )

  return (
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-5xl font-light mb-10">DEMOGRAPHICS</h1>
      <div className="grid grid-cols-3 gap-12">
        {renderBlock('Race', race)}
        {renderBlock('Age', age)}
        {renderBlock('Gender', gender)}
      </div>
    </main>
  )
}
