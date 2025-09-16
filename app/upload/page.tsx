'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch {
      setError('Camera access denied or unavailable.')
    }
  }

  const takeSelfie = async () => {
    if (!videoRef.current || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    ctx.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
    const base64 = canvasRef.current.toDataURL('image/png')

    setLoading(true)
    try {
      const res = await fetch(
        'https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Image: base64 }),
        }
      )
      const data = await res.json()
      localStorage.setItem('phase2-data', JSON.stringify(data))
      router.push('/analysis')
    } catch {
      setError('Upload failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <div className="flex flex-col items-center gap-6">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <video
          ref={videoRef}
          className="w-64 h-48 border"
          autoPlay
          muted
          playsInline
        />
        <canvas ref={canvasRef} width={320} height={240} className="hidden" />
        {!loading ? (
          <div className="flex gap-4">
            <button
              onClick={startCamera}
              className="border px-6 py-2 hover:bg-black hover:text-white transition"
            >
              Allow A.I. to Scan Your Face
            </button>
            <button
              onClick={takeSelfie}
              className="border px-6 py-2 hover:bg-black hover:text-white transition"
            >
              Take Selfie
            </button>
          </div>
        ) : (
          <p className="animate-pulse">Preparing your analysis…</p>
        )}
      </div>
    </main>
  )
}
