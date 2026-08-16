'use client'

import { useState } from 'react'
import type { Agent, FormField } from '@/types'

interface AgentFormProps {
  agent: Agent
}

function FormFieldInput({
  field,
  value,
  onChange,
}: {
  field: FormField
  value: string
  onChange: (value: string) => void
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
      className={baseClass}
    />
  )
}

export default function AgentForm({ agent }: AgentFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setOutput(null)
    setError(null)

    try {
      const response = await fetch(`/api/agents/${agent.slug}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: formData }),
      })

      const data = await response.json()

      if (response.status === 401) {
        const next = encodeURIComponent(`/agent/${agent.slug}`)
        window.location.href = `/login?next=${next}`
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'اجرای دستیار ناموفق بود.')
      }

      setOutput(data.output ?? '')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'خطایی هنگام اجرای دستیار رخ داد.',
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
              {field.required && <span className="mr-1 text-red-500">*</span>}
            </label>

            <FormFieldInput
              field={field}
              value={formData[field.id] ?? ''}
              onChange={(value) => handleChange(field.id, value)}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full sm:w-auto"
        >
          {loading ? 'در حال پردازش...' : 'دریافت نتیجه'}
        </button>
      </form>

      {error && (
        <div className="card border border-red-200 bg-red-50 text-red-700">
          {error}
        </div>
      )}

      {output && (
        <div className="card border border-primary-200 bg-primary-50">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">نتیجه</h3>
            <span className="text-xs font-medium text-green-700">انجام شد</span>
          </div>

          <div className="whitespace-pre-wrap rounded-xl border border-gray-200 bg-white p-6 leading-8 text-gray-800">
            {output}
          </div>
        </div>
      )}
    </div>
  )
}
