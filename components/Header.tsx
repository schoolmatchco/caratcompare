'use client'

import Image from 'next/image'
import Link from 'next/link'
import { trackLogoClick } from '@/lib/analytics'

export default function Header() {
  return (
    <header className="w-full bg-header-black flex items-center justify-center py-6 px-4">
      <Link
        href="/"
        onClick={trackLogoClick}
        className="relative w-64 h-12 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <Image
          src="/svg/Logo 3.svg"
          alt="Carat Compare Logo"
          fill
          className="object-contain"
          priority
        />
      </Link>
    </header>
  )
}
