import type { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { WebsiteSchema, OrganizationSchema } from '@/components/StructuredData'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.caratcompare.co'),
  title: 'Carat Compare | Diamond Size Comparison Tool',
  description: 'Visually compare diamond sizes and shapes. See actual size comparisons with measurements. Shop from Blue Nile, James Allen, and Brilliant Earth.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/favicon.ico', sizes: '180x180', type: 'image/x-icon' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.ico',
        color: '#000000',
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'p:domain_verify': 'feb1e0f6599aedc42650e268e1ec6626',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <WebsiteSchema />
        <OrganizationSchema />
      </head>
      <body className="font-lato">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
