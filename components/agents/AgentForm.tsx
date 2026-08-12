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
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
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
            />
          </div>
        ))}

        <button type="submit" className="btn-primary w-full sm:w-auto">
          دریافت نتیجه
        </button>
      </form>

      {submitted && (
        <div className="card border-primary-200 bg-primary-50">
          <h3 className="text-lg font-bold text-gray-900 mb-3">نتیجه</h3>
          <div className="rounded-xl bg-white border border-gray-200 p-6 text-gray-500 text-center">
            <p className="text-4xl mb-3">🤖</p>
            <p className="text-sm leading-relaxed">
              پاسخ هوش مصنوعی به‌زودی اینجا نمایش داده می‌شود.
              <br />
              اتصال به سرویس AI در مرحله بعد فعال خواهد شد.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
