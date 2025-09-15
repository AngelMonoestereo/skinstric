'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const base64 = await fileToBase64(file)
      const cleanBase64 = base64.split(',')[1]

      const res = await fetch(
        'https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: cleanBase64 }),
        }
      )

      const data = await res.json()
      console.log('API response:', data)

      localStorage.setItem('phase2-data', JSON.stringify(data))
      router.push('/analysis')
    } catch (err) {
      console.error(err)
      alert('Upload failed, try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleScanFace = async () => {
    setLoading(true)
    try {
      const dummyImage = 'iVBORw0KGgoAAAANSUhEUgAAAAUA...' // base64 mínimo de prueba

      const res = await fetch(
        'https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Image: dummyImage }),
        }
      )

      const data = await res.json()
      console.log('API response (dummy):', data)

      localStorage.setItem('phase2-data', JSON.stringify(data))
      router.push('/analysis')
    } catch (err) {
      console.error(err)
      alert('Scan failed, try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      {!loading ? (
        <div className="flex gap-16">
          <button
            onClick={handleScanFace}
            className="w-40 h-40 border-2 border-dotted border-black flex items-center justify-center rotate-45"
          >
            <span className="-rotate-45 text-xs tracking-widest text-center">
              ALLOW A.I. <br /> TO SCAN YOUR FACE
            </span>
          </button>

          <label className="w-40 h-40 border-2 border-dotted border-black flex items-center justify-center rotate-45 cursor-pointer">
            <span className="-rotate-45 text-xs tracking-widest text-center">
              ALLOW A.I. <br /> ACCESS GALLERY
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>
      ) : (
        <div className="text-center animate-pulse">
          <div className="w-40 h-40 border-2 border-dotted border-black mx-auto rotate-45 flex items-center justify-center">
            <span className="-rotate-45 text-xs tracking-widest">
              PREPARING YOUR ANALYSIS...
            </span>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-6">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rotate-45 border border-black flex items-center justify-center"
        >
          <span className="-rotate-45 text-xs">←</span>
        </button>
      </div>
    </main>
  )
}
