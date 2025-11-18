// Core entity types based on Prisma models
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
  contentRequests?: ContentRequest[]
  reviewedContentRequests?: ContentRequest[]
  content?: Content[]
  subscriptions?: Subscription[]
}

export interface ContentRequest {
  id: string
  title: string
  description: string
  priority: ContentRequestPriority
  category: string
  status: ContentRequestStatus
  viewerId: string
  reviewedBy: string | null
  createdAt: Date
  updatedAt: Date
  viewer?: Pick<User, 'id' | 'name' | 'email'>
  reviewer?: Pick<User, 'id' | 'name' | 'email'> | null
}

export interface Content {
  id: string
  name: string
  type: ContentType
  genre: ContentGenre
  status: ContentStatus
  releaseDate: Date | null
  duration: number | null
  rating: string | null
  posterUrl: string | null
  description: string | null
  assignedUserId: string | null
  createdAt: Date
  assignedUser?: Pick<User, 'id' | 'name' | 'email'> | null
}

export interface Subscription {
  id: string
  name: string
  planType: string
  price: number | null
  expiryDate: Date | null
  assignedUserId: string | null
  createdAt: Date
  assignedUser?: Pick<User, 'id' | 'name' | 'email'> | null
}

export interface Bug {
  id: string
  title: string
  description: string
  priority: BugPriority
  status: BugStatus
  browserDevice: string | null
  affectedContentId: string | null
  reporterId: string
  assignedToId: string | null
  createdAt: Date
  updatedAt: Date
  reporter?: Pick<User, 'id' | 'name' | 'email'>
  assignedTo?: Pick<User, 'id' | 'name' | 'email'> | null
  affectedContent?: Pick<Content, 'id' | 'name' | 'type'> | null
}

// Enum types
export type UserRole = 'VIEWER' | 'CONTENT_MANAGER'
export type ContentRequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type ContentRequestStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'ADDED'
export type ContentStatus = 'AVAILABLE' | 'FEATURED' | 'ARCHIVED' | 'REMOVED'
export type ContentType = 'MOVIE' | 'TV_SERIES' | 'DOCUMENTARY' | 'SHORT_FILM' | 'SPECIAL' | 'ORIGINAL' | 'OTHER'
export type ContentGenre = 'MOVIE' | 'SERIES' | 'DOCUMENTARY' | 'SHORT' | 'SPECIAL' | 'OTHER'
export type ContentRating = 'G' | 'PG' | 'PG-13' | 'R' | 'TV-Y' | 'TV-Y7' | 'TV-G' | 'TV-PG' | 'TV-14' | 'TV-MA'
export type BugPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type BugStatus = 'OPEN' | 'IN_PROGRESS' | 'FIXED' | 'VERIFIED' | 'CLOSED'

// Extended user type for UI components
export interface UserWithCounts extends Omit<User, 'contentRequests' | 'reviewedContentRequests' | 'content' | 'subscriptions'> {
  _count: {
    contentRequests: number
    content: number
  }
}

export interface UserProfile extends User {
  contentRequests: Pick<ContentRequest, 'id' | 'title' | 'status' | 'createdAt'>[]
  content: Pick<Content, 'id' | 'name' | 'type' | 'status'>[]
}

// Dashboard statistics type
export interface DashboardStats {
  totalContentRequests: number
  pendingContentRequests: number
  totalContent: number
  featuredContent: number
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form data types
export interface CreateContentRequestFormData {
  title: string
  description: string
  priority: ContentRequestPriority
  category: string
}

export interface CreateContentFormData {
  name: string
  type: ContentType
  genre: ContentGenre
  status: ContentStatus
  releaseDate?: Date
  duration?: number
  rating?: string
  posterUrl?: string
  description?: string
}

export interface CreateUserFormData {
  name: string
  email: string
  role: UserRole
  password: string
}

export interface CreateBugFormData {
  title: string
  description: string
  priority: BugPriority
  browserDevice?: string
  affectedContentId?: string
}

// Filter and sort types
export interface ContentRequestFilters {
  status?: ContentRequestStatus
  priority?: ContentRequestPriority
  category?: string
  reviewedBy?: string
  viewerId?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface ContentFilters {
  status?: ContentStatus
  type?: ContentType
  genre?: ContentGenre
  assignedTo?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface BugFilters {
  status?: BugStatus
  priority?: BugPriority
  assignedTo?: string
  reporterId?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export type SortDirection = 'asc' | 'desc'

export interface SortOptions {
  field: string
  direction: SortDirection
}

// Component prop types
export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface TableColumn<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface StatusOption extends SelectOption {
  color: string
  icon?: React.ReactNode
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationConfig {
  type: NotificationType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Error types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApplicationError extends Error {
  code: string
  statusCode?: number
  cause?: unknown
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system'

// Navigation types
export interface NavItem {
  name: string
  href: string
  icon?: React.ReactNode
  badge?: number
  requiredRole?: UserRole
  children?: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

// Search and pagination
export interface SearchParams {
  q?: string
  page?: number
  limit?: number
  sort?: string
  order?: SortDirection
  filters?: Record<string, string | string[]>
}

// File upload types
export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

// Audit/logging types
export interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  userId: string
  userName: string
  timestamp: Date
  changes?: Record<string, { old: unknown; new: unknown }>
  metadata?: Record<string, unknown>
}

// Feature flags and permissions
export interface Permission {
  resource: string
  action: string
  conditions?: Record<string, unknown>
}

export interface FeatureFlag {
  name: string
  enabled: boolean
  conditions?: Record<string, unknown>
}

// Utility types
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>
export type OptionalBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
