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
import { getContentTypes, getContentStatuses } from '@/lib/constants'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { createContent } from '@/lib/actions/content'
import { notifications, NOTIFICATION_MESSAGES } from '@/lib/notifications'

const contentSchema = z.object({
  name: z.string().min(1, 'Title is required'),
  type: z.string().min(1, 'Type is required'),
  genre: z.string().min(1, 'Genre is required'),
  status: z.enum(['AVAILABLE', 'FEATURED', 'ARCHIVED', 'REMOVED']),
  releaseDate: z.string().optional(),
  duration: z.string().optional(),
  rating: z.string().optional(),
  posterUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  description: z.string().optional(),
})

type ContentFormData = z.infer<typeof contentSchema>

interface CreateContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateContentDialog({ open, onOpenChange }: CreateContentDialogProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      status: 'AVAILABLE',
      type: 'MOVIE',
      genre: 'MOVIE',
    },
  })

  const onSubmit = async (data: ContentFormData) => {
    setIsSubmitting(true)
    const loadingToast = notifications.loading('Adding content...')
    try {
      await createContent({
        ...data,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
        duration: data.duration ? parseInt(data.duration) : undefined,
        posterUrl: data.posterUrl || undefined,
        description: data.description || undefined,
      })
      notifications.dismiss(loadingToast)
      notifications.success(NOTIFICATION_MESSAGES.CONTENT_CREATED, 'Content added successfully')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      notifications.dismiss(loadingToast)
      console.error('Failed to create content:', error)
      notifications.error('Error', error instanceof Error ? error.message : 'Please try again later')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{strings.content.createTitle}</DialogTitle>
          <DialogDescription>
            {strings.content.createDescription}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{strings.content.nameLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Lion King, Frozen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{strings.content.typeLabel}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getContentTypes(strings).map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{strings.content.genreLabel}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MOVIE">Movie</SelectItem>
                        <SelectItem value="SERIES">Series</SelectItem>
                        <SelectItem value="DOCUMENTARY">Documentary</SelectItem>
                        <SelectItem value="SHORT">Short</SelectItem>
                        <SelectItem value="SPECIAL">Special</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{strings.content.statusLabel}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getContentStatuses(strings).map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
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
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{strings.content.ratingLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PG, G, TV-14" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{strings.content.releaseDateLabel}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{strings.content.durationLabel}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Minutes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="posterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{strings.content.posterUrlLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/poster.jpg" {...field} />
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
                  <FormLabel>{strings.common.description}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Content description..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                {isSubmitting ? strings.common.loading : strings.content.createTitle}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

