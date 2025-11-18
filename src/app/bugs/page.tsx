'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { BugList } from '@/components/bugs/BugList'
import { CreateBugButton } from '@/components/bugs/CreateBugButton'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

export default function BugsPage() {
  const { getStrings } = useLocalizedStrings()
  const bugStrings = getStrings().bugs
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{bugStrings.title}</h1>
              <p className="text-muted-foreground mt-2">
                {bugStrings.subtitle}
              </p>
            </div>
            <CreateBugButton />
          </div>
          
          <BugList />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

