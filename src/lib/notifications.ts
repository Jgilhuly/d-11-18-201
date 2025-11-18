import { toast } from "sonner"
import { englishStrings } from '@/lib/locale-strings'

export const notifications = {
  success: (message: string, description?: string) => {
    toast.success(message, { description })
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description })
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description })
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description })
  },
  loading: (message: string) => {
    return toast.loading(message)
  },
  dismiss: (id: string | number) => {
    toast.dismiss(id)
  },
}

// Notification message functions
export const NOTIFICATION_MESSAGES = {
  CONTENT_REQUEST_CREATED: englishStrings.notifications.contentRequestCreated,
  CONTENT_REQUEST_UPDATED: englishStrings.notifications.contentRequestUpdated,
  CONTENT_REQUEST_ASSIGNED: 'Content request assigned successfully',
  CONTENT_REQUEST_ERROR: 'Error managing content request',
  
  CONTENT_CREATED: englishStrings.notifications.contentCreated,
  CONTENT_UPDATED: englishStrings.notifications.contentUpdated,
  CONTENT_ASSIGNED: 'Content featured successfully',
  CONTENT_ERROR: 'Error managing content',
  
  USER_CREATED: englishStrings.notifications.userCreated,
  USER_UPDATED: englishStrings.notifications.userUpdated,
  USER_ERROR: 'Error managing viewer',
  
  LOGIN_ERROR: englishStrings.auth.loginError,
  LOGIN_SUCCESS: englishStrings.notifications.loginSuccess,
  LOGOUT_SUCCESS: englishStrings.notifications.logoutSuccess,
  
  GENERIC_ERROR: 'An error occurred',
  LOADING: 'Loading...',
} as const
