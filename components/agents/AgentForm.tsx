'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Agent, FormField } from '@/types'

interface AgentFormProps {
  agent: Agent
}

interface ApiResponse {
  success: boolean
  output?: string
  error?: string
  run_id?: string
}

function FormFieldInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FormField
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const baseClass = 'input-field'

  if (field.type === 'textarea') {
    return (
      <textarea
        id={field.id}
        name={field.id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        disabled={disabled}
        rows={4}
        className={baseClass}
      />
    )
  }

  if (field.type === 'select') {
    return (
      <select
        id={field.id}
        name={field.id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        disabled={disabled}
        className={baseClass}
      >
        <option value="">انتخاب کنید...</option>
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }

  return (
    <input
      id={field.id}
      name={field.id}
      type={field.type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      disabled={disabled}
      className={baseClass}
    />
  )
}

export default function AgentForm({ agent }: AgentFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agent.id,
          input: formData,
        }),
      })

      const data: ApiResponse = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'خطایی رخ داد')
        return
      }

      setResponse(data)
      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'خطایی در ارتباط با سرور رخ داد'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="card space-y-6">
        {agent.fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="input-label">
              {field.label}
              {field.required && <span className="text-red-500 mr-1">*</span>}
            </label>
            <FormFieldInput
              field={field}
              value={formData[field.id] ?? ''}
              onChange={(value) => handleChange(field.id, value)}
              disabled={loading}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'در حال پردازش...' : 'دریافت نتیجه'}
        </button>
      </form>

      {error && (
        <div className="card border-red-200 bg-red-50">
          <div className="flex gap-4">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-red-900">خطا</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              {error.includes('وارد حساب') && (
                <Link
                  href="/login"
                  className="mt-3 inline-block text-sm font-medium text-red-600 hover:text-red-700"
                >
                  ورود به حساب ←
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {submitted && response && (
        <div className="card border-green-200 bg-green-50">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-bold text-green-900">✅ نتیجه دریافت شد</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              ID: {response.run_id}
            </span>
          </div>
          <div className="rounded-xl bg-white border border-green-200 p-6 text-gray-800 text-right whitespace-pre-wrap text-sm leading-relaxed">
            {response.output}
          </div>
          <button
            onClick={() => {
              setSubmitted(false)
              setFormData({})
              setResponse(null)
            }}
            className="mt-4 text-sm font-medium text-green-600 hover:text-green-700"
          >
            سوال جدید ←
          </button>
        </div>
      )}
    </div>
  )
}
