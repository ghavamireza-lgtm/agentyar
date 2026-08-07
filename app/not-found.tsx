// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">۴۰۴</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">صفحه مورد نظر پیدا نشد</h2>
        <p className="text-gray-600 mb-8">متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.</p>
        <Link href="/" className="btn-primary inline-block">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  )
}