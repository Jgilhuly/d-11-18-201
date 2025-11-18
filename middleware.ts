import { NextRequest, NextResponse } from 'next/server'

/**
 * Next.js Middleware for Locale Detection and Routing
 * 
 * This middleware handles:
 * - Automatic locale detection from URL, headers, and cookies
 * - Locale-based routing (e.g., /es/dashboard -> Spanish dashboard)
 * - Fallback to default locale when needed
 * - Cookie-based locale persistence
 */

// Configuration
const DEFAULT_LOCALE = 'en'
const SUPPORTED_LOCALES = ['en', 'es'] // Will be expanded dynamically as new locales are added
const LOCALE_COOKIE = 'preferred-locale'

/**
 * Extract locale from pathname
 * Examples: /es/dashboard -> 'es', /dashboard -> null
 */
function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean)
  const possibleLocale = segments[0]
  
  if (possibleLocale && SUPPORTED_LOCALES.includes(possibleLocale)) {
    return possibleLocale
  }
  
  return null
}

/**
 * Get the pathname without locale prefix
 * Examples: /es/dashboard -> /dashboard, /dashboard -> /dashboard
 */
function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname)
  if (locale) {
    return pathname.replace(`/${locale}`, '') || '/'
  }
  return pathname
}

/**
 * Detect preferred locale from various sources
 */
function detectPreferredLocale(request: NextRequest): string {
  // 1. Check URL pathname first
  const pathnameLocale = getLocaleFromPathname(request.nextUrl.pathname)
  if (pathnameLocale) {
    return pathnameLocale
  }
  
  // 2. Check cookie preference
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale
  }
  
  // 3. Check Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    // Parse Accept-Language header and find supported locale
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase())
    
    for (const lang of languages) {
      // Check for exact match
      if (SUPPORTED_LOCALES.includes(lang)) {
        return lang
      }
      
      // Check for language prefix (e.g., 'en-US' matches 'en')
      const langPrefix = lang.split('-')[0]
      if (SUPPORTED_LOCALES.includes(langPrefix)) {
        return langPrefix
      }
    }
  }
  
  // 4. Fallback to default locale
  return DEFAULT_LOCALE
}

/**
 * Check if the path should be excluded from locale processing
 */
function shouldExcludePath(pathname: string): boolean {
  const excludedPaths = [
    '/api',           // API routes
    '/_next',         // Next.js internals
    '/favicon.ico',   // Favicon
    '/robots.txt',    // Robots file
    '/sitemap.xml',   // Sitemap
    '/manifest.json', // PWA manifest
  ]
  
  const excludedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.css', '.js', '.json']
  
  return excludedPaths.some(path => pathname.startsWith(path)) ||
         excludedExtensions.some(ext => pathname.endsWith(ext))
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip processing for excluded paths
  if (shouldExcludePath(pathname)) {
    return NextResponse.next()
  }
  
  const currentLocale = getLocaleFromPathname(pathname)
  const preferredLocale = detectPreferredLocale(request)
  
  // If URL already has the preferred locale, continue
  if (currentLocale === preferredLocale) {
    const response = NextResponse.next()
    
    // Set/update the locale cookie
    response.cookies.set(LOCALE_COOKIE, preferredLocale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    
    // Add locale header for components to access
    response.headers.set('x-locale', preferredLocale)
    
    return response
  }
  
  // If URL has different locale than preferred, or no locale, redirect
  const pathnameWithoutLocale = removeLocaleFromPathname(pathname)
  const newPathname = preferredLocale === DEFAULT_LOCALE 
    ? pathnameWithoutLocale
    : `/${preferredLocale}${pathnameWithoutLocale}`
  
  const newUrl = new URL(newPathname, request.url)
  
  // Copy search params
  newUrl.search = request.nextUrl.search
  
  const response = NextResponse.redirect(newUrl)
  
  // Set the locale cookie
  response.cookies.set(LOCALE_COOKIE, preferredLocale, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  
  return response
}

/**
 * Configuration for middleware matching
 * Match all pages except API routes and static files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
