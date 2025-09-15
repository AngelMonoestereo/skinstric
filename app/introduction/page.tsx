'use client'

import { useEffect, useMemo, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

type Step = 0 | 1 | 2

const NAME_KEY = 'skinstric:name'
const LOCATION_KEY = 'skinstric:location'
const API_URL =
  'https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne'

const isAlphaString = (s: string) => /^[A-Za-zÀ-ÿ' -]{2,}$/.test(s.trim())

export default function IntroductionPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(0)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      const n = localStorage.getItem(NAME_KEY) || ''
      const l = localStorage.getItem(LOCATION_KEY) || ''
      if (n) setName(n)
      if (l) setLocation(l)
    } catch {}
  }, [])

  const nameValid = useMemo(() => isAlphaString(name), [name])
  const locationValid = useMemo(() => isAlphaString(location), [location])

  const proceedFromHero = () => setStep(1)
  const goBack = () => setStep((s) => (s === 0 ? 0 : ((s - 1) as Step)))

  const goNext = async () => {
    if (step === 1) {
      if (!nameValid) return setMessage('Please enter a valid name.')
      setMessage(null)
      setStep(2)
      return
    }

    if (step === 2) {
      if (!locationValid) return setMessage('Please enter a valid location.')
      setMessage(null)

      try {
        localStorage.setItem(NAME_KEY, name.trim())
        localStorage.setItem(LOCATION_KEY, location.trim())
      } catch {}

      try {
        setSubmitting(true)
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            location: location.trim(),
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || 'Request failed.')

        if (data?.SUCCUSS) {
          router.push('/upload') // 👈 Redirect automático a /upload
        }

        setMessage(data?.SUCCUSS || `Success: Added ${name} from ${location}.`)
      } catch (err: any) {
        setMessage(`Could not submit. ${err?.message || 'Please try again.'}`)
      } finally {
        setSubmitting(false)
      }
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      void goNext()
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="flex items-center justify-between py-6 px-8 text-xs tracking-widest">
        <div className="flex items-center gap-3">
          <span className="font-medium">SKINSTRIC</span>
          <span className="opacity-60">[ INTRO ]</span>
        </div>
        <button className="border px-3 py-1 rounded-sm hover:bg-black hover:text-white transition">
          ENTER CODE
        </button>
      </div>

      <div className="relative flex-1 grid grid-cols-12">
        <button
          className="col-span-2 hidden lg:flex items-center justify-start group"
          onClick={proceedFromHero}
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rotate-45 border border-dotted border-gray-400" />
            <span className="text-[11px] tracking-widest">DISCOVER A.I.</span>
          </div>
        </button>

        <div className="col-span-12 lg:col-span-8 flex items-center justify-center">
          {step === 0 && (
            <div>
              <h1 className="text-5xl md:text-7xl font-light text-center">
                Sophisticated
                <br />
                skincare
              </h1>
              <div className="mt-12 flex justify-center">
                <button
                  onClick={proceedFromHero}
                  className="inline-flex items-center gap-2 text-xs tracking-widest border px-4 py-2 rounded-sm hover:bg-black hover:text-white"
                >
                  PROCEED <FiChevronRight />
                </button>
              </div>
              <p className="mt-14 text-[11px] tracking-widest opacity-70 max-w-sm text-left mx-auto">
                SKINSTRIC DEVELOPED AN A.I. THAT CREATES A HIGHLY-PERSONALISED
                ROUTINE TAILORED TO WHAT YOUR SKIN NEEDS.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col items-center">
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Introduce Yourself"
                className="w-72 border-b border-black text-center text-3xl font-light outline-none placeholder-black/40"
              />
              {!nameValid && name.length > 0 && (
                <p className="mt-3 text-xs text-red-500">
                  Letters only (min 2)
                </p>
              )}
              <div className="mt-6 flex gap-2">
                <button onClick={goBack} className="border px-3 py-1">
                  ← Back
                </button>
                <button
                  onClick={goNext}
                  disabled={!nameValid}
                  className="border px-3 py-1 disabled:opacity-40"
                >
                  Proceed →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center">
              <input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Where are you from?"
                className="w-72 border-b border-black text-center text-3xl font-light outline-none placeholder-black/40"
              />
              {!locationValid && location.length > 0 && (
                <p className="mt-3 text-xs text-red-500">
                  Letters only (min 2)
                </p>
              )}
              <div className="mt-6 flex gap-2">
                <button onClick={goBack} className="border px-3 py-1">
                  ← Back
                </button>
                <button
                  onClick={goNext}
                  disabled={!locationValid || submitting}
                  className="border px-3 py-1 disabled:opacity-40"
                >
                  {submitting ? 'Submitting…' : 'Submit'}
                </button>
              </div>
              {message && <p className="mt-4 text-xs">{message}</p>}
            </div>
          )}
        </div>

        <button
          className="col-span-2 hidden lg:flex items-center justify-end group"
          onClick={proceedFromHero}
        >
          <div className="flex items-center gap-3">
            <span className="text-[11px] tracking-widest">TAKE TEST</span>
            <div className="w-6 h-6 rotate-45 border border-dotted border-gray-400" />
          </div>
        </button>
      </div>
    </main>
  )
}
