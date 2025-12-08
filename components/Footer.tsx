import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="w-full bg-header-black flex flex-col items-center justify-center py-12 px-4">
      <div className="relative w-48 h-9 mb-6">
        <Image
          src="/svg/Logo 3.svg"
          alt="Carat Compare Logo"
          fill
          className="object-contain"
          style={{ filter: 'brightness(0) saturate(100%) invert(60%)' }}
        />
      </div>
      <p className="text-gray-400 text-xs text-center">
        This website may contain affiliate links. We may earn a commission when you click on or make purchases via these links, at no additional cost to you.
      </p>
    </footer>
  )
}
