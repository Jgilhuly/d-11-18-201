'use client'

import { Input } from './input'
import { Label } from './label'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

interface DatePickerProps {
  label?: string
  value?: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ label, value, onChange, placeholder, className }: DatePickerProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    if (dateValue) {
      onChange(new Date(dateValue))
    } else {
      onChange(null)
    }
  }

  const dateValue = value ? value.toISOString().split('T')[0] : ''

  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Input
        type="date"
        value={dateValue}
        onChange={handleChange}
        placeholder={placeholder || strings.common.selectDate}
        className="mt-1"
      />
    </div>
  )
}

interface DateRangePickerProps {
  startLabel?: string
  endLabel?: string
  startDate?: Date | null
  endDate?: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
  className?: string
}

export function DateRangePicker({
  startLabel,
  endLabel,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className
}: DateRangePickerProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <DatePicker
        label={startLabel || strings.contentRequests.filterStartDate}
        value={startDate}
        onChange={onStartDateChange}
        className="w-full"
      />
      <DatePicker
        label={endLabel || strings.contentRequests.filterEndDate}
        value={endDate}
        onChange={onEndDateChange}
        className="w-full"
      />
    </div>
  )
}

