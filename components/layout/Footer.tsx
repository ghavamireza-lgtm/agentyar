// src/components/layout/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">یا</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ایجنت‌لاین</span>
            </Link>
            <p className="text-gray-600 text-sm">
              دستیارهای هوشمند فارسی برای کسب‌وکارهای ایرانی
            </p>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">خانه</Link></li>
              <li><Link href="/category/real-estate" className="hover:text-blue-600 transition-colors">املاک</Link></li>
              <li><Link href="/category/marketing" className="hover:text-blue-600 transition-colors">بازاریابی</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600 transition-colors">تعرفه‌ها</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/category/real-estate" className="hover:text-blue-600 transition-colors">املاک</Link></li>
              <li><Link href="/category/marketing" className="hover:text-blue-600 transition-colors">فروش و بازاریابی</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">ارتباط با ما</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>ایمیل: support@agentline.ir</li>
              <li>تلگرام: @AgentLine</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {currentYear} ایجنت‌لاین. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  )
}