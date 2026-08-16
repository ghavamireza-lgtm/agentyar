import Link from 'next/link'
import type { Agent, Category } from '@/types'
import { getCategories } from '@/lib/db'

const steps = [
  {
    number: '۱',
    title: 'انتخاب دستیار',
    description: 'از بین دستیارهای آماده، بهترین گزینه را انتخاب کنید',
  },
  {
    number: '۲',
    title: 'وارد کردن اطلاعات',
    description: 'اطلاعات مورد نیاز را در فرم ساده وارد کنید',
  },
  {
    number: '۳',
    title: 'دریافت نتیجه',
    description: 'دستیار هوشمند نتیجه را برای شما تولید می‌کند',
  },
]

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <>
      <section className="bg-gradient-to-b from-primary-50 to-white py-16 sm:py-20 md:py-28">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
              دستیار هوش مصنوعی
              <br />
              <span className="text-primary-600">برای کسب‌وکار شما</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              بدون نیاز به تخصص فنی، از قدرت هوش مصنوعی برای رشد کسب‌وکار خود استفاده کنید
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
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

      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="section-title">دستیارهای هوشمند</h2>
            <p className="section-subtitle">
              دستیارهای آماده‌ای که برای نیازهای خاص کسب‌وکار شما طراحی شده‌اند
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            {categories.map((category: Category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="card group transition-all hover:shadow-xl"
              >
                <div className="mb-4 text-5xl sm:text-6xl">{category.icon}</div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900 group-hover:text-primary-600">
                  {category.title}
                </h3>
                <p className="mb-4 text-gray-600">{category.description}</p>

                <div className="flex flex-wrap gap-2">
                  {category.agents.map((agent: Agent) => (
                    <span
                      key={agent.id}
                      className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700"
                    >
                      {agent.name}
                    </span>
                  ))}
                </div>

                <div className="mt-4 inline-block font-medium text-primary-600">
                  مشاهده دستیارها ←
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="section-title">چگونه کار می‌کند؟</h2>
            <p className="section-subtitle">
              در سه مرحله ساده، از قدرت هوش مصنوعی استفاده کنید
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-2xl font-bold text-white shadow-lg shadow-primary-200">
                  {step.number}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <div className="rounded-3xl bg-primary-600 p-8 text-center text-white sm:p-12">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">آماده‌اید شروع کنید؟</h2>
            <p className="mx-auto mb-8 max-w-2xl text-base opacity-90 sm:text-lg">
              یکی از دستیارهای هوشمند را انتخاب کنید و از قدرت هوش مصنوعی برای کسب‌وکار خود استفاده کنید
            </p>
            <Link
              href="/category/real-estate"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-medium text-primary-600 shadow-lg transition-colors hover:bg-gray-100"
            >
              شروع رایگان
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
