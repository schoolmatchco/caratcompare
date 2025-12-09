'use client'

import { motion } from 'framer-motion'

interface DiamondDisplayProps {
  carat: number
  shape: string
  width: number
  height: number
  position?: 'left' | 'right'
}

export default function DiamondDisplay({ carat, shape, width, height, position = 'left' }: DiamondDisplayProps) {
  const shapeName = shape.charAt(0).toUpperCase() + shape.slice(1)
  const scale = 5

  // For elongated shapes (width > height), rotate 90deg so longest dimension is horizontal
  const needsRotation = width > height

  // SVG container dimensions (swapped for rotation)
  const containerWidth = needsRotation ? height * scale : width * scale
  const containerHeight = needsRotation ? width * scale : height * scale

  // Dimension line should measure the VISUAL horizontal width after rotation
  // For rotated shapes, this is the original width; for non-rotated, it's also width
  const visualWidth = width * scale
  const measurementValue = width

  // Format carat: show .25/.75 with 2 decimals, whole numbers and .5 with 1 decimal
  const formatCarat = (c: number) => {
    if (c % 1 === 0 || c % 1 === 0.5) return c.toFixed(1)
    return c.toFixed(2)
  }

  // Color based on position
  const textColor = position === 'left' ? '#07F4FF' : '#FA06FF'

  return (
    <div className="flex flex-col items-center">
      {/* Width measurement with horizontal line - FIXED HEIGHT */}
      <div className="flex flex-col items-center justify-end mb-6" style={{ height: '44px' }}>
        <motion.p
          key={`width-${carat}-${shape}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-white text-sm mb-2"
        >
          ~ {measurementValue.toFixed(1)} mm
        </motion.p>
        {/* Horizontal line with tick marks */}
        <div className="flex items-center" style={{ width: `${Math.min(visualWidth, 100)}px` }}>
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

      {/* Diamond SVG - FLEXIBLE HEIGHT */}
      <div className="flex items-center justify-center mb-8" style={{ minHeight: '100px' }}>
        <motion.div
          key={`diamond-${shape}`}
          initial={{ scale: 0.95, opacity: 0.85 }}
          animate={{
            scale: 1,
            opacity: 1,
            width: `${containerWidth}px`,
            height: `${containerHeight}px`
          }}
          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          style={{
            maxWidth: '100px',
            maxHeight: '100px',
          }}
        >
          <img
            src={`/svg/diamonds/${shapeName}.svg?v=${Date.now()}`}
            alt={`${carat} carat ${shapeName} diamond`}
            className="w-full h-full object-fill"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))',
              transform: needsRotation ? 'rotate(90deg)' : 'none'
            }}
          />
        </motion.div>
      </div>

      {/* Carat and Shape Label with Shop Button - FIXED HEIGHT with colored text */}
      <motion.div
        key={`label-${carat}-${shape}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-center flex flex-col items-center justify-center gap-3"
        style={{ height: '64px' }}
      >
        <div>
          <p className="text-3xl font-black leading-tight" style={{ color: textColor }}>
            {formatCarat(carat)}
          </p>
          <p className="text-xl font-normal" style={{ color: textColor }}>
            {shapeName.toUpperCase()}
          </p>
        </div>
        <motion.a
          href="#shopping"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(30, 30, 30, 0.9)' }}
          whileTap={{ scale: 0.98 }}
          className="px-2 py-1 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: '#1E1E1E',
            border: `2px solid ${textColor}`,
            color: textColor
          }}
        >
          SHOP
        </motion.a>
      </motion.div>
    </div>
  )
}
