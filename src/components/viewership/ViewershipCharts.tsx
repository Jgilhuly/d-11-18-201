'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getViewershipTrends, getViewershipStats } from '@/lib/actions/viewership'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { notifications } from '@/lib/notifications'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format, parseISO } from 'date-fns'

interface TrendDataPoint {
  date: string
  views: number
  watchTime: number
}

export function ViewershipCharts() {
  const { getStrings } = useLocalizedStrings()
  const viewershipStrings = getStrings().viewership
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([])
  const [topContent, setTopContent] = useState<Array<{
    content: { id: string; name: string; type: string; posterUrl: string | null }
    views: number
    watchTime: number
    completionRate: number
  }>>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [trends, stats] = await Promise.all([
        getViewershipTrends(30),
        getViewershipStats(),
      ])

      const formattedTrends = trends.map((item) => ({
        date: format(parseISO(item.date), 'MMM dd'),
        views: item.views,
        watchTime: Math.round(item.watchTime / 60 * 10) / 10,
      }))

      setTrendData(formattedTrends)
      setTopContent(stats.topContent.slice(0, 10))
    } catch (error) {
      console.error('Failed to load viewership charts:', error)
      notifications.error(
        viewershipStrings.chartsLoadError,
        viewershipStrings.chartsLoadErrorDescription
      )
    } finally {
      setIsLoading(false)
    }
  }, [viewershipStrings.chartsLoadError, viewershipStrings.chartsLoadErrorDescription])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{viewershipStrings.viewershipTrends}</CardTitle>
        </CardHeader>
        <CardContent>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    color: 'hsl(var(--card-foreground))',
                  }}
                  labelStyle={{ color: 'hsl(var(--card-foreground))' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
                  activeDot={{ r: 6 }}
                  name={viewershipStrings.viewsLabel}
                />
                <Line
                  type="monotone"
                  dataKey="watchTime"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                  activeDot={{ r: 6 }}
                  name={viewershipStrings.watchTimeLabel}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {viewershipStrings.noTrendData}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{viewershipStrings.topContent}</CardTitle>
        </CardHeader>
        <CardContent>
          {topContent.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topContent.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="content.name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    color: 'hsl(var(--card-foreground))',
                  }}
                  labelStyle={{ color: 'hsl(var(--card-foreground))' }}
                />
                <Legend />
                <Bar
                  dataKey="views"
                  fill="hsl(var(--chart-1))"
                  name={viewershipStrings.viewsLabel}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {viewershipStrings.noMetrics}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

