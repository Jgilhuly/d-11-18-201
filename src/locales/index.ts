import { LocaleStrings, CommonStrings, AuthStrings, DashboardStrings, TicketsStrings, AssetsStrings, UsersStrings, NavigationStrings, NotificationsStrings } from './types'
import { discoverAvailableLocales, loadLocaleData, clearLocaleCache } from './discovery'
import { getStringWithFallback, getSafeString, validateLocaleCompleteness, clearValidationCache } from './validation'

// Dynamic locale discovery
export function getSupportedLocales(): string[] {
  return discoverAvailableLocales()
}

// Backward compatibility - this will now be dynamic
export const SUPPORTED_LOCALES = getSupportedLocales()
export type SupportedLocale = string

// Locale strings registry - now dynamic
const localeStrings = new Map<string, LocaleStrings>()

// Current locale state
let currentLocale = 'en'

// Initialize with English locale on startup
let initializationPromise: Promise<void> | null = null

export async function initializeLocaleSystem(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    try {
      // Load English as the base locale
      const englishData = await loadLocaleData('en')
      if (englishData) {
        localeStrings.set('en', englishData)
        console.log('Locale system initialized with English as base locale')
      } else {
        console.error('Failed to initialize locale system: Could not load English locale')
      }
    } catch (error) {
      console.error('Error initializing locale system:', error)
    }
  })()

  return initializationPromise
}

/**
 * Get the current locale
 */
export function getCurrentLocale(): string {
  return currentLocale
}

/**
 * Set the current locale with dynamic loading
 */
export async function setCurrentLocale(locale: string): Promise<boolean> {
  const supportedLocales = getSupportedLocales()
  
  if (supportedLocales.includes(locale)) {
    // Load locale data if not already cached
    if (!localeStrings.has(locale)) {
      const localeData = await loadLocaleData(locale)
      if (localeData) {
        localeStrings.set(locale, localeData)
      } else {
        console.warn(`Failed to load locale data for: ${locale}. Falling back to 'en'`)
        locale = 'en'
      }
    }
    
    currentLocale = locale
    console.log(`Locale set to: ${locale}`)
    return true
  } else {
    console.warn(`Unsupported locale: ${locale}. Falling back to 'en'`)
    currentLocale = 'en'
    return false
  }
}

/**
 * Synchronous version for backward compatibility (deprecated)
 * @deprecated Use setCurrentLocale() instead for proper async loading
 */
export function setCurrentLocaleSync(locale: string): void {
  const supportedLocales = getSupportedLocales()
  
  if (supportedLocales.includes(locale) && localeStrings.has(locale)) {
    currentLocale = locale
  } else {
    console.warn(`Locale ${locale} not available or not loaded. Use setCurrentLocale() for dynamic loading.`)
    currentLocale = 'en'
  }
}

/**
 * Get all strings for the current locale with fallback support
 */
export async function getStrings(): Promise<LocaleStrings> {
  await initializeLocaleSystem()
  
  const current = localeStrings.get(currentLocale)
  if (current) {
    return current
  }

  // Fallback to English
  const fallback = localeStrings.get('en')
  if (fallback) {
    console.warn(`Using fallback locale 'en' instead of '${currentLocale}'`)
    return fallback
  }

  throw new Error('No locale data available, including fallback')
}

/**
 * Synchronous version that throws if locale not loaded
 */
export function getStringsSync(): LocaleStrings {
  const current = localeStrings.get(currentLocale)
  if (current) {
    return current
  }

  const fallback = localeStrings.get('en')
  if (fallback) {
    console.warn(`Using fallback locale 'en' instead of '${currentLocale}'`)
    return fallback
  }

  throw new Error('No locale data loaded. Call initializeLocaleSystem() first.')
}

/**
 * Get strings for a specific category with fallback support
 */
export async function getCommonStrings(): Promise<CommonStrings> {
  const strings = await getStrings()
  return strings.common
}

export async function getAuthStrings(): Promise<AuthStrings> {
  const strings = await getStrings()
  return strings.auth
}

export async function getDashboardStrings(): Promise<DashboardStrings> {
  const strings = await getStrings()
  return strings.dashboard
}

export async function getTicketsStrings(): Promise<TicketsStrings> {
  const strings = await getStrings()
  return strings.tickets
}

export async function getAssetsStrings(): Promise<AssetsStrings> {
  const strings = await getStrings()
  return strings.assets
}

export async function getUsersStrings(): Promise<UsersStrings> {
  const strings = await getStrings()
  return strings.users
}

export async function getNavigationStrings(): Promise<NavigationStrings> {
  const strings = await getStrings()
  return strings.navigation
}

export async function getNotificationsStrings(): Promise<NotificationsStrings> {
  const strings = await getStrings()
  return strings.notifications
}

// Synchronous versions for backward compatibility
export function getCommonStringsSync(): CommonStrings {
  return getStringsSync().common
}

export function getAuthStringsSync(): AuthStrings {
  return getStringsSync().auth
}

export function getDashboardStringsSync(): DashboardStrings {
  return getStringsSync().dashboard
}

export function getTicketsStringsSync(): TicketsStrings {
  return getStringsSync().tickets
}

export function getAssetsStringsSync(): AssetsStrings {
  return getStringsSync().assets
}

