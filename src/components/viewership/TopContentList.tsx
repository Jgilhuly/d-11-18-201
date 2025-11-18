'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getViewershipStats } from '@/lib/actions/viewership'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { notifications } from '@/lib/notifications'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function TopContentList() {
  const { getStrings } = useLocalizedStrings()
  const viewershipStrings = getStrings().viewership
  const [topContent, setTopContent] = useState<Array<{
    content: { id: string; name: string; type: string; posterUrl: string | null }
    views: number
    watchTime: number
    completionRate: number
  }>>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const stats = await getViewershipStats()
      setTopContent(stats.topContent)
    } catch (error) {
      console.error('Failed to load top content:', error)
      notifications.error(
        viewershipStrings.statsLoadError,
        viewershipStrings.statsLoadErrorDescription
      )
    } finally {
      setIsLoading(false)
    }
  }, [viewershipStrings.statsLoadError, viewershipStrings.statsLoadErrorDescription])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{viewershipStrings.topContent}</CardTitle>
          <CardDescription>Most viewed content by viewership metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (topContent.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{viewershipStrings.topContent}</CardTitle>
          <CardDescription>Most viewed content by viewership metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {viewershipStrings.noMetrics}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{viewershipStrings.topContent}</CardTitle>
        <CardDescription>Most viewed content by viewership metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{viewershipStrings.contentName}</TableHead>
              <TableHead className="text-right">{viewershipStrings.views}</TableHead>
              <TableHead className="text-right">{viewershipStrings.watchTime}</TableHead>
              <TableHead className="text-right">{viewershipStrings.completion}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topContent.map((item) => (
              <TableRow key={item.content.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={item.content.posterUrl || undefined}
                        alt={item.content.name}
                      />
                      <AvatarFallback>
                        {item.content.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{item.content.name}</div>
                      <div className="text-sm text-muted-foreground">{item.content.type}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.views.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {Math.floor(item.watchTime / 60)} {viewershipStrings.hours}{' '}
                  {item.watchTime % 60} {viewershipStrings.minutes}
                </TableCell>
                <TableCell className="text-right">
                  {item.completionRate.toFixed(1)}{viewershipStrings.percent}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

