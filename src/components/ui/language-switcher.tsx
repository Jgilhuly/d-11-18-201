'use client'

import { useState } from 'react'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'


const LOCALE_NAMES: Record<string, string> = {
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português',
  'ja': '日本語',
  'ko': '한국어',
  'zh': '中文',
}

export function LanguageSwitcher() {
  const { currentLocale, setLocale, supportedLocales, isLoading } = useLocalizedStrings()
  const [isSwitching, setIsSwitching] = useState(false)

  const handleLocaleChange = async (locale: string) => {
    if (locale === currentLocale || isSwitching) return

    setIsSwitching(true)
    try {
      await setLocale(locale)
    } catch (error) {
      console.error('Failed to switch locale:', error)
    } finally {
      setIsSwitching(false)
    }
  }

  // Get display name for locale, fallback to the locale code
  const getLocaleName = (locale: string): string => {
    return LOCALE_NAMES[locale] || locale.toUpperCase()
  }

  const availableLocales = supportedLocales.length > 0 ? supportedLocales : ['en', 'es']

  // Don't show switcher if only one locale is available
  if (availableLocales.length <= 1) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
          disabled={isLoading || isSwitching}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {availableLocales.map((locale: string) => (
          <DropdownMenuItem
            key={locale}
                          onClick={() => handleLocaleChange(locale as string)}
            className={`cursor-pointer ${
              locale === currentLocale 
                ? 'bg-accent text-accent-foreground font-medium' 
                : ''
            }`}
            disabled={isSwitching}
          >
            <div className="flex items-center justify-between w-full">
              <span>{getLocaleName(locale)}</span>
              {locale === currentLocale && (
                <span className="text-xs text-muted-foreground">•</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
