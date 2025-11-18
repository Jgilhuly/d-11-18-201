'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getPriorities } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { createBug } from '@/lib/actions/bugs'
import { getContent } from '@/lib/actions/content'
import { notifications, NOTIFICATION_MESSAGES } from '@/lib/notifications'

const bugSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  browserDevice: z.string().optional(),
  affectedContentId: z.string().optional(),
})

type BugFormData = z.infer<typeof bugSchema>

interface CreateBugDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBugDialog({ open, onOpenChange }: CreateBugDialogProps) {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contentList, setContentList] = useState<Array<{ id: string; name: string }>>([])
  
  const form = useForm<BugFormData>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      priority: 'MEDIUM',
    },
  })

  const loadContent = async () => {
    try {
      const content = await getContent()
      setContentList(content)
    } catch (error) {
      console.error('Failed to load content:', error)
    }
  }

  const onSubmit = async (data: BugFormData) => {
    if (!user) {
      notifications.error('Authentication required', 'Please log in to report a bug')
      return
    }
    
    setIsSubmitting(true)
    const loadingToast = notifications.loading('Creating bug report...')
    
    try {
      await createBug({
        ...data,
        browserDevice: data.browserDevice || null,
        affectedContentId: data.affectedContentId || null,
        reporterId: user.id,
      })
      notifications.dismiss(loadingToast)
      notifications.success(NOTIFICATION_MESSAGES.BUG_CREATED || 'Bug created', `Bug report "${data.title}" has been created`)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      notifications.dismiss(loadingToast)
      console.error('Failed to create bug:', error)
      notifications.error(
        'Error',
        error instanceof Error ? error.message : 'Please try again later'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{strings.bugs.createTitle}</DialogTitle>
          <DialogDescription>
            {strings.bugs.createDescription}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{strings.bugs.titleLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder="Bug title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{strings.bugs.descriptionLabel}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the bug and steps to reproduce"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="browserDevice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{strings.bugs.browserDeviceLabel}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Chrome 120 on Windows 11" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{strings.bugs.priorityLabel}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getPriorities(strings).map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="affectedContentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{strings.bugs.affectedContentLabel}</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      onOpenChange={(isOpen) => {
                        if (isOpen && contentList.length === 0) {
                          loadContent()
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {contentList.map((content) => (
                          <SelectItem key={content.id} value={content.id}>
                            {content.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {strings.common.cancel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? strings.common.loading : strings.bugs.createTitle}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

