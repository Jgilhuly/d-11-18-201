'use client'

import { useState, useCallback } from 'react'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface BugSearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
  searchQuery: string
}

export function BugSearchBar({ onSearch, onClear, searchQuery }: BugSearchBarProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleSearch = useCallback(() => {
    onSearch(localQuery)
  }, [localQuery, onSearch])

  const handleClear = useCallback(() => {
    setLocalQuery('')
    onClear()
  }, [onClear])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={strings.bugs.searchPlaceholder}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
        />
      </div>
      <Button 
        onClick={handleSearch}
        variant="outline"
        size="sm"
      >
        {strings.common.search}
      </Button>
      {searchQuery && (
        <Button 
          onClick={handleClear}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

