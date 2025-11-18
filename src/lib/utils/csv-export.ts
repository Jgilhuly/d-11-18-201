export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: keyof T; header: string }[]
): string {
  if (data.length === 0) {
    return columns.map((col) => escapeCSVValue(col.header)).join(',')
  }

  const headers = columns.map((col) => escapeCSVValue(col.header)).join(',')

  const rows = data.map((row) => {
    return columns
      .map((col) => {
        const value = row[col.key]
        return escapeCSVValue(formatValue(value))
      })
      .join(',')
  })

  return [headers, ...rows].join('\n')
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

function escapeCSVValue(value: string): string {
  if (
    value.includes(',') ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r')
  ) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export function generateFilename(prefix: string): string {
  const date = new Date()
  const dateString = date.toISOString().split('T')[0]
  return `${prefix}-${dateString}.csv`
}

