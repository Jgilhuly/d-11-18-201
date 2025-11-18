'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { getStringsForLocale, type LocaleStrings } from '@/lib/locale-strings'

interface LocaleContextType {
  currentLocale: string
  supportedLocales: string[]
  setLocale: (locale: string) => Promise<boolean>
  isLoading: boolean
  isInitialized: boolean
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Initialize with saved locale or default to 'en'
  const [currentLocale, setCurrentLocaleState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('locale') || 'en'
    }
    return 'en'
  })
  const [supportedLocales] = useState<string[]>(['en', 'es'])
  const [isLoading] = useState(false)
  const [isInitialized] = useState(true) // Always initialized with static strings

  /**
   * Change the current locale (simplified)
   */
  const setLocale = useCallback(async (locale: string): Promise<boolean> => {
    if (locale === currentLocale) {
      return true
    }

    if (!supportedLocales.includes(locale)) {
      console.warn(`Unsupported locale: ${locale}`)
      return false
    }

    setCurrentLocaleState(locale)
    
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale)
    }
    
    console.log(`Locale changed to: ${locale}`)
    return true
  }, [currentLocale, supportedLocales])



  return (
    <LocaleContext.Provider 
      value={{ 
        currentLocale, 
        supportedLocales, 
        setLocale, 
        isLoading, 
        isInitialized 
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

/**
 * Hook to access locale context
 */
export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

/**
 * Hook that combines locale context with string utilities
 */
export function useLocalizedStrings() {
  const { currentLocale, setLocale, supportedLocales, isLoading, isInitialized } = useLocale()
  
  return {
    // Locale state
    currentLocale,
    supportedLocales,
    setLocale,
    isLoading,
    isInitialized,
    
    // Convenience methods that use current locale context
    isCurrentLocale: (locale: string) => currentLocale === locale,
    isSupported: (locale: string) => supportedLocales.includes(locale),
    getLocalizedPath: (path: string) => {
      // Since we're not using URL-based locale routing, just return the path as-is
      return path
    },
    
    // Get strings for current locale - still synchronous, no external dependencies
    getStrings: (): LocaleStrings => getStringsForLocale(currentLocale)
  }
}
