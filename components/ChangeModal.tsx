'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackComparisonChange } from '@/lib/analytics'

interface ChangeModalProps {
  carat1: number
  shape1: string
  carat2: number
  shape2: string
  onClose: () => void
  onApply: (carat1: number, shape1: string, carat2: number, shape2: string) => void
}

const shapes = ['round', 'princess', 'cushion', 'emerald', 'asscher', 'heart', 'pear', 'oval', 'marquise', 'radiant']
const caratOptions = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75, 4.00]

export default function ChangeModal({ carat1, shape1, carat2, shape2, onClose, onApply }: ChangeModalProps) {
  const [selectedCarat1, setSelectedCarat1] = useState(carat1)
  const [selectedShape1, setSelectedShape1] = useState(shape1)
  const [selectedCarat2, setSelectedCarat2] = useState(carat2)
  const [selectedShape2, setSelectedShape2] = useState(shape2)

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleApply = () => {
    trackComparisonChange(selectedCarat1, selectedShape1, selectedCarat2, selectedShape2)
    onApply(selectedCarat1, selectedShape1, selectedCarat2, selectedShape2)
    onClose()
  }

  const getShapeIcon = (shape: string) => {
    const shapeName = shape.charAt(0).toUpperCase() + shape.slice(1)
    return `/svg/diamonds/${shapeName}.svg?v=${Date.now()}`
  }

  const caratToSliderValue = (carat: number) => caratOptions.indexOf(carat)
  const sliderValueToCarat = (value: number) => caratOptions[value]

  // Format carat to remove unnecessary trailing zeros (0.5 instead of 0.50, 1.0 instead of 1.00)
  const formatCarat = (carat: number) => {
    return carat % 1 === 0 ? `${carat}.0` : carat.toString()
  }

  return (
    <AnimatePresence>
      {/* Backdrop with blur */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
      />

      {/* Modal - Always bottom sheet */}
      <motion.div
        key="modal"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
        className="fixed bottom-0 left-0 right-0 rounded-t-3xl z-50 max-w-4xl mx-auto border-t-2 border-l-2 border-r-2 border-black"
        style={{ maxHeight: '85vh', backgroundColor: '#252525' }}
      >
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-2 md:hidden">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="p-4 md:p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-3xl leading-none"
          >
            ×
          </button>

          {/* Live Preview - Two diamonds side by side */}
          <div className="grid grid-cols-2 gap-6 mb-6 pt-2">
            {/* Diamond 1 Preview */}
            <div className="flex flex-col items-center">
              <motion.div
                key={`preview-1-${selectedShape1}`}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 flex items-center justify-center mb-2"
              >
                <img
                  src={getShapeIcon(selectedShape1)}
                  alt={selectedShape1}
                  className="max-w-full max-h-full object-contain"
                />
              </motion.div>
              <p className="text-lg font-bold" style={{ color: '#07F4FF' }}>
                {formatCarat(selectedCarat1)} {selectedShape1.toUpperCase()}
              </p>
            </div>

            {/* Diamond 2 Preview */}
            <div className="flex flex-col items-center">
              <motion.div
                key={`preview-2-${selectedShape2}`}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 flex items-center justify-center mb-2"
              >
                <img
                  src={getShapeIcon(selectedShape2)}
                  alt={selectedShape2}
                  className="max-w-full max-h-full object-contain"
                />
              </motion.div>
              <p className="text-lg font-bold" style={{ color: '#FA06FF' }}>
                {formatCarat(selectedCarat2)} {selectedShape2.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Controls - Side by side */}
          <div className="grid grid-cols-2 gap-8 mb-4">
            {/* Diamond 1 Controls */}
            <div>
              <div className="mb-4 px-2">
                <p className="text-white text-center mb-2 font-medium">{formatCarat(selectedCarat1)}</p>
                <input
                  type="range"
                  min="0"
                  max={caratOptions.length - 1}
                  step="1"
                  value={caratToSliderValue(selectedCarat1)}
                  onChange={(e) => setSelectedCarat1(sliderValueToCarat(parseInt(e.target.value)))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-cyan"
                  style={{ '--value': `${(caratToSliderValue(selectedCarat1) / (caratOptions.length - 1)) * 100}%` } as React.CSSProperties}
                />
                <div className="flex justify-between text-sm text-gray-300 mt-1 font-bold">
                  <span>0.25</span>
                  <span>4.00</span>
                </div>
              </div>

              {/* Shape Grid */}
              <div>
                <div className="grid grid-cols-5 gap-1">
                  {shapes.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape1(shape)}
                      className={`p-1 rounded transition-all ${
                        selectedShape1 === shape
                          ? 'border-2 scale-110'
                          : ''
                      }`}
                      style={selectedShape1 === shape ? { borderColor: '#07F4FF' } : {}}
                    >
                      <img
                        src={getShapeIcon(shape)}
                        alt={shape}
                        className="w-full h-6 object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Diamond 2 Controls */}
            <div>
              <div className="mb-4 px-2">
                <p className="text-white text-center mb-2 font-medium">{formatCarat(selectedCarat2)}</p>
                <input
                  type="range"
                  min="0"
                  max={caratOptions.length - 1}
                  step="1"
                  value={caratToSliderValue(selectedCarat2)}
                  onChange={(e) => setSelectedCarat2(sliderValueToCarat(parseInt(e.target.value)))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-magenta"
                  style={{ '--value': `${(caratToSliderValue(selectedCarat2) / (caratOptions.length - 1)) * 100}%` } as React.CSSProperties}
                />
                <div className="flex justify-between text-sm text-gray-300 mt-1 font-bold">
                  <span>0.25</span>
                  <span>4.00</span>
                </div>
              </div>

              {/* Shape Grid */}
              <div>
                <div className="grid grid-cols-5 gap-1">
                  {shapes.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape2(shape)}
                      className={`p-1 rounded transition-all ${
                        selectedShape2 === shape
                          ? 'border-2 scale-110'
                          : ''
                      }`}
                      style={selectedShape2 === shape ? { borderColor: '#FA06FF' } : {}}
                    >
                      <img
                        src={getShapeIcon(shape)}
                        alt={shape}
                        className="w-full h-6 object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold py-3 rounded-xl hover:from-cyan-600 hover:to-fuchsia-600 transition-all shadow-lg mt-2"
          >
            APPLY
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
