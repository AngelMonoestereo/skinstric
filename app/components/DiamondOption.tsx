'use client'

import React from 'react'

interface Props {
  img: string
  label: string
  onChange: (file: File) => void
  capture?: boolean
  onClick?: () => void
}

export default function DiamondOption({
  img,
  label,
  onChange,
  capture,
  onClick,
}: Props) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onChange(file)
  }

  return (
    <label
      className="flex flex-col items-center cursor-pointer select-none"
      onClick={
        onClick
          ? (e) => {
              e.preventDefault()
              onClick()
            }
          : undefined
      }
    >
      <div className="relative w-96 h-96 flex items-center justify-center">
        <div className="absolute inset-0 rotate-45 border-4 border-dotted border-gray-400" />
        <div className="z-10 ">
          <img
            src={img}
            alt={label}
            className="w-64 h-64 md:w-120 md:h-120 object-contain"
            draggable={false}
          />
        </div>

        {/* Si hay onClick externo, NO mostramos input para evitar abrir el selector */}
        {!onClick && (
          <input
            type="file"
            accept="image/*"
            capture={capture ? 'user' : undefined}
            onChange={handleFile}
            className="hidden"
          />
        )}
      </div>
    </label>
  )
}
