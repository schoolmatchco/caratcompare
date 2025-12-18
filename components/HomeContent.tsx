'use client'

import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import ComparisonArea from '@/components/ComparisonArea'
import DiamondFAQ from '@/components/DiamondFAQ'
import Footer from '@/components/Footer'
import { capitalize, formatCaratForDisplay } from '@/lib/urlHelpers'

export default function HomeContent() {
  const searchParams = useSearchParams()

  // Valid carat options (must match ChangeModal)
  const validCarats = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75, 4.00]
  const validShapes = ['round', 'princess', 'cushion', 'emerald', 'asscher', 'oval', 'pear', 'marquise', 'radiant', 'heart']

  // Snap carat to nearest valid increment
  const snapToValidCarat = (carat: number) => {
    const clamped = Math.max(0.25, Math.min(4.00, carat))
    return validCarats.reduce((prev, curr) =>
      Math.abs(curr - clamped) < Math.abs(prev - clamped) ? curr : prev
    )
  }

  // Static defaults (consistent for SSR hydration)
  const defaults = {
    randomCarat1: 0.5,
    randomShape1: 'heart',
    randomCarat2: 1.25,
    randomShape2: 'round'
  }

  // Get initial values from URL or use defaults, ensuring valid carats
  const carat1 = snapToValidCarat(parseFloat(searchParams.get('carat1') || String(defaults.randomCarat1)))
  const shape1 = searchParams.get('shape1') || defaults.randomShape1
  const carat2 = snapToValidCarat(parseFloat(searchParams.get('carat2') || String(defaults.randomCarat2)))
  const shape2 = searchParams.get('shape2') || defaults.randomShape2

  return (
    <main className="min-h-screen bg-main-gray">
      <Header />

      <ComparisonArea
        initialCarat1={carat1}
        initialShape1={shape1}
        initialCarat2={carat2}
        initialShape2={shape2}
      />

      {/* FAQ section */}
      <DiamondFAQ />

      {/* Footer */}
      <Footer />
    </main>
  )
}
