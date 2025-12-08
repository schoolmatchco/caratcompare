import Image from 'next/image'

export default function Header() {
  return (
    <header className="w-full bg-header-black flex items-center justify-center py-6 px-4">
      <div className="relative w-64 h-12">
        <Image
          src="/svg/Logo 3.svg"
          alt="Carat Compare Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </header>
  )
}
