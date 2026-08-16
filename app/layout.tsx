// src/app/layout.tsx

import localFont from "next/font/local";
import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const iranSans = localFont({
  src: [
    {
      path: "../fonts/IRANSans/IRANSans-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/IRANSans/IRANSans.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/IRANSans/IRANSans-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/IRANSans/IRANSans-black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-iran-sans",
});

export const metadata: Metadata = {
  title: {
    default: 'ایجنت‌لاین | دستیارهای هوشمند فارسی',
    template: '%s | ایجنت‌لاین'
  },
  description: 'استفاده از دستیارهای هوش مصنوعی برای کسب‌وکارهای ایرانی',
  keywords: ['هوش مصنوعی', 'دستیار هوشمند', 'کسب و کار', 'املاک', 'بازاریابی'],
  authors: [{ name: 'AgentLine' }],
  creator: 'AgentLine',
  publisher: 'AgentLine',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://agentline.ir'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ایجنت‌لاین | دستیارهای هوشمند فارسی',
    description: 'استفاده از دستیارهای هوش مصنوعی برای کسب‌وکارهای ایرانی',
    url: 'https://agentline.ir',
    siteName: 'ایجنت‌لاین',
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
      <body className={`${iranSans.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}