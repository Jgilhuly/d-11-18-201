import { ContentRequest, Content } from '@/lib/types'
import { subDays, format, startOfDay, isWithinInterval } from 'date-fns'

export interface TrendDataPoint {
  date: string
  count: number
}

export interface DistributionDataPoint {
  name: string
  value: number
  fill: string
}

const CHART_COLORS = {
  chart1: 'hsl(var(--chart-1))',
  chart2: 'hsl(var(--chart-2))',
  chart3: 'hsl(var(--chart-3))',
  chart4: 'hsl(var(--chart-4))',
  chart5: 'hsl(var(--chart-5))',
}

export function aggregateContentRequestTrends(
  contentRequests: ContentRequest[],
  days: number = 30
): TrendDataPoint[] {
  const endDate = new Date()
  const startDate = subDays(endDate, days - 1)

  const dateMap = new Map<string, number>()
  
  for (let i = 0; i < days; i++) {
    const date = subDays(endDate, days - 1 - i)
    const dateStr = format(date, 'MMM dd')
    dateMap.set(dateStr, 0)
  }

  contentRequests.forEach((request) => {
    const requestDate = new Date(request.createdAt)
    if (isWithinInterval(requestDate, { start: startOfDay(startDate), end: endDate })) {
      const dateStr = format(requestDate, 'MMM dd')
      const currentCount = dateMap.get(dateStr) || 0
      dateMap.set(dateStr, currentCount + 1)
    }
  })

  return Array.from(dateMap.entries()).map(([date, count]) => ({
    date,
    count,
  }))
}

export function aggregatePriorityDistribution(
  contentRequests: ContentRequest[]
): DistributionDataPoint[] {
  const priorityCounts = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  }

  contentRequests.forEach((request) => {
    priorityCounts[request.priority]++
  })

  return [
    { name: 'Low', value: priorityCounts.LOW, fill: CHART_COLORS.chart4 },
    { name: 'Medium', value: priorityCounts.MEDIUM, fill: CHART_COLORS.chart5 },
    { name: 'High', value: priorityCounts.HIGH, fill: CHART_COLORS.chart3 },
    { name: 'Critical', value: priorityCounts.CRITICAL, fill: CHART_COLORS.chart2 },
  ].filter((item) => item.value > 0)
}

export function aggregateStatusDistribution(
  contentRequests: ContentRequest[]
): DistributionDataPoint[] {
  const statusCounts = {
    PENDING: 0,
    IN_REVIEW: 0,
    APPROVED: 0,
    ADDED: 0,
  }

  contentRequests.forEach((request) => {
    statusCounts[request.status]++
  })

  return [
    { name: 'Pending', value: statusCounts.PENDING, fill: CHART_COLORS.chart5 },
    { name: 'In Review', value: statusCounts.IN_REVIEW, fill: CHART_COLORS.chart3 },
    { name: 'Approved', value: statusCounts.APPROVED, fill: CHART_COLORS.chart1 },
    { name: 'Added', value: statusCounts.ADDED, fill: CHART_COLORS.chart4 },
  ].filter((item) => item.value > 0)
}

export function aggregateContentTypeDistribution(
  content: Content[]
): DistributionDataPoint[] {
  const typeCounts: Record<string, number> = {}

  content.forEach((item) => {
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1
  })

  const colors = [
    CHART_COLORS.chart1,
    CHART_COLORS.chart2,
    CHART_COLORS.chart3,
    CHART_COLORS.chart4,
    CHART_COLORS.chart5,
  ]

  return Object.entries(typeCounts)
    .map(([type, count], index) => ({
      name: formatContentType(type),
      value: count,
      fill: colors[index % colors.length],
    }))
    .sort((a, b) => b.value - a.value)
}

function formatContentType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

