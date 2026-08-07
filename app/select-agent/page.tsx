// app/select-agent/page.tsx
import Link from 'next/link'
import { agentsList } from '../../data/agents'

export default function SelectAgentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            انتخاب دستیار هوشمند
          </h1>
          <p className="text-gray-600 text-lg">
            یکی از دستیارهای زیر را انتخاب کنید تا شروع کنیم
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agentsList.map((agent) => (
            <Link
              key={agent.id}
              href={`/agent/${agent.id}/activate`}
              className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
            >
              <div className="text-5xl mb-4">{agent.icon}</div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {agent.name}
              </h2>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                {agent.description}
              </p>

              <div className="mt-auto">
                <span className="inline-flex items-center text-primary-600 font-medium group-hover:gap-2 transition-all">
                  انتخاب این دستیار
                  <span className="mr-1 group-hover:mr-0 transition-all">←</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Back link */}
        <div className="text-center mt-10">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm">
            ← بازگشت به داشبورد
          </Link>
        </div>
      </div>
    </div>
  )
}