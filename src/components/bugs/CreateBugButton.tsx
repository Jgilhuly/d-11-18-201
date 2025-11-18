'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { CreateBugDialog } from './CreateBugDialog'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

export function CreateBugButton() {
  const { getStrings } = useLocalizedStrings()
  const bugStrings = getStrings().bugs
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        {bugStrings.createTitle}
      </Button>
      
      <CreateBugDialog 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  )
}

