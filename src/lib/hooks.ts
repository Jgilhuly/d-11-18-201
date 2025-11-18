import { useState, useEffect, useCallback, useRef } from 'react'
import { performanceUtils, storageUtils } from './utils-extended'

// Hook for managing local storage state
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    return storageUtils.get(key, initialValue)
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      storageUtils.set(key, valueToStore)
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

// Hook for debounced value
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for managing async operations
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)

    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error as E)
      setStatus('error')
      throw error
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, status, data, error, isLoading: status === 'pending' }
}

// Hook for managing pagination state
export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const nextPage = useCallback(() => setPage(p => p + 1), [])
  const prevPage = useCallback(() => setPage(p => Math.max(1, p - 1)), [])
  const goToPage = useCallback((pageNumber: number) => setPage(Math.max(1, pageNumber)), [])
  const reset = useCallback(() => setPage(1), [])

  const offset = (page - 1) * limit

  return {
    page,
    limit,
    offset,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    reset
  }
}

// Hook for managing sort state
export function useSort<T>(initialField?: keyof T, initialDirection: 'asc' | 'desc' = 'asc') {
  const [sortField, setSortField] = useState<keyof T | undefined>(initialField)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialDirection)

  const handleSort = useCallback((field: keyof T) => {
    if (sortField === field) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField])

  const resetSort = useCallback(() => {
    setSortField(undefined)
    setSortDirection('asc')
  }, [])

  return {
    sortField,
    sortDirection,
    handleSort,
    resetSort
  }
}

// Hook for managing form state with validation
export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  const handleSetTouched = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  const validateForm = useCallback(() => {
    if (!validate) return true
    
    const newErrors = validate(values)
    setErrors(newErrors)
    
    return Object.keys(newErrors).length === 0
  }, [values, validate])

  const handleSubmit = useCallback((onSubmit: (values: T) => Promise<void> | void) => {
    return async (e: React.FormEvent) => {
      e.preventDefault()
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {})
      setTouched(allTouched)

      if (!validateForm()) return

      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    }
  }, [values, validateForm, setTouched])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues, setTouched])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setTouched: handleSetTouched,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0
  }
}

// Hook for managing search/filter state
export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  filterFn?: (item: T) => boolean
) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, unknown>>({})

  const debouncedQuery = useDebounce(query, 300)

  const filteredItems = useCallback(() => {
    let result = items

    // Apply custom filter function
    if (filterFn) {
      result = result.filter(filterFn)
    }

    // Apply search query
    if (debouncedQuery) {
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(debouncedQuery.toLowerCase())
          }
          return false
        })
      )
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => {
          const itemValue = (item as Record<string, unknown>)[key]
          if (Array.isArray(value)) {
            return value.includes(itemValue)
          }
          return itemValue === value
        })
      }
    })

    return result
  }, [items, debouncedQuery, searchFields, filterFn, filters])

  const setFilter = useCallback((key: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setQuery('')
    setFilters({})
  }, [])

  return {
    query,
    setQuery,
    filters,
    setFilter,
    clearFilters,
    filteredItems: filteredItems(),
    hasActiveFilters: query !== '' || Object.values(filters).some(v => v !== null && v !== undefined && v !== '')
  }
}

// Hook for managing boolean toggle state
export function useToggle(initialValue = false): [boolean, () => void, (value?: boolean) => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setToggle = useCallback((newValue?: boolean) => {
    setValue(newValue !== undefined ? newValue : !value)
  }, [value])

  return [value, toggle, setToggle]
}

// Hook for managing previous value
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  
  useEffect(() => {
    ref.current = value
  }, [value])
  
  return ref.current
}

// Hook for managing copy to clipboard
export function useClipboard(timeout = 2000) {
  const [isCopied, setIsCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    if (!navigator.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      
      setTimeout(() => setIsCopied(false), timeout)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      setIsCopied(false)
      return false
    }
  }, [timeout])

  return { isCopied, copy }
}

// Hook for detecting click outside element
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [callback])

  return ref
}

// Hook for managing window dimensions
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = performanceUtils.throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }, 100)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
