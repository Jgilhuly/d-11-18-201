'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ViewershipStats } from '@/components/viewership/ViewershipStats'
import { ViewershipCharts } from '@/components/viewership/ViewershipCharts'
import { TopContentList } from '@/components/viewership/TopContentList'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

export default function ViewershipPage() {
  const { getStrings } = useLocalizedStrings()
  const viewershipStrings = getStrings().viewership

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{viewershipStrings.title}</h1>
            <p className="text-muted-foreground mt-2">{viewershipStrings.subtitle}</p>
          </div>

          <ViewershipStats />
          <ViewershipCharts />
          <TopContentList />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

