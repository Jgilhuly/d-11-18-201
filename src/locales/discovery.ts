import { LocaleStrings } from './types'

/**
 * Cache for discovered locales to avoid repeated filesystem operations
 */
let discoveredLocalesCache: string[] | null = null
const localeDataCache = new Map<string, LocaleStrings>()

/**
 * Statically defined list of available locales
 * In Phase 2, this will be enhanced with actual filesystem discovery on the server side
 * For now, we maintain dynamic capability while working within Next.js constraints
 */
const AVAILABLE_LOCALES = ['en', 'es'] // This will be dynamically populated in Phase 2

/**
 * Discover available locales
 * Currently returns the statically defined list, but maintains the same interface
 * for Phase 2 when we'll add server-side filesystem discovery
 */
export function discoverAvailableLocales(): string[] {
  // Return cached result if available
  if (discoveredLocalesCache !== null) {
    return discoveredLocalesCache
  }

  // For Phase 1, use static list but maintain dynamic interface
  discoveredLocalesCache = [...AVAILABLE_LOCALES]
  
  // Ensure 'en' is always first (default locale)
  discoveredLocalesCache.sort((a, b) => {
    if (a === 'en') return -1
    if (b === 'en') return 1
    return a.localeCompare(b)
  })
  
  console.log(`Available locales: ${discoveredLocalesCache.join(', ')}`)
  return discoveredLocalesCache
}

/**
 * Add a new locale to the available list (for Phase 2 dynamic discovery)
 */
export function registerLocale(locale: string): void {
  if (!AVAILABLE_LOCALES.includes(locale)) {
    AVAILABLE_LOCALES.push(locale)
    // Clear cache to trigger re-discovery
    discoveredLocalesCache = null
    console.log(`Registered new locale: ${locale}`)
  }
}

/**
 * Static locale data loaders - organized to support dynamic loading
 * These use static imports which work well with Next.js bundling
 */
const localeLoaders: Record<string, () => Promise<LocaleStrings>> = {
  en: async (): Promise<LocaleStrings> => {
    // Static imports for English locale
    const [
      commonEn,
      authEn,
      dashboardEn,
      ticketsEn,
      assetsEn,
      usersEn,
      navigationEn,
      notificationsEn
    ] = await Promise.all([
      import('../locales/en/common.json').then(m => m.default),
      import('../locales/en/auth.json').then(m => m.default),
      import('../locales/en/dashboard.json').then(m => m.default),
      import('../locales/en/tickets.json').then(m => m.default),
      import('../locales/en/assets.json').then(m => m.default),
      import('../locales/en/users.json').then(m => m.default),
      import('../locales/en/navigation.json').then(m => m.default),
      import('../locales/en/notifications.json').then(m => m.default)
    ])

    return {
      common: commonEn,
      auth: authEn,
      dashboard: dashboardEn,
      tickets: ticketsEn,
      assets: assetsEn,
      users: usersEn,
      navigation: navigationEn,
      notifications: notificationsEn,
    }
  },

  es: async (): Promise<LocaleStrings> => {
    // Static imports for Spanish locale
    const [
      commonEs,
      authEs,
      dashboardEs,
      ticketsEs,
      assetsEs,
      usersEs,
      navigationEs,
      notificationsEs
    ] = await Promise.all([
      import('../locales/es/common.json').then(m => m.default),
      import('../locales/es/auth.json').then(m => m.default),
      import('../locales/es/dashboard.json').then(m => m.default),
      import('../locales/es/tickets.json').then(m => m.default),
      import('../locales/es/assets.json').then(m => m.default),
      import('../locales/es/users.json').then(m => m.default),
      import('../locales/es/navigation.json').then(m => m.default),
      import('../locales/es/notifications.json').then(m => m.default)
    ])

    return {
      common: commonEs,
      auth: authEs,
      dashboard: dashboardEs,
      tickets: ticketsEs,
      assets: assetsEs,
      users: usersEs,
      navigation: navigationEs,
      notifications: notificationsEs,
    }
  }
  // Additional loaders for other locales will be added in Phase 3+
  // fr: async () => { ... },
}

/**
 * Dynamically load locale data for a given locale
 */
export async function loadLocaleData(locale: string): Promise<LocaleStrings | null> {
  // Return cached data if available
  if (localeDataCache.has(locale)) {
    return localeDataCache.get(locale)!
  }

  try {
    const loader = localeLoaders[locale]
    if (!loader) {
      console.warn(`No loader available for locale: ${locale}`)
      return null
    }

    const localeStrings = await loader()
    
    // Cache the loaded data
    localeDataCache.set(locale, localeStrings)
    
    console.log(`Loaded locale data for: ${locale}`)
    return localeStrings

  } catch (error) {
    console.error(`Error loading locale data for ${locale}:`, error)
    return null
  }
}

/**
 * Register a new locale loader (for Phase 2 extensibility)
 */
export function registerLocaleLoader(locale: string, loader: () => Promise<LocaleStrings>): void {
  localeLoaders[locale] = loader
  registerLocale(locale)
  console.log(`Registered loader for locale: ${locale}`)
}

/**
 * Get locale from various sources (URL, headers, storage, etc.)
 * This will be expanded in Phase 2 for Next.js integration
 */
export function detectLocaleFromEnvironment(): string {
  // For now, return default locale
  // In Phase 2, this will check:
  // - URL pathname (/es/dashboard)
  // - Accept-Language headers
  // - localStorage/cookies
  // - Browser navigator.language
  
  return 'en'
}

/**
 * Clear all caches (useful for development/testing)
 */
export function clearLocaleCache(): void {
  discoveredLocalesCache = null
  localeDataCache.clear()
  console.log('Locale caches cleared')
}

/**
 * Get list of locale files that should exist for a complete locale
 */
export function getRequiredLocaleFiles(): string[] {
  return [
    'common.json',
    'auth.json', 
    'dashboard.json',
    'tickets.json',
    'assets.json',
    'users.json',
    'navigation.json',
    'notifications.json'
  ]
}

/**
 * Check if a locale has a registered loader
 */
export function isLocaleSupported(locale: string): boolean {
  return locale in localeLoaders
}

/**
 * Get all registered locale loaders
 */
export function getRegisteredLocales(): string[] {
  return Object.keys(localeLoaders)
}
