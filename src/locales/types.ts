// TypeScript types for localized strings

export interface CommonStrings {
  // Generic buttons
  save: string
  cancel: string
  delete: string
  edit: string
  create: string
  update: string
  submit: string
  loading: string
  
  // Generic labels
  name: string
  description: string
  status: string
  created: string
  type: string
  category: string
  email: string
  password: string
  
  // Status indicators
  noData: string
  noDataFound: string
  loadingGeneric: string
  
  // Form validation
  required: string
  invalidEmail: string
  
  // Roles
  admin: string
  endUser: string
  
  // Priorities
  priorityLow: string
  priorityMedium: string
  priorityHigh: string
  priorityCritical: string
  
  // Statuses
  statusOpen: string
  statusInProgress: string
  statusResolved: string
  statusClosed: string
  statusAvailable: string
  statusAssigned: string
  statusUnderMaintenance: string
  statusRetired: string
}

export interface AuthStrings {
  // Page content
  appTitle: string
  signInPrompt: string
  signInButton: string
  signingIn: string
  
  // Form labels
  emailLabel: string
  passwordLabel: string
  emailPlaceholder: string
  passwordPlaceholder: string
  
  // Demo credentials
  demoCredentials: string
  endUserCredentials: string
  adminCredentials: string
  
  // Actions
  welcomeMessage: string
  logOut: string
  
  // Access control
  loginRequired: string
  accessDenied: string
}

export interface DashboardStrings {
  // Page header
  title: string
  subtitle: string
  
  // Stats cards
  totalTickets: string
  openTickets: string
  totalAssets: string
  assignedAssets: string
  
  // Stats descriptions
  noTicketsYet: string
  ticketsOpen: string
  noOpenTickets: string
  requiresAttention: string
  noAssetsYet: string
  hardwareAndSoftware: string
  noAssignedAssets: string
  currentlyInUse: string
  
  // Quick actions
  quickActions: string
  createTicket: string
  addAsset: string
  addUser: string
  
  // Recent tickets
  recentTickets: string
  viewAll: string
  loadingRecentTickets: string
  noTicketsMessage: string
  
  // Error messages
  statsLoadError: string
  statsLoadErrorDescription: string
}

export interface TicketsStrings {
  // Page header
  title: string
  subtitle: string
  
  // Create dialog
  createNewTicket: string
  createTicketDescription: string
  titleLabel: string
  titlePlaceholder: string
  descriptionLabel: string
  descriptionPlaceholder: string
  priorityLabel: string
  categoryLabel: string
  selectPriority: string
  selectCategory: string
  
  // List states
  loadingTickets: string
  noTicketsFound: string
  noTicketsFoundMessage: string
  
  // Ticket details
  categoryPrefix: string
  createdPrefix: string
  byPrefix: string
  statusLabel: string
  assignToLabel: string
  unassigned: string
  
  // Validation messages
  titleRequired: string
  descriptionMinLength: string
  categoryRequired: string
  
  // Categories
  categoryHardware: string
  categorySoftware: string
  categoryNetwork: string
  categoryAccess: string
  categoryOther: string
}

export interface AssetsStrings {
  // Page header
  title: string
  subtitle: string
  
  // Create dialog
  createNewAsset: string
  createAssetDescription: string
  nameLabel: string
  namePlaceholder: string
  typeLabel: string
  serialNumberLabel: string
  serialNumberPlaceholder: string
  selectType: string
  
  // List states
  loadingAssets: string
  noAssetsFound: string
  noAssetsFoundMessage: string
  
  // Asset details
  typePrefix: string
  serialNumberPrefix: string
  createdPrefix: string
  purchaseDatePrefix: string
  assignedToPrefix: string
  statusLabel: string
  assignToLabel: string
  unassigned: string
  
  // Validation messages
  nameRequired: string
  
  // Asset Types
  typeComputer: string
  typeMonitor: string
  typeKeyboard: string
  typeMouse: string
  typeNetworkEquipment: string
  typePrinter: string
  typeOther: string
}

export interface UsersStrings {
  // Page header
  title: string
  subtitle: string
  
