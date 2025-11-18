'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { CreateContentDialog } from './CreateContentDialog'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

export function CreateContentButton() {
  const dashboardStrings = useLocalizedStrings().getStrings().dashboard
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        {dashboardStrings.addContent}
      </Button>
      
      <CreateContentDialog 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  )
}

