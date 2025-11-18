'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ContentList } from '@/components/content/ContentList'
import { CreateContentButton } from '@/components/content/CreateContentButton'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'


export default function ContentPage() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const contentStrings = getStrings().content
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{contentStrings.title}</h1>
              <p className="text-muted-foreground mt-2">
                {contentStrings.subtitle}
              </p>
            </div>
            {user?.role === 'CONTENT_MANAGER' && <CreateContentButton />}
          </div>
          
          <ContentList />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

