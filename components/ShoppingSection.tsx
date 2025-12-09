'use client'

import { motion } from 'framer-motion'
import { trackAffiliateClick } from '@/lib/analytics'

interface ShoppingSectionProps {
  carat: number
  shape: string
  position?: 'top' | 'bottom'
}

const retailers = [
  { name: 'Blue Nile', logo: '/svg/retailers/blue-nile.svg', url: 'https://bluenile.com/diamond-search?a_aid=6938679a08145' },
  { name: 'James Allen', logo: '/svg/retailers/james-allen.svg', url: 'https://jamesallen.com/loose-diamonds/all-diamonds/?a_aid=6938679a08145' },
]

export default function ShoppingSection({ carat, shape, position = 'top' }: ShoppingSectionProps) {
  const shapeName = shape.charAt(0).toUpperCase() + shape.slice(1)
  const highlightColor = position === 'top' ? 'rgba(7, 244, 255, 0.2)' : 'rgba(250, 6, 255, 0.1)'
  const paddingClass = position === 'top' ? 'pt-16 pb-8' : 'pt-8 pb-16'

  return (
    <motion.div
      key={`shopping-${carat}-${shape}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-full bg-shopping-gray ${paddingClass} px-4`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Heading - Centered with highlighted carat/shape, 25% bigger */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src="/svg/gift.svg" alt="Gift" className="w-7 h-7" style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(8%) saturate(1000%) hue-rotate(180deg)' }} />
          <h2 className="text-xl font-bold text-gray-800" style={{ marginTop: '5px' }}>
            Shop <span className="px-2 py-1 rounded" style={{ backgroundColor: highlightColor }}>{carat} Carat {shapeName}</span>
          </h2>
        </div>

        {/* Retailer Rows - More space on mobile */}
        <div className="space-y-3 px-2 md:px-0">
          {retailers.map((retailer, index) => (
            <motion.div
              key={retailer.name}
              className="flex items-center justify-between gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Logo Button - Responsive sizing */}
              <motion.a
                href={retailer.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAffiliateClick(retailer.name, carat, shape, 'logo')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center bg-gray-800 text-white px-4 py-2.5 md:px-4 md:py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <img
                  src={retailer.logo}
                  alt={retailer.name}
                  className="h-3.5 md:h-4 object-contain brightness-0 invert"
                />
              </motion.a>

              {/* Check Prices Link */}
              <motion.a
                href={retailer.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAffiliateClick(retailer.name, carat, shape, 'text')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="text-gray-900 font-medium hover:text-gray-700 transition-colors underline text-sm md:text-base"
              >
                Check Prices →
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
