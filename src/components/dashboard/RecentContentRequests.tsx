'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getContentRequests } from '@/lib/actions/content-requests'
import { getPriorities, getContentRequestStatuses } from '@/lib/constants'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface ContentRequest {
  id: string
  title: string
  priority: string
  status: string
  category: string
  createdAt: Date
  viewer: { id: string; name: string; email: string }
}

export function RecentContentRequests() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [recentContentRequests, setRecentContentRequests] = useState<ContentRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadRecentContentRequests = useCallback(async () => {
    if (!user) return
    
    try {
      const requests = await getContentRequests(user.id, user.role)
      const recent = requests.slice(0, 5)
      setRecentContentRequests(recent)
    } catch (error) {
      console.error('Failed to load recent content requests:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadRecentContentRequests()
    }
  }, [user, loadRecentContentRequests])

  const getPriorityColor = (priority: string) => {
    const priorityData = getPriorities(strings).find(p => p.value === priority)
    return priorityData?.color || 'bg-muted text-muted-foreground'
  }

  const getStatusColor = (status: string) => {
    const statusData = getContentRequestStatuses(strings).find(s => s.value === status)
    return statusData?.color || 'bg-muted text-muted-foreground'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{strings.dashboard.recentContentRequests}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">{strings.common.loading}</div>
        </CardContent>
      </Card>
    )
  }

  if (recentContentRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{strings.dashboard.recentContentRequests}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            {strings.dashboard.noContentRequestsYet}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{strings.dashboard.recentContentRequests}</CardTitle>
        <Link href="/content-requests">
          <Button variant="outline" size="sm">
            {strings.dashboard.viewAll}
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentContentRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{request.title}</h4>
                  <Badge className={getPriorityColor(request.priority)}>
                    {getPriorities(strings).find(p => p.value === request.priority)?.label || request.priority}
                  </Badge>
                  <Badge className={getStatusColor(request.status)}>
                    {getContentRequestStatuses(strings).find(s => s.value === request.status)?.label || request.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {request.category} • {request.viewer.name} • {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

