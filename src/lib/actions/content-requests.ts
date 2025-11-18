'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { validateInput, createContentRequestSchema, updateContentRequestStatusSchema, assignContentRequestSchema, checkRateLimit } from '@/lib/validation'

export interface CreateContentRequestData {
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  category: string
  viewerId: string
}

export async function createContentRequest(data: CreateContentRequestData) {
  if (!checkRateLimit(`create-content-request-${data.viewerId}`, 5, 60000)) {
    throw new Error('Too many requests. Please try again in a minute.')
  }

  const validatedData = validateInput(createContentRequestSchema, data)
  
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: validatedData.viewerId },
      select: { id: true }
    })
    
    if (!userExists) {
      throw new Error('User not found')
    }

    const contentRequest = await prisma.contentRequest.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        category: validatedData.category,
        viewerId: validatedData.viewerId,
        status: 'PENDING',
      },
    })
    
    revalidatePath('/content-requests')
    revalidatePath('/dashboard')
    return contentRequest
  } catch (error) {
    console.error('Failed to create content request:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create content request. Please try again.')
  }
}

export async function getContentRequests(viewerId: string, userRole: string) {
  if (userRole === 'CONTENT_MANAGER') {
    return await prisma.contentRequest.findMany({
      include: {
        viewer: {
          select: { id: true, name: true, email: true }
        },
        reviewer: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
  
  return await prisma.contentRequest.findMany({
    where: { viewerId },
    include: {
      viewer: {
        select: { id: true, name: true, email: true }
      },
      reviewer: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateContentRequestStatus(contentRequestId: string, status: string) {
  const validatedData = validateInput(updateContentRequestStatusSchema, { contentRequestId, status })
  
  try {
    const contentRequestExists = await prisma.contentRequest.findUnique({
      where: { id: validatedData.contentRequestId },
      select: { id: true }
    })
    
    if (!contentRequestExists) {
      throw new Error('Content request not found')
    }

    const contentRequest = await prisma.contentRequest.update({
      where: { id: validatedData.contentRequestId },
      data: { status: validatedData.status },
    })
    
    revalidatePath('/content-requests')
    revalidatePath('/dashboard')
    return contentRequest
  } catch (error) {
    console.error('Failed to update content request status:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update content request status. Please try again.')
  }
}

export async function assignContentRequest(contentRequestId: string, reviewedBy: string) {
  const validatedData = validateInput(assignContentRequestSchema, { contentRequestId, reviewedBy })
  
  try {
    const [contentRequestExists, userExists] = await Promise.all([
      prisma.contentRequest.findUnique({
        where: { id: validatedData.contentRequestId },
        select: { id: true }
      }),
      prisma.user.findUnique({
        where: { id: validatedData.reviewedBy },
        select: { id: true, role: true }
      })
    ])
    
    if (!contentRequestExists) {
      throw new Error('Content request not found')
    }
    
    if (!userExists) {
      throw new Error('User not found')
    }
    
    if (userExists.role !== 'CONTENT_MANAGER') {
      throw new Error('Only content managers can review content requests')
    }

    const contentRequest = await prisma.contentRequest.update({
      where: { id: validatedData.contentRequestId },
      data: { reviewedBy: validatedData.reviewedBy },
    })
    
    revalidatePath('/content-requests')
    return contentRequest
  } catch (error) {
    console.error('Failed to assign content request:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to assign content request. Please try again.')
  }
}

export async function getContentRequestById(contentRequestId: string) {
  return await prisma.contentRequest.findUnique({
    where: { id: contentRequestId },
    include: {
      viewer: {
        select: { id: true, name: true, email: true }
      },
      reviewer: {
        select: { id: true, name: true, email: true }
      }
    }
  })
}

export async function exportContentRequestsToCSV(viewerId: string, userRole: string) {
  try {
    const contentRequests = await getContentRequests(viewerId, userRole)

    const csvData = contentRequests.map((request) => ({
      title: request.title,
      description: request.description,
      priority: request.priority,
      status: request.status,
      category: request.category,
      createdBy: request.viewer?.name || request.viewer?.email || '',
      createdDate: request.createdAt,
      reviewedBy: request.reviewer?.name || request.reviewer?.email || '',
    }))

    return csvData
  } catch (error) {
    console.error('Failed to export content requests:', error)
    throw new Error('Failed to export content requests. Please try again.')
  }
}

