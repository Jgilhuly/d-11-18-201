'use client'

import { useState, useEffect } from 'react'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DateRangePicker } from '@/components/ui/date-picker'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { getPriorities, getContentRequestStatuses, getContentGenres } from '@/lib/constants'
import { ContentRequestFilters as FilterType } from '@/lib/types'
import { getUsers } from '@/lib/actions/users'

interface ContentRequestFiltersProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: FilterType
  onFiltersChange: (filters: FilterType) => void
  onApply: () => void
  onClear: () => void
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

export function ContentRequestFilters({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onApply,
  onClear
}: ContentRequestFiltersProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [contentManagers, setContentManagers] = useState<User[]>([])
  const [localFilters, setLocalFilters] = useState<FilterType>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  useEffect(() => {
    const loadContentManagers = async () => {
      try {
        const users = await getUsers()
        const managers = users.filter(user => user.role === 'CONTENT_MANAGER')
        setContentManagers(managers)
      } catch (error) {
        console.error('Failed to load content managers:', error)
      }
    }
    if (open) {
      loadContentManagers()
    }
  }, [open])

  const updateFilter = <K extends keyof FilterType>(key: K, value: FilterType[K]) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleStatusChange = (value: string) => {
    const currentStatuses = localFilters.status || []
    const newStatuses = currentStatuses.includes(value as any)
      ? currentStatuses.filter(s => s !== value)
      : [...currentStatuses, value as any]
    updateFilter('status', newStatuses.length > 0 ? newStatuses : undefined)
  }

  const handlePriorityChange = (value: string) => {
    const currentPriorities = localFilters.priority || []
    const newPriorities = currentPriorities.includes(value as any)
      ? currentPriorities.filter(p => p !== value)
      : [...currentPriorities, value as any]
    updateFilter('priority', newPriorities.length > 0 ? newPriorities : undefined)
  }

  const handleCategoryChange = (value: string) => {
    const currentCategories = localFilters.category || []
    const newCategories = currentCategories.includes(value)
      ? currentCategories.filter(c => c !== value)
      : [...currentCategories, value]
    updateFilter('category', newCategories.length > 0 ? newCategories : undefined)
  }

  const handleReviewerChange = (value: string) => {
    const currentReviewers = localFilters.reviewedBy || []
    const newReviewers = currentReviewers.includes(value)
      ? currentReviewers.filter(r => r !== value)
      : [...currentReviewers, value]
    updateFilter('reviewedBy', newReviewers.length > 0 ? newReviewers : undefined)
  }

  const handleClear = () => {
    const clearedFilters: FilterType = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    onClear()
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    onApply()
  }

  const statuses = getContentRequestStatuses(strings)
  const priorities = getPriorities(strings)
  const categories = getContentGenres(strings)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{strings.contentRequests.filtersTitle}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label className="mb-2 block">{strings.contentRequests.filterStatus}</Label>
            <div className="space-y-2">
              {statuses.map((status) => {
                const isSelected = localFilters.status?.includes(status.value as any)
                return (
                  <div key={status.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`status-${status.value}`}
                      checked={isSelected || false}
                      onChange={() => handleStatusChange(status.value)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`status-${status.value}`} className="cursor-pointer">
                      {status.label}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">{strings.contentRequests.filterPriority}</Label>
            <div className="space-y-2">
              {priorities.map((priority) => {
                const isSelected = localFilters.priority?.includes(priority.value as any)
                return (
                  <div key={priority.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`priority-${priority.value}`}
                      checked={isSelected || false}
                      onChange={() => handlePriorityChange(priority.value)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`priority-${priority.value}`} className="cursor-pointer">
                      {priority.label}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">{strings.contentRequests.filterCategory}</Label>
            <div className="space-y-2">
              {categories.map((category) => {
                const isSelected = localFilters.category?.includes(category.value)
                return (
                  <div key={category.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`category-${category.value}`}
                      checked={isSelected || false}
                      onChange={() => handleCategoryChange(category.value)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`category-${category.value}`} className="cursor-pointer">
                      {category.label}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">{strings.contentRequests.filterReviewer}</Label>
            <div className="space-y-2">
              {contentManagers.map((manager) => {
                const isSelected = localFilters.reviewedBy?.includes(manager.id)
                return (
                  <div key={manager.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`reviewer-${manager.id}`}
                      checked={isSelected || false}
                      onChange={() => handleReviewerChange(manager.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`reviewer-${manager.id}`} className="cursor-pointer">
                      {manager.name}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">{strings.contentRequests.filterDateRange}</Label>
            <DateRangePicker
              startDate={localFilters.dateRange?.start ? (localFilters.dateRange.start instanceof Date ? localFilters.dateRange.start : new Date(localFilters.dateRange.start)) : null}
              endDate={localFilters.dateRange?.end ? (localFilters.dateRange.end instanceof Date ? localFilters.dateRange.end : new Date(localFilters.dateRange.end)) : null}
              onStartDateChange={(date) => {
                if (date) {
                  const endDate = localFilters.dateRange?.end 
                    ? (localFilters.dateRange.end instanceof Date ? localFilters.dateRange.end : new Date(localFilters.dateRange.end))
                    : date
                  updateFilter('dateRange', { start: date, end: endDate })
                } else {
                  updateFilter('dateRange', localFilters.dateRange?.end ? { start: undefined, end: localFilters.dateRange.end } : undefined)
                }
              }}
              onEndDateChange={(date) => {
                if (date) {
                  const startDate = localFilters.dateRange?.start
                    ? (localFilters.dateRange.start instanceof Date ? localFilters.dateRange.start : new Date(localFilters.dateRange.start))
                    : date
                  updateFilter('dateRange', { start: startDate, end: date })
                } else {
                  updateFilter('dateRange', localFilters.dateRange?.start ? { start: localFilters.dateRange.start, end: undefined } : undefined)
                }
              }}
            />
          </div>
        </div>

        <SheetFooter className="flex flex-row gap-2">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            {strings.contentRequests.clearFilters}
          </Button>
          <Button onClick={handleApply} className="flex-1">
            {strings.contentRequests.applyFilters}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

