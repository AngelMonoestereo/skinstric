'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type DistData = Record<string, number>

// --- helpers de normalización ---
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
        if (val > 1) val = val / 100
        out[key] = val
      }
    }
    return out
  }
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

const normalize = (raw: any) => {
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
// --- fin helpers ---

export default function AnalysisLanding() {
  const router = useRouter()
  const [topRace, setTopRace] = useState<string>('')
  const [topAge, setTopAge] = useState<string>('')
  const [topGender, setTopGender] = useState<string>('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phase2-data')
      if (!saved) return
      const norm = normalize(JSON.parse(saved))
      const pickTop = (obj: DistData) =>
        Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''
      setTopRace(pickTop(norm.race))
      setTopAge(pickTop(norm.age))
      setTopGender(pickTop(norm.gender))
    } catch (e) {
      console.error('Error reading phase2-data', e)
    }
  }, [])

  const Tile = ({
    label,
    sub,
    onClick,
    active = false,
  }: {
    label: string
    sub?: string
    onClick?: () => void
    active?: boolean
  }) => (
    <button
      onClick={onClick}
      disabled={!active && !onClick}
      className={`
        relative w-44 h-44 md:w-52 md:h-52 rotate-45 
        flex items-center justify-center 
        border border-white shadow-sm
        ${active ? 'bg-gray-200' : 'bg-gray-50 text-gray-500'}
      `}
      style={{ outline: '1px solid #e5e7eb' }}
    >
      <div className="-rotate-45 text-center">
        <div className="text-xs md:text-sm font-semibold tracking-widest">
          {label}
        </div>
        {sub ? (
          <div className="text-[10px] md:text-xs mt-1 opacity-70">{sub}</div>
        ) : null}
      </div>
    </button>
  )

  return (
    <main className="relative min-h-screen bg-white text-black">
      {/* Top bar */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider">
          <span className="font-semibold">Skinstric</span>
          <span className="text-gray-500"> [ Intro ]</span>
        </div>
        <button
          onClick={() => router.push('/enter-code')}
          className="px-3 py-2 text-xs font-semibold uppercase bg-black text-white"
        >
          Enter Code
        </button>
      </header>

      {/* Title */}
      <div className="px-6">
        <h2 className="text-sm font-bold uppercase tracking-wide mt-4">
          A.I. Analysis
        </h2>
        <p className="text-xs mt-2 opacity-70 leading-5">
          A.I. has estimated the following. Fix estimated information if needed.
        </p>
      </div>

      {/* Diamonds */}
      <section className="min-h-[70vh] flex items-center justify-center">
        <div className="grid grid-cols-2 gap-5 rotate-45">
          <Tile
            label="DEMOGRAPHICS"
            active
            onClick={() => router.push('/introduction/demographics')} // <-- antes apuntaba a /analysis/demographics
          />
          <Tile label="SKIN TYPE DETAILS" />
          <Tile label="COSMETIC CONCERNS" />
          <Tile label="WEATHER" />
        </div>
      </section>

      {/* Back / Get Summary */}
      <button
        onClick={() => router.back()}
        className="absolute bottom-6 left-6 flex items-center gap-3 group"
      >
        <span className="relative block w-10 h-10">
          <span className="absolute inset-0 rotate-45 border border-gray-400" />
          <span className="absolute inset-0 -rotate-45 flex items-center justify-center text-base">
            ◀
          </span>
        </span>
        <span className="uppercase tracking-wide text-sm group-hover:underline">
          Back
        </span>
      </button>

      <button
        onClick={() => alert('Summary TBD')}
        className="absolute bottom-6 right-6 flex items-center gap-3 group"
      >
        <span className="uppercase tracking-wide text-sm">Get Summary</span>
        <span className="relative block w-10 h-10">
          <span className="absolute inset-0 rotate-45 border border-gray-400" />
          <span className="absolute inset-0 -rotate-45 flex items-center justify-center text-base">
            ▶
          </span>
        </span>
      </button>
    </main>
  )
}
