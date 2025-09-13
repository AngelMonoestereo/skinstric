'use client'

export default function AnalysisPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Top bar */}
      <div className="flex items-center justify-between py-6 px-8 text-xs tracking-widest border-b">
        <div className="flex items-center gap-3">
          <span className="font-medium">SKINSTRIC</span>
          <span className="opacity-60">[ ANALYSIS ]</span>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-12 min-h-[80vh]">
        {/* Sidebar */}
        <aside className="col-span-2 border-r text-sm">
          <ul className="flex flex-col">
            <li className="px-4 py-3 font-medium bg-black text-white">Race</li>
            <li className="px-4 py-3 hover:bg-gray-100">Age</li>
            <li className="px-4 py-3 hover:bg-gray-100">Sex</li>
          </ul>
        </aside>

        {/* Main panel */}
        <section className="col-span-7 flex flex-col justify-center items-center p-10">
          <h1 className="text-5xl font-light mb-8">DEMOGRAPHICS</h1>
          <p className="text-xl mb-4">East Asian</p>
          <div className="w-64 h-64 rounded-full border flex items-center justify-center text-4xl">
            96%
          </div>
          <p className="mt-6 text-xs opacity-60">
            If A.I. estimate is wrong, select the correct one.
          </p>
        </section>

        {/* Right panel */}
        <aside className="col-span-3 border-l p-6 text-sm">
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Race</span>
            <span className="font-medium">A.I. Confidence</span>
          </div>
          <div className="flex justify-between py-2 bg-black text-white">
            <span>East Asian</span>
            <span>96%</span>
          </div>
          <div className="flex justify-between py-2">
            <span>White</span>
            <span>6%</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Black</span>
            <span>3%</span>
          </div>
          <div className="flex justify-between py-2">
            <span>South Asian</span>
            <span>2%</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Latino Hispanic</span>
            <span>0%</span>
          </div>
        </aside>
      </div>

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
