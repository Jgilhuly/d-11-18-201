'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { validateInput, createContentSchema, updateContentStatusSchema, assignContentSchema, checkRateLimit } from '@/lib/validation'

export interface CreateContentData {
  name: string
  type: string
  genre: string
  status: 'AVAILABLE' | 'FEATURED' | 'ARCHIVED' | 'REMOVED'
  releaseDate?: Date
  duration?: number
  rating?: string
  posterUrl?: string
  description?: string
}

export async function createContent(data: CreateContentData) {
  if (!checkRateLimit(`create-content`, 10, 60000)) {
    throw new Error('Too many requests. Please try again in a minute.')
  }

  const validatedData = validateInput(createContentSchema, data)
  
  try {
    const content = await prisma.content.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        genre: validatedData.genre,
        status: validatedData.status,
        releaseDate: validatedData.releaseDate,
        duration: validatedData.duration,
        rating: validatedData.rating,
        posterUrl: validatedData.posterUrl,
        description: validatedData.description,
      },
    })
    
    revalidatePath('/content')
    revalidatePath('/dashboard')
    return content
  } catch (error) {
    console.error('Failed to create content:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create content. Please try again.')
  }
}

export async function getContent() {
  return await prisma.content.findMany({
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateContentStatus(contentId: string, status: string) {
  const validatedData = validateInput(updateContentStatusSchema, { contentId, status })
  
  try {
    const contentExists = await prisma.content.findUnique({
      where: { id: validatedData.contentId },
      select: { id: true }
    })
    
    if (!contentExists) {
      throw new Error('Content not found')
    }

    const content = await prisma.content.update({
      where: { id: validatedData.contentId },
      data: { status: validatedData.status },
    })
    
    revalidatePath('/content')
    revalidatePath('/dashboard')
    return content
  } catch (error) {
    console.error('Failed to update content status:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update content status. Please try again.')
  }
}

export async function assignContent(contentId: string, assignedUserId: string | null) {
  const validatedData = validateInput(assignContentSchema, { contentId, assignedUserId })
  
  try {
    const contentExists = await prisma.content.findUnique({
      where: { id: validatedData.contentId },
      select: { id: true }
    })
    
    if (!contentExists) {
      throw new Error('Content not found')
    }
    
    if (validatedData.assignedUserId) {
      const userExists = await prisma.user.findUnique({
        where: { id: validatedData.assignedUserId },
        select: { id: true }
      })
      
      if (!userExists) {
        throw new Error('User not found')
      }
    }

    const content = await prisma.content.update({
      where: { id: validatedData.contentId },
      data: { 
        assignedUserId: validatedData.assignedUserId,
        status: validatedData.assignedUserId ? 'FEATURED' : 'AVAILABLE'
      },
    })
    
    revalidatePath('/content')
    revalidatePath('/dashboard')
    return content
  } catch (error) {
    console.error('Failed to assign content:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to assign content. Please try again.')
  }
}

export async function getContentById(contentId: string) {
  return await prisma.content.findUnique({
    where: { id: contentId },
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true }
      }
    }
  })
}

