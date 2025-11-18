'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import { Download } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { convertToCSV, downloadCSV, generateFilename } from '@/lib/utils/csv-export'
import { getPriorities, getContentRequestStatuses } from '@/lib/constants'
import { exportContentRequestsToCSV, getContentRequests, updateContentRequestStatus, assignContentRequest } from '@/lib/actions/content-requests'
import { formatDistanceToNow } from 'date-fns'
import { notifications } from '@/lib/notifications'
import { ContentRequestSearchBar } from './ContentRequestSearchBar'

interface ContentRequest {
  id: string
  title: string
  description: string
  priority: string
  category: string
  status: string
  createdAt: Date
  viewer: { id: string; name: string; email: string }
  reviewer?: { id: string; name: string; email: string }
}

export function ContentRequestList() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [contentRequests, setContentRequests] = useState<ContentRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const loadContentRequests = useCallback(async () => {
    if (!user) return
    
    try {
      const requestData = await getContentRequests(user.id, user.role)
      setContentRequests(requestData)
    } catch (error) {
      console.error('Failed to load content requests:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadContentRequests()
    }
  }, [user, loadContentRequests])

  const handleStatusChange = async (contentRequestId: string, newStatus: string) => {
    try {
      await updateContentRequestStatus(contentRequestId, newStatus)
      await loadContentRequests()
    } catch (error) {
      console.error('Failed to update content request status:', error)
    }
  }

  const handleAssignment = async (contentRequestId: string, reviewedBy: string) => {
    try {
      await assignContentRequest(contentRequestId, reviewedBy)
      await loadContentRequests()
    } catch (error) {
      console.error('Failed to assign content request:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    const priorityData = getPriorities(strings).find(p => p.value === priority)
    return priorityData?.color || 'bg-muted text-muted-foreground'
  }

  const getStatusColor = (status: string) => {
    const statusData = getContentRequestStatuses(strings).find(s => s.value === status)
    return statusData?.color || 'bg-muted text-muted-foreground'
  }

  const filteredContentRequests = useMemo(() => {
    if (!searchQuery.trim()) {
      return contentRequests
    }

    const query = searchQuery.toLowerCase()
    return contentRequests.filter(request => 
      request.title.toLowerCase().includes(query) ||
      request.description.toLowerCase().includes(query) ||
      request.viewer.name.toLowerCase().includes(query) ||
      request.category.toLowerCase().includes(query)
    )
  }, [contentRequests, searchQuery])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  const handleExport = async () => {
    if (!user) return

    setIsExporting(true)
    const loadingToast = notifications.loading(strings.common.loading)

    try {
      const csvData = await exportContentRequestsToCSV(user.id, user.role)

      const csv = convertToCSV(csvData, [
        { key: 'title', header: strings.contentRequests.titleLabel },
        { key: 'description', header: strings.contentRequests.descriptionLabel },
        { key: 'priority', header: strings.contentRequests.priorityLabel },
        { key: 'status', header: strings.contentRequests.statusLabel },
        { key: 'category', header: strings.contentRequests.genreLabel },
        { key: 'createdBy', header: strings.contentRequests.createdBy },
        { key: 'createdDate', header: strings.common.createdAt },
        { key: 'reviewedBy', header: strings.contentRequests.reviewedBy },
      ])

      downloadCSV(csv, generateFilename('content-requests'))
      notifications.dismiss(loadingToast)
      notifications.success(strings.notifications.success, strings.contentRequests.exportSuccess)
    } catch (error) {
      notifications.dismiss(loadingToast)
      console.error('Failed to export content requests:', error)
      notifications.error(strings.notifications.error, strings.contentRequests.exportError)
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">{strings.common.loading}</div>
        </CardContent>
      </Card>
    )
  }

  if (contentRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            {strings.contentRequests.noContentRequests}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (searchQuery && filteredContentRequests.length === 0) {
    return (
      <div className="space-y-4">
        {user?.role === 'CONTENT_MANAGER' && (
          <div className="flex justify-end">
            <ContentRequestSearchBar 
              onSearch={handleSearch}
              onClear={handleClearSearch}
              searchQuery={searchQuery}
            />
          </div>
        )}
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              {strings.common.noResults}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {user?.role === 'CONTENT_MANAGER' && (
        <div className="flex justify-between items-center gap-4">
          <Button
            onClick={handleExport}
            disabled={isExporting || contentRequests.length === 0}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            {strings.contentRequests.exportToCSV}
          </Button>
          <ContentRequestSearchBar 
            onSearch={handleSearch}
            onClear={handleClearSearch}
            searchQuery={searchQuery}
          />
        </div>
      )}
      {filteredContentRequests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">{request.title}</CardTitle>
                <CardDescription className="text-sm">
                  {request.description.length > 100 
                    ? `${request.description.substring(0, 100)}...` 
                    : request.description
                  }
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(request.priority)}>
                  {getPriorities(strings).find(p => p.value === request.priority)?.label || request.priority}
                </Badge>
                <Badge className={getStatusColor(request.status)}>
                  {getContentRequestStatuses(strings).find(s => s.value === request.status)?.label || request.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">{strings.contentRequests.genreLabel}:</span> {request.category}
              </div>
              <div>
                <span className="font-medium">{strings.common.createdAt}:</span> {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </div>
              <div>
                <span className="font-medium">{strings.contentRequests.createdBy}:</span> {request.viewer.name}
              </div>
            </div>
            
            {user?.role === 'CONTENT_MANAGER' && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{strings.common.status}</label>
                  <Select 
                    value={request.status} 
                    onValueChange={(value) => handleStatusChange(request.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getContentRequestStatuses(strings).map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">{strings.contentRequests.reviewedBy}</label>
                  <Select 
                    value={request.reviewer?.id || 'unassigned'} 
                    onValueChange={(value) => handleAssignment(request.id, value === 'unassigned' ? '' : value)}
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

