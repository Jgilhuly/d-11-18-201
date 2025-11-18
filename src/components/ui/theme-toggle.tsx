'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0"
        disabled
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">{strings.common.switchTheme}</span>
      </Button>
    )
  }

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="h-8 w-8 p-0"
      onClick={toggleTheme}
      aria-label={strings.common.switchTheme}
      title={isDark ? strings.common.lightMode : strings.common.darkMode}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">{strings.common.switchTheme}</span>
    </Button>
  )
}
