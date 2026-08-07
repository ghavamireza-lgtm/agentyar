import Link from 'next/link'
import { categories } from '../data/agents'

export default function HomePage() {
  const steps = [
    {
      number: '۱',
      title: 'انتخاب دستیار',
      description: 'از بین دستیارهای آماده، بهترین گزینه را انتخاب کنید'
    },
    {
      number: '۲',
      title: 'پر کردن اطلاعات',
      description: 'اطلاعات مورد نیاز را در فرم ساده وارد کنید'
    },
    {
      number: '۳',
      title: 'دریافت نتیجه',
      description: 'با یک کلیک، خروجی هوشمند را دریافت کنید'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16 sm:py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              دستیار هوش مصنوعی
              <br />
              <span className="text-primary-600">برای کسب‌وکار شما</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              بدون نیاز به تخصص فنی، از قدرت هوش مصنوعی برای رشد کسب‌وکار خود استفاده کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/category/real-estate" className="btn-primary">
                شروع کنید
              </Link>
              <Link href="/pricing" className="btn-outline">
                مشاهده تعرفه‌ها
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">دستیارهای هوشمند</h2>
            <p className="section-subtitle">
              دستیارهای آماده‌ای که برای نیازهای خاص کسب‌وکار شما طراحی شده‌اند
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {Object.values(categories).map((category: { id: string; icon: string; title: string; description: string; agents: { id: string; name: string }[] }) => (
              <Link 
                key={category.id}
                href={`/category/${category.id}`}
                className="card hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-5xl sm:text-6xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.agents.map((agent: { id: string; name: string }) => (
                    <span 
                      key={agent.id}
                      className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
                    >
                      {agent.name}
                    </span>
                    
                  ))}
                </div>
                <div className="mt-4 text-primary-600 font-medium group-hover:mr-2 transition-all inline-block">
                  مشاهده دستیارها ←
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">چگونه کار می‌کند؟</h2>
            <p className="section-subtitle">
              در سه مرحله ساده، از قدرت هوش مصنوعی استفاده کنید
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-primary-200">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <div className="bg-primary-600 rounded-3xl p-8 sm:p-12 text-center text-blue">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">آماده‌اید شروع کنید؟</h2>
            <p className="text-base sm:text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              همین حالا یکی از دستیارهای هوشمند را انتخاب کنید و از قدرت هوش مصنوعی برای کسب‌وکار خود استفاده کنید
            </p>
            <Link 
              href="/category/real-estate" 
              className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              شروع رایگان
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}