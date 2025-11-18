'use client'

import { Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'

type ViewType = 'card' | 'table'

interface ContentViewToggleProps {
  view: ViewType
  onViewChange: (view: ViewType) => void
}

export function ContentViewToggle({ view, onViewChange }: ContentViewToggleProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()

  return (
    <div className="flex items-center gap-2 border rounded-md p-1">
      <Button
        variant={view === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('card')}
        className={cn(
          'flex items-center gap-2',
          view === 'card' && 'bg-primary text-primary-foreground'
        )}
      >
        <Grid className="h-4 w-4" />
        <span className="hidden sm:inline">{strings.contentRequests.viewCardView}</span>
      </Button>
      <Button
        variant={view === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className={cn(
          'flex items-center gap-2',
          view === 'table' && 'bg-primary text-primary-foreground'
        )}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">{strings.contentRequests.viewTableView}</span>
      </Button>
    </div>
  )
}

