'use client'

import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { useAuth } from '@/contexts/AuthContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getPriorities, getContentRequestStatuses } from '@/lib/constants'
import { formatDistanceToNow } from 'date-fns'
import { updateContentRequestStatus, assignContentRequest } from '@/lib/actions/content-requests'

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

interface ContentRequestTableViewProps {
  contentRequests: ContentRequest[]
  onStatusChange: (contentRequestId: string, newStatus: string) => Promise<void>
  onAssignment: (contentRequestId: string, reviewedBy: string) => Promise<void>
}

type SortField = 'title' | 'priority' | 'status' | 'category' | 'createdBy' | 'createdDate'
type SortDirection = 'asc' | 'desc'

const PRIORITY_ORDER: Record<string, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
}

const STATUS_ORDER: Record<string, number> = {
  PENDING: 1,
  IN_REVIEW: 2,
  APPROVED: 3,
  ADDED: 4,
}

export function ContentRequestTableView({
  contentRequests,
  onStatusChange,
  onAssignment,
}: ContentRequestTableViewProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const { user } = useAuth()
  const [sortField, setSortField] = useState<SortField>('createdDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedContentRequests = useMemo(() => {
    const sorted = [...contentRequests]

    sorted.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'priority':
          const aPriority = PRIORITY_ORDER[a.priority] ?? 999
          const bPriority = PRIORITY_ORDER[b.priority] ?? 999
          comparison = aPriority - bPriority
          break
        case 'status':
          const aStatus = STATUS_ORDER[a.status] ?? 999
          const bStatus = STATUS_ORDER[b.status] ?? 999
          comparison = aStatus - bStatus
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'createdBy':
          comparison = a.viewer.name.localeCompare(b.viewer.name)
          break
        case 'createdDate':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [contentRequests, sortField, sortDirection])

  const getPriorityColor = (priority: string) => {
    const priorityData = getPriorities(strings).find(p => p.value === priority)
    return priorityData?.color || 'bg-muted text-muted-foreground'
  }

  const getStatusColor = (status: string) => {
    const statusData = getContentRequestStatuses(strings).find(s => s.value === status)
    return statusData?.color || 'bg-muted text-muted-foreground'
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    )
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 select-none"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center">
                {strings.contentRequests.tableColumnTitle}
                <SortIcon field="title" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 select-none"
              onClick={() => handleSort('priority')}
            >
              <div className="flex items-center">
                {strings.contentRequests.tableColumnPriority}
                <SortIcon field="priority" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 select-none"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                {strings.contentRequests.tableColumnStatus}
                <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 select-none"
              onClick={() => handleSort('category')}
            >
              <div className="flex items-center">
                {strings.contentRequests.tableColumnCategory}
                <SortIcon field="category" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 select-none"
              onClick={() => handleSort('createdBy')}
            >
              <div className="flex items-center">
                {strings.contentRequests.tableColumnCreatedBy}
                <SortIcon field="createdBy" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 select-none"
              onClick={() => handleSort('createdDate')}
            >
              <div className="flex items-center">
                {strings.contentRequests.tableColumnCreatedDate}
                <SortIcon field="createdDate" />
              </div>
            </TableHead>
            {user?.role === 'CONTENT_MANAGER' && (
              <TableHead>{strings.common.actions}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContentRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={user?.role === 'CONTENT_MANAGER' ? 7 : 6} className="text-center text-muted-foreground">
                {strings.contentRequests.noContentRequests}
              </TableCell>
            </TableRow>
          ) : (
            sortedContentRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.title}</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(request.priority)}>
                    {getPriorities(strings).find(p => p.value === request.priority)?.label || request.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>
                    {getContentRequestStatuses(strings).find(s => s.value === request.status)?.label || request.status}
                  </Badge>
                </TableCell>
                <TableCell>{request.category}</TableCell>
                <TableCell>{request.viewer.name}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                </TableCell>
                {user?.role === 'CONTENT_MANAGER' && (
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Select
                        value={request.status}
                        onValueChange={(value) => onStatusChange(request.id, value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
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
                      <Select
                        value={request.reviewer?.id || 'unassigned'}
                        onValueChange={(value) => onAssignment(request.id, value === 'unassigned' ? '' : value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Unassigned" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          <SelectItem value="manager">Content Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

