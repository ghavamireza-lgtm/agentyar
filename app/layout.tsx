// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'ایجنت‌یار | دستیارهای هوشمند فارسی',
    template: '%s | ایجنت‌یار'
  },
  description: 'استفاده از دستیارهای هوش مصنوعی برای کسب‌وکارهای ایرانی',
  keywords: ['هوش مصنوعی', 'دستیار هوشمند', 'کسب و کار', 'املاک', 'بازاریابی'],
  authors: [{ name: 'AgentYar' }],
  creator: 'AgentYar',
  publisher: 'AgentYar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://agentyar.ir'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ایجنت‌یار | دستیارهای هوشمند فارسی',
    description: 'استفاده از دستیارهای هوش مصنوعی برای کسب‌وکارهای ایرانی',
    url: 'https://agentyar.ir',
    siteName: 'ایجنت‌یار',
    locale: 'fa_IR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans antialiased bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}