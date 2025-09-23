'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type DistData = Record<string, number>

/* ---------- Helpers de normalización ---------- */
const get = (obj: any, path: string) =>
  path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj)

const pickFirst = (obj: any, paths: string[]) => {
  for (const p of paths) {
    const v = get(obj, p)
    if (v !== undefined && v !== null) return v
  }
  return undefined
}

const toDist = (input: any): DistData | undefined => {
  if (!input) return undefined

  // Arrays de objetos [{label/name, score/probability/value}]
  if (Array.isArray(input)) {
    const out: DistData = {}
    for (const item of input) {
      const key =
        item?.label ?? item?.name ?? item?.key ?? item?.class ?? item?.category
      let val =
        item?.score ??
        item?.probability ??
        item?.prob ??
        item?.confidence ??
        item?.value
      if (typeof val === 'string') val = parseFloat(val)
      if (typeof val === 'number') {
        if (val > 1) val = val / 100 // convierte 0–100 a 0–1
        out[key] = val
      }
    }
    return out
  }

  // Objeto plano { key: number | {score: number} }
  if (typeof input === 'object') {
    const out: DistData = {}
    for (const [k, v] of Object.entries(input)) {
      let num: any =
        (v as any)?.score ?? (v as any)?.probability ?? (v as any)?.value ?? v
      if (typeof num === 'string') num = parseFloat(num)
      if (typeof num === 'number' && !Number.isNaN(num)) {
        if (num > 1) num = num / 100
        out[k] = num
      }
    }
    return out
  }

  return undefined
}

const normalizeFromStorage = (raw: any) => {
  const src = raw?.data ?? raw ?? {}

  const raceRaw = pickFirst(src, [
    'race',
    'Race',
    'demographics.race',
    'predictions.demographics.race',
    'race_distribution',
    'raceDistribution',
    'ethnicity',
  ])
  const ageRaw = pickFirst(src, [
    'age',
    'Age',
    'demographics.age',
    'predictions.demographics.age',
    'age_range',
    'ageDistribution',
    'age_distribution',
  ])
  const genderRaw = pickFirst(src, [
    'gender',
    'Gender',
    'demographics.gender',
    'predictions.demographics.gender',
    'sex',
  ])

  return {
    race: toDist(raceRaw) ?? {},
    age: toDist(ageRaw) ?? {},
    gender: toDist(genderRaw) ?? {},
  }
}
/* ---------- Fin helpers ---------- */

export default function DemographicsPage() {
  const router = useRouter()
  const [race, setRace] = useState<DistData>({})
  const [age, setAge] = useState<DistData>({})
  const [gender, setGender] = useState<DistData>({})
  const [tab, setTab] = useState<'race' | 'age' | 'gender'>('race')
  const [selectedKey, setSelectedKey] = useState<string>('')

  const sortDesc = (obj: DistData) =>
    Object.fromEntries(Object.entries(obj).sort((a, b) => b[1] - a[1]))

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phase2-data')
      if (!saved) return
      const norm = normalizeFromStorage(JSON.parse(saved))
      setRace(sortDesc(norm.race))
      setAge(sortDesc(norm.age))
      setGender(sortDesc(norm.gender))
    } catch (e) {
      console.error('Error leyendo phase2-data', e)
    }
  }, [])

  const data = tab === 'race' ? race : tab === 'age' ? age : gender

  useEffect(() => {
    const first = Object.keys(data)[0]
    setSelectedKey(first || '')
  }, [tab, race, age, gender])

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Top bar */}
      <div className="flex items-center justify-between py-6 px-8 border-b text-xs tracking-widest">
        <div className="flex items-center gap-3">
          <span className="font-medium">SKINSTRIC</span>
          <span className="opacity-60">[ ANALYSIS ]</span>
        </div>
        <button
          onClick={() => router.push('/enter-code')}
          className="px-3 py-2 text-xs font-semibold uppercase bg-black text-white"
        >
          Enter Code
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mt-6 text-sm">
        {(['race', 'age', 'gender'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 border ${
              tab === t
                ? 'bg-black text-white'
                : 'hover:bg-black hover:text-white'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main */}
      <section className="p-10 flex flex-col items-center">
        <h1 className="text-5xl font-light mb-8 uppercase">{tab}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
          {/* Círculo */}
          <div className="flex flex-col items-center">
            <p className="text-xl mb-4">{selectedKey || 'No data'}</p>
            <div className="w-64 h-64 rounded-full border flex items-center justify-center text-4xl">
              {selectedKey && data[selectedKey]
                ? (data[selectedKey] * 100).toFixed(2) + '%'
                : '--'}
            </div>
            <p className="mt-6 text-xs opacity-60 text-center">
              If A.I. estimate is wrong, click on the correct one.
            </p>
          </div>

          {/* Lista */}
          <div>
            <div className="flex justify-between font-medium border-b pb-2">
              <span>{tab.toUpperCase()}</span>
              <span>A.I. Confidence</span>
            </div>
            {Object.entries(data).length ? (
              Object.entries(data).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setSelectedKey(k)}
                  className={`flex justify-between w-full py-2 border-b last:border-0 text-left ${
                    k === selectedKey
                      ? 'bg-black text-white font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{k}</span>
                  <span>{(v * 100).toFixed(2)}%</span>
                </button>
              ))
            ) : (
              <p className="text-sm opacity-60 mt-4">No data available</p>
            )}
          </div>
        </div>
      </section>

      {/* Bottom */}
      <div className="flex justify-between items-center px-8 py-6 border-t">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm uppercase"
        >
          ← Back
        </button>
        <button
          onClick={() => alert('Confirmed')}
          className="border px-4 py-2 hover:bg-black hover:text-white transition text-sm uppercase"
        >
          Confirm
        </button>
      </div>
    </main>
  )
}
