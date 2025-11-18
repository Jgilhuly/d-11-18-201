'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentContentRequests } from '@/components/dashboard/RecentContentRequests'
import { useLocalizedStrings } from '@/contexts/LocaleContext'


export default function DashboardPage() {
  const { getStrings } = useLocalizedStrings()
  const dashboardStrings = getStrings().dashboard
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{dashboardStrings.title}</h1>
            <p className="text-muted-foreground mt-2">
              {dashboardStrings.subtitle}
            </p>
          </div>

          <DashboardStats />
          <QuickActions />
          <RecentContentRequests />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
