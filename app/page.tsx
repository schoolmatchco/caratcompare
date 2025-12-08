import { Suspense } from 'react'
import HomeContent from '@/components/HomeContent'

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-main-gray" />}>
      <HomeContent />
    </Suspense>
  )
}
