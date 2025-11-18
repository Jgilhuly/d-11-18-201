import { LocaleStrings } from './types'
import { loadLocaleData, getRequiredLocaleFiles } from './discovery'

/**
 * Validation result for locale completeness check
 */
export interface LocaleValidationResult {
  locale: string
  isComplete: boolean
  missingFiles: string[]
  missingKeys: Array<{
    category: string
    keys: string[]
  }>
  warnings: string[]
}

/**
 * Fallback chain configuration
 * Defines the order in which locales should be tried when a translation is missing
 */
export interface FallbackChain {
  primary: string
  fallbacks: string[]
}

/**
 * Default fallback chain - always falls back to English
 */
export const DEFAULT_FALLBACK_CHAIN: FallbackChain = {
  primary: 'en',
  fallbacks: ['en']
}

/**
 * Cache for locale validation results
 */
const validationCache = new Map<string, LocaleValidationResult>()

/**
 * Validate completeness of a locale against the reference locale (English)
 */
export async function validateLocaleCompleteness(
  locale: string, 
  referenceLocale: string = 'en'
): Promise<LocaleValidationResult> {
  
  const cacheKey = `${locale}-${referenceLocale}`
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)!
  }

  const result: LocaleValidationResult = {
    locale,
    isComplete: true,
    missingFiles: [],
    missingKeys: [],
    warnings: []
  }

  try {
    // Load both locales
    const [localeData, referenceData] = await Promise.all([
      loadLocaleData(locale),
      loadLocaleData(referenceLocale)
    ])

    if (!localeData) {
      result.isComplete = false
      result.warnings.push(`Failed to load locale data for '${locale}'`)
      result.missingFiles = getRequiredLocaleFiles()
      validationCache.set(cacheKey, result)
      return result
    }

    if (!referenceData) {
      result.warnings.push(`Failed to load reference locale '${referenceLocale}'`)
      validationCache.set(cacheKey, result)
      return result
    }

    // Compare each category
    for (const category of Object.keys(referenceData) as Array<keyof LocaleStrings>) {
      if (!localeData[category]) {
        result.isComplete = false
        result.missingKeys.push({
          category,
          keys: Object.keys(referenceData[category] || {})
        })
        continue
      }

      // Compare keys within category
      const missingKeysInCategory: string[] = []
      const referenceKeys = Object.keys(referenceData[category] || {})
      
      for (const key of referenceKeys) {
        if (!(key in localeData[category])) {
          missingKeysInCategory.push(key)
        }
      }

      if (missingKeysInCategory.length > 0) {
        result.isComplete = false
        result.missingKeys.push({
          category,
          keys: missingKeysInCategory
        })
      }
    }

    // Cache the result
    validationCache.set(cacheKey, result)
    
    if (!result.isComplete) {
      console.warn(`Locale '${locale}' is incomplete:`, result)
    }

    return result

  } catch (error) {
    result.isComplete = false
    result.warnings.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    validationCache.set(cacheKey, result)
    return result
  }
}

/**
 * Get a localized string with fallback support
 */
export async function getStringWithFallback<
  T extends keyof LocaleStrings,
  K extends keyof LocaleStrings[T]
>(
  locale: string,
  category: T,
  key: K,
  fallbackChain: string[] = ['en']
): Promise<LocaleStrings[T][K] | null> {
  
  const localeChain = [locale, ...fallbackChain].filter((l, i, arr) => arr.indexOf(l) === i)
  
  for (const fallbackLocale of localeChain) {
    try {
      const localeData = await loadLocaleData(fallbackLocale)
      
      if (localeData?.[category]?.[key]) {
        // Log fallback usage in development
        if (fallbackLocale !== locale && process.env.NODE_ENV === 'development') {
          console.warn(
            `Using fallback locale '${fallbackLocale}' for ${category}.${String(key)} (requested: '${locale}')`
          )
        }
        
        return localeData[category][key]
      }
    } catch (error) {
      console.warn(`Failed to load fallback locale '${fallbackLocale}':`, error)
    }
  }

  // Log missing translation in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`Missing translation: ${category}.${String(key)} for locale chain: ${localeChain.join(' → ')}`)
  }

  return null
}

/**
 * Validate multiple locales and return a summary
 */
export async function validateAllLocales(
  locales: string[], 
  referenceLocale: string = 'en'
): Promise<{
  valid: string[]
  invalid: string[]  
  results: LocaleValidationResult[]
}> {
  
  const results = await Promise.all(
    locales.map(locale => validateLocaleCompleteness(locale, referenceLocale))
  )

  const valid: string[] = []
  const invalid: string[] = []

  for (const result of results) {
    if (result.isComplete) {
      valid.push(result.locale)
    } else {
      invalid.push(result.locale)
    }
  }

  return { valid, invalid, results }
}

/**
 * Get a comprehensive validation report for development/debugging
 */
export async function getValidationReport(locales: string[]): Promise<string> {
  const validation = await validateAllLocales(locales)
  
  let report = '=== Locale Validation Report ===\n\n'
  
  report += `Total locales: ${locales.length}\n`
  report += `Valid: ${validation.valid.length} (${validation.valid.join(', ')})\n`
  report += `Invalid: ${validation.invalid.length} (${validation.invalid.join(', ')})\n\n`

  for (const result of validation.results) {
    report += `--- ${result.locale.toUpperCase()} ---\n`
    report += `Status: ${result.isComplete ? '✅ Complete' : '❌ Incomplete'}\n`
    
    if (result.missingFiles.length > 0) {
      report += `Missing files: ${result.missingFiles.join(', ')}\n`
    }
    
    if (result.missingKeys.length > 0) {
      report += 'Missing keys:\n'
      for (const category of result.missingKeys) {
        report += `  ${category.category}: ${category.keys.join(', ')}\n`
      }
    }
    
    if (result.warnings.length > 0) {
      report += `Warnings: ${result.warnings.join('; ')}\n`
    }
    
    report += '\n'
  }

  return report
}

/**
 * Clear validation cache (useful for development/testing)
 */
export function clearValidationCache(): void {
  validationCache.clear()
  console.log('Validation cache cleared')
}

/**
 * Safe string getter that handles missing translations gracefully
 * Returns a fallback value or error indicator if all translations fail
 */
export async function getSafeString<
  T extends keyof LocaleStrings,
  K extends keyof LocaleStrings[T]
>(
  locale: string,
  category: T,
  key: K,
  fallbackChain: string[] = ['en'],
  errorFallback?: string
): Promise<string> {
  
  const value = await getStringWithFallback(locale, category, key, fallbackChain)
  
  if (value !== null && typeof value === 'string') {
    return value
  }

  // Return error fallback or a descriptive error
  return errorFallback || `[Missing: ${category}.${String(key)}]`
}