  // Create dialog
  createNewUser: string
  createUserDescription: string
  fullNameLabel: string
  fullNamePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  roleLabel: string
  selectRole: string
  
  // List states
  loadingUsers: string
  noUsersFound: string
  noUsersFoundMessage: string
  
  // User details
  createdPrefix: string
  ticketsPrefix: string
  assetsPrefix: string
  
  // Validation messages
  fullNameRequired: string
  emailRequired: string
  passwordRequired: string
  passwordMinLength: string
  
  // Actions
  createUser: string
  creatingUser: string
}

export interface NavigationStrings {
  // Menu items
  dashboard: string
  tickets: string
  assets: string
  users: string
  settings: string
  
  // Page titles and descriptions
  welcomeTitle: string
  welcomeSubtitle: string
  
  // Card content
  ticketsCardTitle: string
  ticketsCardDescription: string
  assetsCardTitle: string
  assetsCardDescription: string
  usersCardTitle: string
  usersCardDescription: string
  
  // Buttons
  viewTickets: string
  viewAssets: string
  manageUsers: string
  
  // Layout
  itServiceDesk: string
}

export interface NotificationsStrings {
  // Ticket notifications
  ticketCreated: string
  ticketUpdated: string
  ticketAssigned: string
  ticketError: string
  creatingTicket: string
  
  // Asset notifications
  assetCreated: string
  assetUpdated: string
  assetAssigned: string
  assetError: string
  updatingAssetStatus: string
  updatingAssetAssignment: string
  
  // User notifications
  userCreated: string
  userUpdated: string
  userError: string
  
  // Auth notifications
  loginError: string
  loginSuccess: string
  logoutSuccess: string
  authRequired: string
  authRequiredDescription: string
  
  // Generic notifications
  genericError: string
  loadingGeneric: string
  
  // Asset specific
  assetStatusUpdated: string
  assetAssignmentUpdated: string
  assetStatusUpdateFailed: string
  assetAssignmentUpdateFailed: string
  assetsLoadError: string
  assetsLoadErrorDescription: string
}

// Main interface containing all string categories
export interface LocaleStrings {
  common: CommonStrings
  auth: AuthStrings
  dashboard: DashboardStrings
  tickets: TicketsStrings
  assets: AssetsStrings
  users: UsersStrings
  navigation: NavigationStrings
  notifications: NotificationsStrings
}

// Helper type for nested string access
export type StringPath<T> = T extends string 
  ? [] 
  : { [K in keyof T]: [K, ...StringPath<T[K]>] }[keyof T]

export type StringKey = StringPath<LocaleStrings>

// Dynamic locale support types
export type LocaleCode = string
export type LocaleRegistry = Map<LocaleCode, LocaleStrings>

// Validation and discovery types
export interface LocaleMetadata {
  code: string
  name: string
  isComplete: boolean
  lastValidated: Date
  fileCount: number
  requiredFiles: string[]
  loadedFiles: string[]
}

export interface LocaleDiscoveryResult {
  availableLocales: string[]
  defaultLocale: string
  discoveredAt: Date
  localeMetadata: LocaleMetadata[]
}

export interface LocaleLoadResult {
  locale: string
  success: boolean
  data: LocaleStrings | null
  error?: string
  loadedAt: Date
  cacheHit: boolean
}

// Fallback chain types
export interface LocaleFallbackConfig {
  primary: string
  fallbacks: string[]
  strict: boolean // If true, throw on missing translations instead of using fallbacks
}

// Runtime locale system state
export interface LocaleSystemState {
  currentLocale: string
  supportedLocales: string[]
  loadedLocales: string[]
  initialized: boolean
  fallbackChain: string[]
  validationResults: Map<string, boolean>
}

// Function overload types for backward compatibility
export type SyncStringGetter<T extends keyof LocaleStrings> = () => LocaleStrings[T]
export type AsyncStringGetter<T extends keyof LocaleStrings> = () => Promise<LocaleStrings[T]>

export type SyncCategoryStringGetter<T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]> = 
  (category: T, key: K) => LocaleStrings[T][K]

export type AsyncCategoryStringGetter<T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]> = 
  (category: T, key: K) => Promise<LocaleStrings[T][K]>

