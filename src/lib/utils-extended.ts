import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, format, isValid, parseISO } from 'date-fns'
import type { 
  SortDirection, 
  SelectOption, 
  StatusOption, 
  TicketStatus, 
  TicketPriority, 
  AssetStatus, 
  UserRole 
} from './types'

// Re-export the original cn function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export const dateUtils = {
  formatRelative: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 'Invalid date'
    return formatDistanceToNow(dateObj, { addSuffix: true })
  },

  formatDate: (date: Date | string, pattern = 'PP') => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 'Invalid date'
    return format(dateObj, pattern)
  },

  formatDateTime: (date: Date | string) => {
    return dateUtils.formatDate(date, 'PPp')
  },

  formatDateShort: (date: Date | string) => {
    return dateUtils.formatDate(date, 'P')
  },

  isExpiringSoon: (date: Date | string, daysThreshold = 30) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return false
    const now = new Date()
    const diffTime = dateObj.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= daysThreshold && diffDays > 0
  },

  isExpired: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return false
    return dateObj < new Date()
  }
}

// String utilities
export const stringUtils = {
  truncate: (str: string, length: number, suffix = '...') => {
    if (str.length <= length) return str
    return str.substring(0, length - suffix.length) + suffix
  },

  capitalize: (str: string) => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  capitalizeWords: (str: string) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    )
  },

  slugify: (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  },

  generateId: (prefix = '') => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36)
    return prefix ? `${prefix}-${id}` : id
  },

  mask: (str: string, start = 0, end = 4, char = '*') => {
    if (str.length <= start + end) return str
    const startStr = str.substring(0, start)
    const endStr = str.substring(str.length - end)
    const middleLength = str.length - start - end
    return startStr + char.repeat(middleLength) + endStr
  }
}

// Array utilities
export const arrayUtils = {
  unique: <T>(arr: T[], key?: keyof T) => {
    if (!key) return [...new Set(arr)]
    const seen = new Set()
    return arr.filter((item) => {
      const val = item[key]
      if (seen.has(val)) return false
      seen.add(val)
      return true
    })
  },

  sortBy: <T>(arr: T[], key: keyof T, direction: SortDirection = 'asc') => {
    return [...arr].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  },

  groupBy: <T>(arr: T[], key: keyof T) => {
    return arr.reduce((groups, item) => {
      const groupKey = String(item[key])
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(item)
      return groups
    }, {} as Record<string, T[]>)
  },

  chunk: <T>(arr: T[], size: number) => {
    const chunks: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size))
    }
    return chunks
  },

  paginate: <T>(arr: T[], page: number, limit: number) => {
    const offset = (page - 1) * limit
    return {
      items: arr.slice(offset, offset + limit),
      pagination: {
        page,
        limit,
        total: arr.length,
        totalPages: Math.ceil(arr.length / limit),
        hasNext: offset + limit < arr.length,
        hasPrev: page > 1
      }
    }
  }
}

// Validation utilities
export const validationUtils = {
  isEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  isStrongPassword: (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  },

  isUrl: (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  sanitizeFilename: (filename: string) => {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  }
}

// UI utilities
export const uiUtils = {
  getInitials: (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  },

  getContrastColor: (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  },

  generateColor: (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = hash % 360
    return `hsl(${hue}, 70%, 60%)`
  }
}

// Status utilities
export const statusUtils = {
  getTicketStatusColor: (status: TicketStatus): string => {
    const statusColors: Record<TicketStatus, string> = {
      OPEN: 'bg-blue-500/20 text-blue-400',
      IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400',
      RESOLVED: 'bg-green-500/20 text-green-400',
      CLOSED: 'bg-muted text-muted-foreground'
    }
    return statusColors[status] || 'bg-muted text-muted-foreground'
  },

  getPriorityColor: (priority: TicketPriority): string => {
    const priorityColors: Record<TicketPriority, string> = {
      LOW: 'bg-green-500/20 text-green-400',
      MEDIUM: 'bg-yellow-500/20 text-yellow-400',
      HIGH: 'bg-orange-500/20 text-orange-400',
      CRITICAL: 'bg-red-500/20 text-red-400'
    }
    return priorityColors[priority] || 'bg-muted text-muted-foreground'
  },

  getAssetStatusColor: (status: AssetStatus): string => {
    const statusColors: Record<AssetStatus, string> = {
      AVAILABLE: 'bg-green-500/20 text-green-400',
      ASSIGNED: 'bg-blue-500/20 text-blue-400',
      UNDER_MAINTENANCE: 'bg-yellow-500/20 text-yellow-400',
      RETIRED: 'bg-muted text-muted-foreground'
    }
    return statusColors[status] || 'bg-muted text-muted-foreground'
  },

  getRoleColor: (role: UserRole): string => {
    const roleColors: Record<UserRole, string> = {
      END_USER: 'bg-blue-500/20 text-blue-400',
      ADMIN: 'bg-purple-500/20 text-purple-400'
    }
    return roleColors[role] || 'bg-muted text-muted-foreground'
  }
}

// Data transformation utilities
export const transformUtils = {
  toSelectOptions: <T extends Record<string, unknown>>(
    items: T[], 
    valueKey: keyof T, 
    labelKey: keyof T
  ): SelectOption[] => {
    return items.map(item => ({
      value: String(item[valueKey]),
      label: String(item[labelKey])
    }))
  },

  toStatusOptions: <T extends Record<string, unknown>>(
    items: T[], 
    valueKey: keyof T, 
    labelKey: keyof T,
    colorKey: keyof T
  ): StatusOption[] => {
    return items.map(item => ({
      value: String(item[valueKey]),
      label: String(item[labelKey]),
      color: String(item[colorKey])
    }))
  }
}

// Local storage utilities
export const storageUtils = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null
    
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return defaultValue || null
      return JSON.parse(item)
    } catch {
      return defaultValue || null
    }
  },

  set: (key: string, value: unknown) => {
    if (typeof window === 'undefined') return
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return
    
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  }
}

// Debounce and throttle utilities
export const performanceUtils = {
  debounce: <T extends (...args: unknown[]) => unknown>(
    func: T, 
    wait: number
  ): (...args: Parameters<T>) => void => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  throttle: <T extends (...args: unknown[]) => unknown>(
    func: T, 
    limit: number
  ): (...args: Parameters<T>) => void => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

// Error handling utilities
export const errorUtils = {
  getErrorMessage: (error: unknown): string => {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    return 'An unexpected error occurred'
  },

  isNetworkError: (error: unknown): boolean => {
    return error instanceof Error && 
           (error.message.includes('fetch') || 
            error.message.includes('network') ||
            error.message.includes('NetworkError'))
  }
}