export function getUsersStringsSync(): UsersStrings {
  return getStringsSync().users
}

export function getNavigationStringsSync(): NavigationStrings {
  return getStringsSync().navigation
}

export function getNotificationsStringsSync(): NotificationsStrings {
  return getStringsSync().notifications
}

/**
 * Generic function to get a nested string value with fallback support
 * Usage: await getString('common', 'save') or await getString('dashboard', 'title')
 */
export async function getString<T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]>(
  category: T,
  key: K
): Promise<LocaleStrings[T][K]> {
  const result = await getStringWithFallback(currentLocale, category, key, ['en'])
  
  if (result !== null) {
    return result
  }

  throw new Error(`Missing translation: ${category}.${String(key)} for locale: ${currentLocale}`)
}

/**
 * Synchronous version for backward compatibility
 */
export function getStringSync<T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]>(
  category: T,
  key: K
): LocaleStrings[T][K] {
  const strings = getStringsSync()
  return strings[category][key]
}

/**
 * Safe string getter that returns a fallback on error
 */
export async function getStringSafe<T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]>(
  category: T,
  key: K,
  fallback?: string
): Promise<string> {
  return getSafeString(currentLocale, category, key, ['en'], fallback)
}

/**
 * Template string interpolation helper
 * Usage: interpolate('Hello {name}!', { name: 'John' }) => 'Hello John!'
 */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match
  })
}

/**
 * Get a string with interpolation and fallback support
 * Usage: await getInterpolatedString('auth', 'welcomeMessage', { name: 'John' })
 */
export async function getInterpolatedString<T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]>(
  category: T,
  key: K,
  values: Record<string, string | number>
): Promise<string> {
  const template = await getString(category, key) as string
  return interpolate(template, values)
}

/**
 * Synchronous version for backward compatibility
 */
export function getInterpolatedStringSync<T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]>(
  category: T,
  key: K,
  values: Record<string, string | number>
): string {
  const template = getStringSync(category, key) as string
  return interpolate(template, values)
}

// Convenience hooks for React components
/**
 * React hook to get localized strings (synchronous version for backward compatibility)
 * Note: This uses the synchronous API and assumes locale data is already loaded
 */
export function useStrings() {
  return {
    // Synchronous getters (backward compatible)
    strings: getStringsSync,
    common: getCommonStringsSync,
    auth: getAuthStringsSync,
    dashboard: getDashboardStringsSync,
    tickets: getTicketsStringsSync,
    assets: getAssetsStringsSync,
    users: getUsersStringsSync,
    navigation: getNavigationStringsSync,
    notifications: getNotificationsStringsSync,
    
    // Locale management
    currentLocale: getCurrentLocale(),
    supportedLocales: getSupportedLocales(),
    setLocale: setCurrentLocale,
    setLocaleSync: setCurrentLocaleSync,
    
    // String getters
    getString: getStringSync,
    getStringSafe,
    getInterpolatedString: getInterpolatedStringSync,
    interpolate,
    
    // Utility functions
    initializeLocaleSystem,
    validateLocale: validateLocaleCompleteness,
  }
}

/**
 * Async version of the React hook for apps that can handle promises
 */
export function useStringsAsync() {
  return {
    // Async getters with fallback support
    strings: getStrings,
    common: getCommonStrings,
    auth: getAuthStrings,
    dashboard: getDashboardStrings,
    tickets: getTicketsStrings,
    assets: getAssetsStrings,
    users: getUsersStrings,
    navigation: getNavigationStrings,
    notifications: getNotificationsStrings,
    
    // String getters
    getString,
    getStringSafe,
    getInterpolatedString,
    interpolate,
    
    // Locale management
    currentLocale: getCurrentLocale(),
    supportedLocales: getSupportedLocales(),
    setLocale: setCurrentLocale,
    
    // Utility functions
    initializeLocaleSystem,
    validateLocale: validateLocaleCompleteness,
  }
}

// Export individual string getters as default export for convenience
const localeApi = {
  // Async functions (recommended)
  strings: getStrings,
  common: getCommonStrings,
  auth: getAuthStrings,
  dashboard: getDashboardStrings,
  tickets: getTicketsStrings,
  assets: getAssetsStrings,
  users: getUsersStrings,
  navigation: getNavigationStrings,
  notifications: getNotificationsStrings,
  getString,
  getStringSafe,
  getInterpolatedString,
  
  // Sync functions (backward compatibility)
  stringsSync: getStringsSync,
  commonSync: getCommonStringsSync,
  authSync: getAuthStringsSync,
  dashboardSync: getDashboardStringsSync,
  ticketsSync: getTicketsStringsSync,
  assetsSync: getAssetsStringsSync,
  usersSync: getUsersStringsSync,
  navigationSync: getNavigationStringsSync,
  notificationsSync: getNotificationsStringsSync,
  getStringSync,
  getInterpolatedStringSync,
  
  // Utility functions
  interpolate,
  getCurrentLocale,
  setCurrentLocale,
  setCurrentLocaleSync,
  getSupportedLocales,
  initializeLocaleSystem,
  validateLocale: validateLocaleCompleteness,
  
  // React hooks
  useStrings,
  useStringsAsync,
  
  // Cache management
  clearCaches: () => {
    clearLocaleCache()
    clearValidationCache()
  },
}

export default localeApi