// Enhanced string getter with fallback support
export type SafeStringGetter<T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]> = 
  (category: T, key: K, fallback?: string) => Promise<string>

// Interpolation types
export type InterpolationValues = Record<string, string | number>
export type InterpolatedStringGetter<T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]> = 
  (category: T, key: K, values: InterpolationValues) => Promise<string>

// React hook return types
export interface UseStringsReturn {
  // Data getters (sync)
  strings: SyncStringGetter<keyof LocaleStrings>
  common: SyncStringGetter<'common'>
  auth: SyncStringGetter<'auth'>
  dashboard: SyncStringGetter<'dashboard'>
  tickets: SyncStringGetter<'tickets'>
  assets: SyncStringGetter<'assets'>
  users: SyncStringGetter<'users'>
  navigation: SyncStringGetter<'navigation'>
  notifications: SyncStringGetter<'notifications'>
  
  // Locale state
  currentLocale: string
  supportedLocales: string[]
  
  // Functions
  setLocale: (locale: string) => Promise<boolean>
  setLocaleSync: (locale: string) => void
  getString: <T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]>(category: T, key: K) => LocaleStrings[T][K]
  getStringSafe: <T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]>(category: T, key: K, fallback?: string) => Promise<string>
  getInterpolatedString: <T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]>(category: T, key: K, values: InterpolationValues) => string
  interpolate: (template: string, values: InterpolationValues) => string
  
  // Utility functions
  initializeLocaleSystem: () => Promise<void>
  validateLocale: (locale: string, reference?: string) => Promise<CompleteLocaleValidation>
}

export interface UseStringsAsyncReturn {
  // Data getters (async)
  strings: AsyncStringGetter<keyof LocaleStrings>
  common: AsyncStringGetter<'common'>
  auth: AsyncStringGetter<'auth'>
  dashboard: AsyncStringGetter<'dashboard'>
  tickets: AsyncStringGetter<'tickets'>
  assets: AsyncStringGetter<'assets'>
  users: AsyncStringGetter<'users'>
  navigation: AsyncStringGetter<'navigation'>
  notifications: AsyncStringGetter<'notifications'>
  
  // Functions
  getString: <T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]>(category: T, key: K) => Promise<LocaleStrings[T][K]>
  getStringSafe: <T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]>(category: T, key: K, fallback?: string) => Promise<string>
  getInterpolatedString: <T extends keyof LocaleStrings, K extends keyof LocaleStrings[T]>(category: T, key: K, values: InterpolationValues) => Promise<string>
  interpolate: (template: string, values: InterpolationValues) => string
  
  // Locale state
  currentLocale: string
  supportedLocales: string[]
  setLocale: (locale: string) => Promise<boolean>
  
  // Utility functions
  initializeLocaleSystem: () => Promise<void>
  validateLocale: (locale: string, reference?: string) => Promise<CompleteLocaleValidation>
}

// Type guards
export function isValidLocaleStrings(obj: unknown): obj is LocaleStrings {
  if (!obj || typeof obj !== 'object') return false
  
  const required: Array<keyof LocaleStrings> = [
    'common', 'auth', 'dashboard', 'tickets', 'assets', 
    'users', 'navigation', 'notifications'
  ]
  
  return required.every(key => key in (obj as Record<string, unknown>))
}

// Utility type for partial locale strings (for incomplete translations)
export type PartialLocaleStrings = {
  [K in keyof LocaleStrings]?: Partial<LocaleStrings[K]>
}

// Type for locale file validation
export interface LocaleFileValidation {
  category: keyof LocaleStrings
  filename: string
  exists: boolean
  valid: boolean
  keyCount: number
  missingKeys: string[]
  extraKeys: string[]
}

// Complete locale validation result
export interface CompleteLocaleValidation {
  locale: string
  isComplete: boolean
  fileValidations: LocaleFileValidation[]
  summary: {
    totalFiles: number
    validFiles: number
    totalKeys: number
    missingKeys: number
    extraKeys: number
  }
}

// All original types are already exported as interfaces above
// No need for additional exports
