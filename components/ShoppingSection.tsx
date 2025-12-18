'use client'

import { motion } from 'framer-motion'
import { trackAffiliateClick } from '@/lib/analytics'

interface ShoppingSectionProps {
  carat: number
  shape: string
  position?: 'top' | 'bottom'
}

// Map internal shape names to retailer URL formats
const shapeMapping: Record<string, string> = {
  'round': 'round-cut',
  'princess': 'princess-cut',
  'cushion': 'cushion-cut',
  'oval': 'oval-cut',
  'emerald': 'emerald-cut',
  'pear': 'pear-shaped',
  'asscher': 'asscher-cut',
  'heart': 'heart-shaped',
  'radiant': 'radiant-cut',
  'marquise': 'marquise-cut',
}

// Brilliant Earth affiliate URLs by shape (shape-level deep linking only)
const brilliantEarthUrls: Record<string, string> = {
  round: 'https://brilliantearth.sjv.io/MAZ2YN',
  oval: 'https://brilliantearth.sjv.io/kO59Pv',
  cushion: 'https://brilliantearth.sjv.io/xLBrq3',
  pear: 'https://brilliantearth.sjv.io/POoRqM',
  princess: 'https://brilliantearth.sjv.io/e1Dex6',
  emerald: 'https://brilliantearth.sjv.io/GKaOY6',
  marquise: 'https://brilliantearth.sjv.io/VxnAjJ',
  radiant: 'https://brilliantearth.sjv.io/Z62Le0',
  asscher: 'https://brilliantearth.sjv.io/o4A5ge',
  heart: 'https://brilliantearth.sjv.io/BnjOV0',
}

// Build deep links with shape and carat filtering
const buildRetailerUrl = (retailer: 'bluenile' | 'jamesallen' | 'brilliantearth', carat: number, shape: string): string => {
  const shapeName = shapeMapping[shape.toLowerCase()] || 'round-cut'

  if (retailer === 'bluenile') {
    return `https://www.bluenile.com/diamond-search?CaratFrom=${carat}&CaratTo=${carat}&Shape=${shapeName}&a_aid=6938679a08145&a_cid=55e51e63`
  } else if (retailer === 'jamesallen') {
    return `https://www.jamesallen.com/loose-diamonds/all-diamonds/?Shape=${shapeName}&CaratFrom=${carat}&CaratTo=${carat}&a_aid=6938679a08145&a_cid=dfef9309`
  } else {
    // Brilliant Earth - shape-level affiliate links only (no carat deep linking)
    return brilliantEarthUrls[shape.toLowerCase()] || brilliantEarthUrls.round
  }
}

export default function ShoppingSection({ carat, shape, position = 'top' }: ShoppingSectionProps) {
  const shapeName = shape.charAt(0).toUpperCase() + shape.slice(1)
  const highlightColor = position === 'top' ? 'rgba(7, 244, 255, 0.2)' : 'rgba(250, 6, 255, 0.1)'
  const paddingClass = position === 'top' ? 'pt-16 pb-8' : 'pt-8 pb-16'

  // Build retailer data with dynamic deep links
  const retailers = [
    {
      name: 'Blue Nile',
      logo: '/svg/retailers/blue-nile.svg',
      url: buildRetailerUrl('bluenile', carat, shape)
    },
    {
      name: 'James Allen',
      logo: '/svg/retailers/james-allen.svg',
      url: buildRetailerUrl('jamesallen', carat, shape)
    },
    {
      name: 'Brilliant Earth',
      logo: '/svg/retailers/brilliant-earth.svg',
      url: buildRetailerUrl('brilliantearth', carat, shape)
    },
  ]

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
            Find the Perfect <span className="px-2 py-1 rounded" style={{ backgroundColor: highlightColor }}>{carat} Carat {shapeName}</span> Diamond
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
