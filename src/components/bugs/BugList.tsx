'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getPriorities, getBugStatuses } from '@/lib/constants'
import { getBugs, updateBugStatus, assignBug } from '@/lib/actions/bugs'
import { formatDistanceToNow } from 'date-fns'
import { BugSearchBar } from './BugSearchBar'

interface Bug {
  id: string
  title: string
  description: string
  priority: string
  status: string
  browserDevice: string | null
  createdAt: Date
  reporter: { id: string; name: string; email: string }
  assignedTo?: { id: string; name: string; email: string } | null
  affectedContent?: { id: string; name: string; type: string } | null
}

export function BugList() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [bugs, setBugs] = useState<Bug[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const loadBugs = useCallback(async () => {
    if (!user) return
    
    try {
      const bugData = await getBugs(user.id, user.role)
      setBugs(bugData)
    } catch (error) {
      console.error('Failed to load bugs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadBugs()
    }
  }, [user, loadBugs])

  const handleStatusChange = async (bugId: string, newStatus: string) => {
    try {
      await updateBugStatus(bugId, newStatus)
      await loadBugs()
    } catch (error) {
      console.error('Failed to update bug status:', error)
    }
  }

  const handleAssignment = async (bugId: string, assignedToId: string) => {
    try {
      await assignBug(bugId, assignedToId === 'unassigned' ? null : assignedToId)
      await loadBugs()
    } catch (error) {
      console.error('Failed to assign bug:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    const priorityData = getPriorities(strings).find(p => p.value === priority)
    return priorityData?.color || 'bg-muted text-muted-foreground'
  }

  const getStatusColor = (status: string) => {
    const statusData = getBugStatuses(strings).find(s => s.value === status)
    return statusData?.color || 'bg-muted text-muted-foreground'
  }

  const filteredBugs = useMemo(() => {
    if (!searchQuery.trim()) {
      return bugs
    }

    const query = searchQuery.toLowerCase()
    return bugs.filter(bug => 
      bug.title.toLowerCase().includes(query) ||
      bug.description.toLowerCase().includes(query) ||
      bug.reporter.name.toLowerCase().includes(query) ||
      (bug.affectedContent?.name && bug.affectedContent.name.toLowerCase().includes(query))
    )
  }, [bugs, searchQuery])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">{strings.common.loading}</div>
        </CardContent>
      </Card>
    )
  }

  if (bugs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            {strings.bugs.noBugs}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (searchQuery && filteredBugs.length === 0) {
    return (
      <div className="space-y-4">
        {user?.role === 'CONTENT_MANAGER' && (
          <div className="flex justify-end">
            <BugSearchBar 
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
        <div className="flex justify-end">
          <BugSearchBar 
            onSearch={handleSearch}
            onClear={handleClearSearch}
            searchQuery={searchQuery}
          />
        </div>
      )}
      {filteredBugs.map((bug) => (
        <Card key={bug.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">{bug.title}</CardTitle>
                <CardDescription className="text-sm">
                  {bug.description.length > 100 
                    ? `${bug.description.substring(0, 100)}...` 
                    : bug.description
                  }
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(bug.priority)}>
                  {getPriorities(strings).find(p => p.value === bug.priority)?.label || bug.priority}
                </Badge>
                <Badge className={getStatusColor(bug.status)}>
                  {getBugStatuses(strings).find(s => s.value === bug.status)?.label || bug.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">{strings.bugs.browserDeviceLabel}:</span> {bug.browserDevice || strings.bugs.noBrowserDevice}
              </div>
              <div>
                <span className="font-medium">{strings.common.createdAt}:</span> {formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}
              </div>
              <div>
                <span className="font-medium">{strings.bugs.reportedBy}:</span> {bug.reporter.name}
              </div>
            </div>

            {bug.affectedContent && (
              <div className="mt-2 text-sm">
                <span className="font-medium">{strings.bugs.affectedContentLabel}:</span> {bug.affectedContent.name}
              </div>
            )}
            
            {user?.role === 'CONTENT_MANAGER' && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{strings.common.status}</label>
                  <Select 
                    value={bug.status} 
                    onValueChange={(value) => handleStatusChange(bug.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getBugStatuses(strings).map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">{strings.bugs.assignedTo}</label>
                  <Select 
                    value={bug.assignedTo?.id || 'unassigned'} 
                    onValueChange={(value) => handleAssignment(bug.id, value)}
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

