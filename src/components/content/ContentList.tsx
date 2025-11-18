'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getContentStatuses } from '@/lib/constants'
import { getContent, updateContentStatus, assignContent } from '@/lib/actions/content'
import { formatDistanceToNow } from 'date-fns'
import { TableSkeleton } from '@/components/ui/loading-skeletons'
import { notifications, NOTIFICATION_MESSAGES } from '@/lib/notifications'

interface Content {
  id: string
  name: string
  type: string
  genre: string
  status: string
  releaseDate?: Date
  duration?: number
  rating?: string
  posterUrl?: string
  description?: string
  createdAt: Date
  assignedUser?: { id: string; name: string; email: string }
}

export function ContentList() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [content, setContent] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const contentData = await getContent()
      setContent(contentData)
    } catch (error) {
      console.error('Failed to load content:', error)
      notifications.error('Failed to load content', 'Please refresh the page to try again')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (contentId: string, newStatus: string) => {
    const loadingToast = notifications.loading('Updating content status...')
    try {
      await updateContentStatus(contentId, newStatus)
      await loadContent()
      notifications.dismiss(loadingToast)
      notifications.success(NOTIFICATION_MESSAGES.CONTENT_UPDATED, 'Content status updated successfully')
    } catch (error) {
      notifications.dismiss(loadingToast)
      console.error('Failed to update content status:', error)
      notifications.error('Error', 'Failed to update content status')
    }
  }

  const handleAssignment = async (contentId: string, assignedUserId: string | null) => {
    const loadingToast = notifications.loading('Updating content assignment...')
    try {
      await assignContent(contentId, assignedUserId)
      await loadContent()
      notifications.dismiss(loadingToast)
      notifications.success(NOTIFICATION_MESSAGES.CONTENT_ASSIGNED, 'Content assignment updated successfully')
    } catch (error) {
      notifications.dismiss(loadingToast)
      console.error('Failed to assign content:', error)
      notifications.error('Error', 'Failed to update content assignment')
    }
  }

  const getStatusColor = (status: string) => {
    const statusData = getContentStatuses(strings).find(s => s.value === status)
    return statusData?.color || 'bg-muted text-muted-foreground'
  }

  if (isLoading) {
    return <TableSkeleton rows={3} />
  }

  if (content.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            {strings.content.noContent}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {content.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <div className="flex items-start gap-4">
                  {item.posterUrl && (
                    <div className="relative w-24 h-36 flex-shrink-0">
                      <Image 
                        src={item.posterUrl} 
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                        sizes="96px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {item.type} • {item.genre}
                      {item.duration && ` • ${item.duration} min`}
                      {item.rating && ` • ${item.rating}`}
                    </CardDescription>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(item.status)}>
                {getContentStatuses(strings).find(s => s.value === item.status)?.label || item.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">{strings.common.createdAt}:</span> {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </div>
              {item.releaseDate && (
                <div>
                  <span className="font-medium">{strings.content.releaseDate}:</span> {new Date(item.releaseDate).toLocaleDateString()}
                </div>
              )}
              <div>
                <span className="font-medium">{strings.content.assignedTo}:</span> {item.assignedUser?.name || strings.common.noResults}
              </div>
            </div>
            
            {user?.role === 'CONTENT_MANAGER' && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{strings.common.status}</label>
                  <Select 
                    value={item.status} 
                    onValueChange={(value) => handleStatusChange(item.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getContentStatuses(strings).map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">{strings.content.assignToUser}</label>
                  <Select 
                    value={item.assignedUser?.id || 'unassigned'} 
                    onValueChange={(value) => handleAssignment(item.id, value === 'unassigned' ? null : value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="manager">Content Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

