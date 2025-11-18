'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { CreateContentRequestDialog } from './CreateContentRequestDialog'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

export function CreateContentRequestButton() {
  const { getStrings } = useLocalizedStrings()
  const dashboardStrings = getStrings().dashboard
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        {dashboardStrings.createContentRequest}
      </Button>
      
      <CreateContentRequestDialog 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  )
}

