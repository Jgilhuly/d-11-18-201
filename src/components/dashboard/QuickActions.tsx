'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FilmIcon, PlayIcon, UsersIcon } from 'lucide-react'
import { CreateContentRequestDialog } from '@/components/content-requests/CreateContentRequestDialog'
import { CreateContentDialog } from '@/components/content/CreateContentDialog'
import { CreateUserDialog } from '@/components/users/CreateUserDialog'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

export function QuickActions() {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const dashboardStrings = getStrings().dashboard
  const [contentRequestDialogOpen, setContentRequestDialogOpen] = useState(false)
  const [contentDialogOpen, setContentDialogOpen] = useState(false)
  const [userDialogOpen, setUserDialogOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{dashboardStrings.quickActions}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => setContentRequestDialogOpen(true)}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <FilmIcon className="h-6 w-6" />
              <span>{dashboardStrings.createContentRequest}</span>
            </Button>
            
            {user?.role === 'CONTENT_MANAGER' && (
              <Button 
                onClick={() => setContentDialogOpen(true)}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <PlayIcon className="h-6 w-6" />
                <span>{dashboardStrings.addContent}</span>
              </Button>
            )}
            
            {user?.role === 'CONTENT_MANAGER' && (
              <Button 
                onClick={() => setUserDialogOpen(true)}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <UsersIcon className="h-6 w-6" />
                <span>{dashboardStrings.addUser}</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateContentRequestDialog 
        open={contentRequestDialogOpen} 
        onOpenChange={setContentRequestDialogOpen} 
      />
      
      <CreateContentDialog 
        open={contentDialogOpen} 
        onOpenChange={setContentDialogOpen} 
      />
      
      <CreateUserDialog 
        open={userDialogOpen} 
        onOpenChange={setUserDialogOpen} 
      />
    </>
  )
}
