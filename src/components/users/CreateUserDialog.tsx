'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createUser } from '@/lib/actions/users'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import type { LocaleStrings } from '@/lib/locale-strings'

function createUserSchema(usersStrings: LocaleStrings['users'], commonStrings: LocaleStrings['common']) {
  return z.object({
    name: z.string().min(1, usersStrings.fullNameRequired),
    email: z.string().email(commonStrings.invalidEmail),
    role: z.enum(['VIEWER', 'CONTENT_MANAGER']),
    password: z.string().min(6, usersStrings.passwordMinLength),
  })
}

type UserFormData = {
  name: string;
  email: string;
  role: 'VIEWER' | 'CONTENT_MANAGER';
  password: string;
}

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const { getStrings, currentLocale } = useLocalizedStrings()
  const strings = getStrings()
  const usersStrings = strings.users
  const commonStrings = strings.common
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Create schema with current locale strings
  const userSchema = useMemo(
    () => createUserSchema(usersStrings, commonStrings),
    [usersStrings, commonStrings]
  )
  
  // Re-initialize form when locale changes
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'VIEWER',
    },
  })

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true)
    try {
      await createUser(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create user:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" key={currentLocale}>
        <DialogHeader>
          <DialogTitle>{usersStrings.createNewUser}</DialogTitle>
          <DialogDescription>
            {usersStrings.createUserDescription}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                              <FormItem>
                <FormLabel>{usersStrings.fullNameLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={usersStrings.fullNamePlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                              <FormItem>
                <FormLabel>{usersStrings.emailLabel}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={usersStrings.emailPlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                                  <FormItem>
                  <FormLabel>{usersStrings.roleLabel}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={usersStrings.selectRole} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="VIEWER">{commonStrings.viewer}</SelectItem>
                      <SelectItem value="CONTENT_MANAGER">{commonStrings.contentManager}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                                  <FormItem>
                  <FormLabel>{usersStrings.passwordLabel}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={usersStrings.passwordPlaceholder} {...field} />
                  </FormControl>
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
                {commonStrings.cancel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? usersStrings.creatingUser : usersStrings.createUser}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
