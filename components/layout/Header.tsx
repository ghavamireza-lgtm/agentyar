'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const navigation = [
  { name: 'خانه', href: '/' },
  { name: 'املاک', href: '/category/real-estate' },
  { name: 'بازاریابی', href: '/category/marketing' },
  { name: 'شبکه اجتماعی', href: '/category/social' },
  { name: 'تعرفه‌ها', href: '/pricing' },
]

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(Boolean(data.user))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user))
    })

    return () => subscription.unsubscribe()
  }, [])

  const is_active = (path: string) => {
    if (path === '/') return pathname === path
    return pathname?.startsWith(path) ?? false
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm font-bold text-white">یا</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ایجنت‌لاین</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  is_active(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              {isAuthenticated ? 'داشبورد' : 'ورود'}
            </Link>
          </nav>

          <button
            className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="منو"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 text-base font-medium ${
                  is_active(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              className="mt-2 block border-t border-gray-100 pt-3 font-medium text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {isAuthenticated ? 'داشبورد' : 'ورود'}
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
