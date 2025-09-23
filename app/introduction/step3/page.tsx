'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import DiamondOption from '../../components/DiamondOption'

export default function Step3Page() {
  const [preview, setPreview] = useState<string | null>(null)
  const [showConsent, setShowConsent] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const router = useRouter()

  // --- utils (NUEVO): comprimir + enviar probando varios formatos ---
  const fileToCompressedBase64 = (
    file: File,
    maxSide = 800, // un poco más chico para evitar payloads grandes
    quality = 0.75
  ): Promise<{ dataUrl: string; base64: string; fileSmall: File }> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(maxSide / img.width, maxSide / img.height, 1)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('No canvas 2D context'))

        ctx.drawImage(img, 0, 0, w, h)

        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        const base64 = dataUrl.split(',')[1]

        // también generamos un File pequeño por si el backend quiere multipart
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('No blob'))
            const fileSmall = new File([blob], 'capture.jpg', {
              type: 'image/jpeg',
            })
            resolve({ dataUrl, base64, fileSmall })
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })

  const endpoint =
    'https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo'

  async function postJSON(body: any) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    let json: any = undefined
    try {
      json = JSON.parse(text)
    } catch {}
    return { ok: res.ok, status: res.status, text, json }
  }

  async function postForm(field: string, file: File) {
    const fd = new FormData()
    fd.append(field, file, 'capture.jpg')
    const res = await fetch(endpoint, { method: 'POST', body: fd })
    const text = await res.text()
    let json: any = undefined
    try {
      json = JSON.parse(text)
    } catch {}
    return { ok: res.ok, status: res.status, text, json }
  }

  async function postPhaseTwo({
    base64,
    fileSmall,
  }: {
    base64: string
    fileSmall: File
  }) {
    // 1) JSON con "Image" (mayúscula) base64 puro
    let r = await postJSON({ Image: base64 })
    if (r.ok) return r

    // 2) JSON con "image" (minúscula) base64 puro
    r = await postJSON({ image: base64 })
    if (r.ok) return r

    // 3) JSON con prefijo data:
    r = await postJSON({ image: `data:image/jpeg;base64,${base64}` })
    if (r.ok) return r

    r = await postJSON({ Image: `data:image/jpeg;base64,${base64}` })
    if (r.ok) return r

    // 4) multipart/form-data con campo "image" o "Image"
    r = await postForm('image', fileSmall)
    if (r.ok) return r

    r = await postForm('Image', fileSmall)
    return r
  }

  const handleUpload = async (file: File) => {
    // 1) comprimir + previsualizar
    const { dataUrl, base64, fileSmall } = await fileToCompressedBase64(file)
    setPreview(dataUrl)

    try {
      // 2) intentar secuencialmente formatos comunes
      const res = await postPhaseTwo({ base64, fileSmall })

      if (!res.ok) {
        console.error('❌ API error', res.status, res.text)
        alert(`API error ${res.status}:\n${(res.text || '').slice(0, 180)}…`)
        return
      }

      // 3) guardar y navegar
      const payload = res.json ?? {}
      localStorage.setItem('phase2-data', JSON.stringify(payload))
      router.push('/analysis')
    } catch (e) {
      console.error('❌ Error general enviando a API:', e)
      alert('No se pudo enviar la imagen. Revisa consola para detalles.')
    }
  }

  // --- cámara ---
  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Tu navegador no permite abrir la cámara. Usa la galería.')
      return
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      })
      setStream(s) // esto hará que se muestre la vista de cámara
    } catch (e) {
      console.error('No se pudo abrir la cámara', e)
    }
  }

  const closeCamera = () => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
  }

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(() => {})
    }
  }, [stream])

  const takePhoto = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      async (blob) => {
        if (!blob) return
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
        closeCamera()
        await handleUpload(file)
      },
      'image/jpeg',
      0.92
    )
  }

  return (
    <main className="relative min-h-screen bg-white text-black flex flex-col">
      {/* HEADER */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider">
          <span className="font-semibold">Skinstric</span>
          <span className="text-gray-500"> [ intro ]</span>
        </div>
        <button
          onClick={() => router.push('/enter-code')}
          className="px-3 py-2 text-xs font-semibold uppercase bg-black text-white"
        >
          Enter Code
        </button>
      </header>

      {/* FILA: título izq + preview der */}
      <div className="px-6 pb-2 flex items-end justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide">
          To Start Analysis
        </h2>

        {preview && (
          <aside className="text-right">
            <h3 className="text-sm mb-2">Preview</h3>
            <img
              src={preview}
              alt="preview"
              className="w-28 h-28 border border-gray-300 object-cover rounded-sm"
            />
          </aside>
        )}
      </div>

      {/* CONTENIDO CENTRAL (rombos centrados) */}
      <section className="flex-1 flex items-center justify-center px-6">
        <div className="flex gap-20 flex-wrap justify-center">
          {/* Rombo IZQ: abre flujo de cámara */}
          <DiamondOption
            img="/camera.png"
            label="ALLOW A.I. TO SCAN YOUR FACE"
            onChange={handleUpload}
            onClick={() => setShowConsent(true)} // ⬅️ interceptamos y mostramos modal
          />

          {/* Rombo DER: galería nativa */}
          <DiamondOption
            img="/gallery.png"
            label="ALLOW A.I. ACCESS GALLERY"
            onChange={handleUpload}
          />
        </div>
      </section>

      {/* BACK abajo izquierda */}
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

      {/* ================= MODALES / OVERLAYS ================= */}

      {/* (1) Modal de consentimiento custom */}
      {showConsent && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
          <div className="w-[560px] max-w-[90vw] bg-neutral-900 text-white shadow-xl">
            <div className="px-6 py-4 text-sm font-semibold uppercase">
              Allow A.I. to access your camera
            </div>
            <div className="border-t border-neutral-700 flex">
              <button
                onClick={() => setShowConsent(false)}
                className="flex-1 px-6 py-3 text-xs uppercase text-neutral-300 hover:bg-neutral-800"
              >
                Deny
              </button>
              <button
                onClick={() => {
                  setShowConsent(false)
                  openCamera() /* aquí el navegador mostrará su prompt nativo */
                }}
                className="flex-1 px-6 py-3 text-xs uppercase font-bold hover:bg-neutral-800"
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* (2) Vista de cámara a pantalla completa */}
      {stream && (
        <div className="fixed inset-0 z-40 bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            autoPlay
            muted
          />

          {/* Tips en el centro-bajo */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-white/90 text-xs uppercase tracking-wide text-center">
            <p className="mb-3">To get better results make sure to have</p>
            <div className="flex gap-6 justify-center text-[11px]">
              <span>◦ Neutral expression</span>
              <span>◦ Frontal pose</span>
              <span>◦ Adequate lighting</span>
            </div>
          </div>

          {/* Botón Take Picture (derecha-centro) */}
          <button
            onClick={takePhoto}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 text-black font-semibold"
            title="Take picture"
          >
            📸
          </button>

          {/* Back dentro de la cámara */}
          <button
            onClick={closeCamera}
            className="absolute bottom-6 left-6 flex items-center gap-3 group text-white"
          >
            <span className="relative block w-10 h-10">
              <span className="absolute inset-0 rotate-45 border border-white/70" />
              <span className="absolute inset-0 -rotate-45 flex items-center justify-center text-base">
                ◀
              </span>
            </span>
            <span className="uppercase tracking-wide text-sm group-hover:underline">
              Back
            </span>
          </button>
        </div>
      )}
    </main>
  )
}
