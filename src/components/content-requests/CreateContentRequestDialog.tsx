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
import { getPriorities, getContentGenres } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { createContentRequest } from '@/lib/actions/content-requests'
import { notifications, NOTIFICATION_MESSAGES } from '@/lib/notifications'

const contentRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  category: z.string().min(1, 'Category is required'),
})

type ContentRequestFormData = z.infer<typeof contentRequestSchema>

interface CreateContentRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateContentRequestDialog({ open, onOpenChange }: CreateContentRequestDialogProps) {
  const { user } = useAuth()
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<ContentRequestFormData>({
    resolver: zodResolver(contentRequestSchema),
    defaultValues: {
      priority: 'MEDIUM',
      category: 'MOVIE',
    },
  })

  const onSubmit = async (data: ContentRequestFormData) => {
    if (!user) {
      notifications.error('Authentication required', 'Please log in to create a content request')
      return
    }
    
    setIsSubmitting(true)
    const loadingToast = notifications.loading('Creating content request...')
    
    try {
      await createContentRequest({
        ...data,
        viewerId: user.id,
      })
      notifications.dismiss(loadingToast)
      notifications.success(NOTIFICATION_MESSAGES.CONTENT_REQUEST_CREATED, `Content request "${data.title}" has been created`)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      notifications.dismiss(loadingToast)
      console.error('Failed to create content request:', error)
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
          <DialogTitle>{strings.contentRequests.createTitle}</DialogTitle>
          <DialogDescription>
            {strings.contentRequests.createDescription}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{strings.contentRequests.titleLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder="Request title" {...field} />
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
                  <FormLabel>{strings.contentRequests.descriptionLabel}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Why should this content be added?"
                      className="min-h-[100px]"
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
                    <FormLabel>{strings.contentRequests.priorityLabel}</FormLabel>
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{strings.contentRequests.genreLabel}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getContentGenres(strings).map((genre) => (
                          <SelectItem key={genre.value} value={genre.value}>
                            {genre.label}
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
                {isSubmitting ? strings.common.loading : strings.contentRequests.createTitle}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

