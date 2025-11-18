'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getViewershipStats } from '@/lib/actions/viewership'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { StatsSkeleton } from '@/components/ui/loading-skeletons'
import { notifications } from '@/lib/notifications'

interface ViewershipStatsData {
  totalViews: number
  totalWatchTime: number
  averageCompletionRate: number
  uniqueViewers: number
}

export function ViewershipStats() {
  const { getStrings } = useLocalizedStrings()
  const viewershipStrings = getStrings().viewership
  const [stats, setStats] = useState<ViewershipStatsData>({
    totalViews: 0,
    totalWatchTime: 0,
    averageCompletionRate: 0,
    uniqueViewers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const loadStats = useCallback(async () => {
    try {
      const data = await getViewershipStats()
      setStats({
        totalViews: data.totalViews,
        totalWatchTime: data.totalWatchTime,
        averageCompletionRate: data.averageCompletionRate,
        uniqueViewers: data.uniqueViewers,
      })
    } catch (error) {
      console.error('Failed to load viewership stats:', error)
      notifications.error(
        viewershipStrings.statsLoadError,
        viewershipStrings.statsLoadErrorDescription
      )
    } finally {
      setIsLoading(false)
    }
  }, [viewershipStrings.statsLoadError, viewershipStrings.statsLoadErrorDescription])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  if (isLoading) {
    return <StatsSkeleton count={4} />
  }

  const watchTimeHours = Math.floor(stats.totalWatchTime / 60)
  const watchTimeMinutes = stats.totalWatchTime % 60
  const watchTimeDisplay = watchTimeHours > 0
    ? `${watchTimeHours} ${viewershipStrings.hours} ${watchTimeMinutes > 0 ? `${watchTimeMinutes} ${viewershipStrings.minutes}` : ''}`
    : `${watchTimeMinutes} ${viewershipStrings.minutes}`

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{viewershipStrings.totalViews}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{stats.totalViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalViews === 0 ? viewershipStrings.noMetrics : viewershipStrings.viewsLabel}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{viewershipStrings.totalWatchTime}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">
            {watchTimeDisplay}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalWatchTime === 0
              ? viewershipStrings.noMetrics
              : `${stats.totalWatchTime} ${viewershipStrings.minutes} total`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{viewershipStrings.averageCompletionRate}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">
            {stats.averageCompletionRate.toFixed(1)}{viewershipStrings.percent}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.averageCompletionRate === 0
              ? viewershipStrings.noMetrics
              : viewershipStrings.completionRateLabel}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{viewershipStrings.uniqueViewers}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{stats.uniqueViewers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.uniqueViewers === 0 ? viewershipStrings.noMetrics : viewershipStrings.uniqueViewers}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

