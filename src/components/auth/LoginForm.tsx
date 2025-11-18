'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { notifications, NOTIFICATION_MESSAGES } from '@/lib/notifications'


export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const authStrings = useLocalizedStrings().getStrings().auth

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const loadingToast = notifications.loading(authStrings.signingIn)

    try {
      const success = await login(email, password)
      notifications.dismiss(loadingToast)
      
      if (success) {
        notifications.success(NOTIFICATION_MESSAGES.LOGIN_SUCCESS, 'Welcome back!')
      } else {
        setError('Invalid email or password')
        notifications.error(NOTIFICATION_MESSAGES.LOGIN_ERROR, 'Please check your credentials and try again')
      }
    } catch {
      notifications.dismiss(loadingToast)
      const errorMessage = 'An error occurred during login'
      setError(errorMessage)
      notifications.error('Login failed', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{authStrings.appTitle}</CardTitle>
          <CardDescription className="text-center">
            {authStrings.signInPrompt}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{authStrings.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder={authStrings.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{authStrings.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                placeholder={authStrings.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-destructive text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? authStrings.signingIn : authStrings.signInButton}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center mb-2">{authStrings.demoCredentials}</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{authStrings.viewerCredentials}</p>
              <p>{authStrings.contentManagerCredentials}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
