import { z } from 'zod'

// Server-side validation schemas - more comprehensive than client-side
export const createContentRequestSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  category: z.string()
    .min(1, 'Category is required')
    .max(100, 'Category must be less than 100 characters')
    .trim(),
  viewerId: z.string().cuid('Invalid user ID'),
})

export const createContentSchema = z.object({
  name: z.string()
    .min(1, 'Content name is required')
    .max(200, 'Content name must be less than 200 characters')
    .trim(),
  type: z.string()
    .min(1, 'Content type is required')
    .max(100, 'Content type must be less than 100 characters')
    .trim(),
  genre: z.string()
    .min(1, 'Genre is required')
    .max(100, 'Genre must be less than 100 characters')
    .trim(),
  status: z.enum(['AVAILABLE', 'FEATURED', 'ARCHIVED', 'REMOVED']),
  releaseDate: z.date().optional().nullable(),
  duration: z.number().int().positive().optional().nullable(),
  rating: z.string()
    .max(10, 'Rating must be less than 10 characters')
    .trim()
    .optional()
    .nullable(),
  posterUrl: z.string()
    .url('Invalid poster URL')
    .max(500, 'Poster URL must be less than 500 characters')
    .trim()
    .optional()
    .nullable(),
  description: z.string()
    .max(5000, 'Description must be less than 5000 characters')
    .trim()
    .optional()
    .nullable(),
})

export const createUserSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .refine((name) => name.length >= 2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
  role: z.enum(['VIEWER', 'CONTENT_MANAGER']),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters')
    .refine((password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password), {
      message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    }),
})

export const updateContentRequestStatusSchema = z.object({
  contentRequestId: z.string().cuid('Invalid content request ID'),
  status: z.enum(['PENDING', 'IN_REVIEW', 'APPROVED', 'ADDED']),
})

export const updateContentStatusSchema = z.object({
  contentId: z.string().cuid('Invalid content ID'),
  status: z.enum(['AVAILABLE', 'FEATURED', 'ARCHIVED', 'REMOVED']),
})

export const assignContentRequestSchema = z.object({
  contentRequestId: z.string().cuid('Invalid content request ID'),
  reviewedBy: z.string().cuid('Invalid user ID'),
})

export const assignContentSchema = z.object({
  contentId: z.string().cuid('Invalid content ID'),
  assignedUserId: z.string().cuid('Invalid user ID').nullable(),
})

export const updateUserRoleSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  role: z.enum(['VIEWER', 'CONTENT_MANAGER']),
})

export const createBugSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  browserDevice: z.string()
    .max(200, 'Browser/device info must be less than 200 characters')
    .trim()
    .optional()
    .nullable(),
  affectedContentId: z.string().cuid('Invalid content ID').optional().nullable(),
  reporterId: z.string().cuid('Invalid user ID'),
})

export const updateBugStatusSchema = z.object({
  bugId: z.string().cuid('Invalid bug ID'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'FIXED', 'VERIFIED', 'CLOSED']),
})

export const assignBugSchema = z.object({
  bugId: z.string().cuid('Invalid bug ID'),
  assignedToId: z.string().cuid('Invalid user ID').nullable(),
})

// Input sanitization helpers
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .slice(0, 10000) // Limit length as safety measure
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().slice(0, 255)
}

export function validateCuid(id: string): boolean {
  return z.string().cuid().safeParse(id).success
}

// Validation wrapper function for server actions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
    throw new Error(`Validation failed: ${errors}`)
  }
  
  return result.data
}

// Rate limiting helpers (basic implementation)
const rateLimitMap = new Map<string, number[]>()

export function checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const requests = rateLimitMap.get(identifier) || []
  
  // Remove old requests outside the window
  const recentRequests = requests.filter(time => now - time < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return false
  }
  
  recentRequests.push(now)
  rateLimitMap.set(identifier, recentRequests)
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    for (const [key, times] of rateLimitMap.entries()) {
      const recent = times.filter(time => now - time < windowMs * 2)
      if (recent.length === 0) {
        rateLimitMap.delete(key)
      } else {
        rateLimitMap.set(key, recent)
      }
    }
  }
  
  return true
}
