import type { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

export const metadata: Metadata = {
  title: 'Carat Compare | Diamond Size Comparison Tool',
  description: 'Visually compare diamond sizes and shapes. See actual size comparisons with measurements. Shop from Blue Nile, James Allen, and Brilliant Earth.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-lato">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
