'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ContentRequestList } from '@/components/content-requests/ContentRequestList'
import { CreateContentRequestButton } from '@/components/content-requests/CreateContentRequestButton'
import { useLocalizedStrings } from '@/contexts/LocaleContext'


export default function ContentRequestsPage() {
  const { getStrings } = useLocalizedStrings()
  const contentRequestsStrings = getStrings().contentRequests
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{contentRequestsStrings.title}</h1>
              <p className="text-muted-foreground mt-2">
                {contentRequestsStrings.subtitle}
              </p>
            </div>
            <CreateContentRequestButton />
          </div>
          
          <ContentRequestList />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

