'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getContentRequests } from '@/lib/actions/content-requests'
import { getContent } from '@/lib/actions/content'
import { getBugs } from '@/lib/actions/bugs'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { StatsSkeleton } from '@/components/ui/loading-skeletons'
import { notifications } from '@/lib/notifications'

import { ContentRequest, Content, Bug } from '@/lib/types'

interface DashboardStatsData {
  totalContentRequests: number
  pendingContentRequests: number
  totalContent: number
  featuredContent: number
  totalBugs: number
  openBugs: number
}

export function DashboardStats() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const dashboardStrings = getStrings().dashboard
  const [stats, setStats] = useState<DashboardStatsData>({
    totalContentRequests: 0,
    pendingContentRequests: 0,
    totalContent: 0,
    featuredContent: 0,
    totalBugs: 0,
    openBugs: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const loadStats = useCallback(async () => {
    if (!user) return
    
    try {
      const [contentRequests, content, bugs] = await Promise.all([
        getContentRequests(user.id, user.role),
        getContent(),
        getBugs(user.id, user.role),
      ])

      const pendingRequests = contentRequests.filter((request: ContentRequest) => request.status === 'PENDING').length
      const featured = content.filter((item: Content) => item.status === 'FEATURED').length
      const openBugCount = bugs.filter((bug: Bug) => bug.status === 'OPEN').length

      setStats({
        totalContentRequests: contentRequests.length,
        pendingContentRequests: pendingRequests,
        totalContent: content.length,
        featuredContent: featured,
        totalBugs: bugs.length,
        openBugs: openBugCount,
      })
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
      notifications.error(dashboardStrings.statsLoadError, dashboardStrings.statsLoadErrorDescription)
    } finally {
      setIsLoading(false)
    }
  }, [user, dashboardStrings.statsLoadError, dashboardStrings.statsLoadErrorDescription])

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user, loadStats])

  if (isLoading) {
    return <StatsSkeleton count={6} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dashboardStrings.totalContentRequests}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{stats.totalContentRequests}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalContentRequests === 0 ? dashboardStrings.noContentRequestsYet : `${stats.pendingContentRequests} pending`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dashboardStrings.pendingContentRequests}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{stats.pendingContentRequests}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingContentRequests === 0 ? dashboardStrings.noPendingRequests : dashboardStrings.requiresAttention}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dashboardStrings.totalContent}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{stats.totalContent}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalContent === 0 ? dashboardStrings.noContentYet : dashboardStrings.moviesAndShows}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dashboardStrings.featuredContent}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{stats.featuredContent}</div>
          <p className="text-xs text-muted-foreground">
            {stats.featuredContent === 0 ? dashboardStrings.noFeaturedContent : dashboardStrings.currentlyFeatured}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dashboardStrings.bugReports}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{stats.totalBugs}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalBugs === 0 ? dashboardStrings.noBugsReported : `${stats.openBugs} ${dashboardStrings.openBugsCount}`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dashboardStrings.openBugs}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{stats.openBugs}</div>
          <p className="text-xs text-muted-foreground">
            {stats.openBugs === 0 ? dashboardStrings.allBugsResolved : dashboardStrings.outOfTotal.replace('{total}', stats.totalBugs.toString())}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
