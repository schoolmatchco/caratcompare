'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import DiamondDisplay from './DiamondDisplay'
import ChangeButton from './ChangeButton'
import ShoppingSection from './ShoppingSection'
import ChangeModal from './ChangeModal'
import diamondSizes from '@/data/diamond-sizes.json'

interface ComparisonAreaProps {
  initialCarat1: number
  initialShape1: string
  initialCarat2: number
  initialShape2: string
}

export default function ComparisonArea({
  initialCarat1,
  initialShape1,
  initialCarat2,
  initialShape2,
}: ComparisonAreaProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [carat1, setCarat1] = useState(initialCarat1)
  const [shape1, setShape1] = useState(initialShape1)
  const [carat2, setCarat2] = useState(initialCarat2)
  const [shape2, setShape2] = useState(initialShape2)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sync state with props when URL changes
  useEffect(() => {
    setCarat1(initialCarat1)
    setShape1(initialShape1)
    setCarat2(initialCarat2)
    setShape2(initialShape2)
    // Scroll to top when comparison changes
    window.scrollTo(0, 0)
  }, [initialCarat1, initialShape1, initialCarat2, initialShape2])

  const getDimensions = (carat: number, shape: string) => {
    const caratKey = carat.toFixed(2)
    const shapeData = diamondSizes[shape as keyof typeof diamondSizes]
    return shapeData?.[caratKey as keyof typeof shapeData] || { width: 5, height: 5 }
  }

  const dims1 = getDimensions(carat1, shape1)
  const dims2 = getDimensions(carat2, shape2)

  const updateURL = (newCarat1: number, newShape1: string, newCarat2: number, newShape2: string) => {
    const params = new URLSearchParams()
    params.set('carat1', newCarat1.toString())
    params.set('shape1', newShape1)
    params.set('carat2', newCarat2.toString())
    params.set('shape2', newShape2)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleApplyChanges = (newCarat1: number, newShape1: string, newCarat2: number, newShape2: string) => {
    setCarat1(newCarat1)
    setShape1(newShape1)
    setCarat2(newCarat2)
    setShape2(newShape2)
    updateURL(newCarat1, newShape1, newCarat2, newShape2)
  }

  // Calculate dime width in pixels (17.9mm * scale)
  const dimeWidthPx = Math.min(17.9 * 5, 125)

  return (
    <div className="w-full bg-main-gray min-h-screen">
      {/* Main heading - updates dynamically */}
      <div className="text-center pt-8 pb-4 px-4">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          <span className="text-cyan">{carat1 % 1 === 0 || carat1 % 1 === 0.5 ? carat1.toFixed(1) : carat1.toFixed(2)} Carat {shape1.charAt(0).toUpperCase() + shape1.slice(1)}</span>
          <span className="font-thin mx-3">vs</span>
          <span className="text-magenta">{carat2 % 1 === 0 || carat2 % 1 === 0.5 ? carat2.toFixed(1) : carat2.toFixed(2)} Carat {shape2.charAt(0).toUpperCase() + shape2.slice(1)}</span>
        </h1>
        <p className="text-white text-lg md:text-xl mt-4 md:mt-2 font-light">
          DIAMOND SIZE & SHAPE COMPARISON TOOL
        </p>
      </div>

      {/* Comparison Area - 3 Columns */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-3 gap-2">
          {/* Left Diamond */}
          <DiamondDisplay
            carat={carat1}
            shape={shape1}
            width={dims1.width}
            height={dims1.height}
            position="left"
          />

          {/* Center - Dime Reference */}
          <div className="flex flex-col items-center">
            {/* Measurement with diameter line - FIXED HEIGHT matching diamonds */}
            <div className="flex flex-col items-center justify-end mb-6" style={{ height: '44px' }}>
              <p className="text-white text-sm mb-2">17.9 mm</p>
              {/* Horizontal line with tick marks spanning dime width */}
              <div className="flex items-center" style={{ width: `${dimeWidthPx}px` }}>
                {/* Left tick */}
                <div className="flex flex-col items-center">
                  <div className="w-px h-2 bg-white"></div>
                </div>
                {/* Horizontal line */}
                <div className="flex-1 h-px bg-white"></div>
                {/* Right tick */}
                <div className="flex flex-col items-center">
                  <div className="w-px h-2 bg-white"></div>
                </div>
              </div>
            </div>

            {/* Dime - FLEXIBLE HEIGHT matching diamonds */}
            <div className="flex items-center justify-center mb-8" style={{ minHeight: '100px' }}>
              <div style={{ width: `${dimeWidthPx}px`, height: `${dimeWidthPx}px` }}>
                <img
                  src="/svg/Dime.svg"
                  alt="US Dime (17.9mm)"
                  className="w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))' }}
                />
              </div>
            </div>

            {/* Change button - FIXED HEIGHT matching labels */}
            <div className="flex items-center justify-center" style={{ height: '64px', marginTop: '10px' }}>
              <ChangeButton onClick={() => setIsModalOpen(true)} />
            </div>
          </div>

          {/* Right Diamond */}
          <DiamondDisplay
            carat={carat2}
            shape={shape2}
            width={dims2.width}
            height={dims2.height}
            position="right"
          />
        </div>

        {/* Instructional Text */}
        <div className="flex justify-center mt-16">
          <div className="inline-block px-4 py-3 rounded-lg" style={{ backgroundColor: '#1E1E1E' }}>
            <p className="text-white text-sm opacity-70 text-center">
              Click the <span className="font-bold">CHANGE</span> button above to modify the carat size and shape and <a href="#shopping" className="font-bold underline">shop</a> for diamonds below.
            </p>
          </div>
        </div>
      </div>

      {/* Shopping Sections - Full width, stacked with constrained separator */}
      <div id="shopping">
        <ShoppingSection carat={carat1} shape={shape1} position="top" />
      </div>
      <div className="w-full bg-shopping-gray flex justify-center py-4">
        <div className="w-full max-w-2xl h-px bg-gray-400"></div>
      </div>
      <ShoppingSection carat={carat2} shape={shape2} position="bottom" />

      {/* Change Modal */}
      {isModalOpen && (
        <ChangeModal
          carat1={carat1}
          shape1={shape1}
          carat2={carat2}
          shape2={shape2}
          onClose={() => setIsModalOpen(false)}
          onApply={handleApplyChanges}
        />
      )}
    </div>
  )
}
