'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { validateInput, createBugSchema, updateBugStatusSchema, assignBugSchema, checkRateLimit } from '@/lib/validation'

export interface CreateBugData {
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  browserDevice?: string | null
  affectedContentId?: string | null
  reporterId: string
}

export async function createBug(data: CreateBugData) {
  if (!checkRateLimit(`create-bug-${data.reporterId}`, 5, 60000)) {
    throw new Error('Too many requests. Please try again in a minute.')
  }

  const validatedData = validateInput(createBugSchema, data)
  
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: validatedData.reporterId },
      select: { id: true }
    })
    
    if (!userExists) {
      throw new Error('User not found')
    }

    if (validatedData.affectedContentId) {
      const contentExists = await prisma.content.findUnique({
        where: { id: validatedData.affectedContentId },
        select: { id: true }
      })
      
      if (!contentExists) {
        throw new Error('Content not found')
      }
    }

    const bug = await prisma.bug.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        browserDevice: validatedData.browserDevice,
        affectedContentId: validatedData.affectedContentId,
        reporterId: validatedData.reporterId,
        status: 'OPEN',
      },
    })
    
    revalidatePath('/bugs')
    revalidatePath('/dashboard')
    return bug
  } catch (error) {
    console.error('Failed to create bug:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create bug. Please try again.')
  }
}

export async function getBugs(reporterId: string, userRole: string) {
  if (userRole === 'CONTENT_MANAGER') {
    return await prisma.bug.findMany({
      include: {
        reporter: {
          select: { id: true, name: true, email: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        affectedContent: {
          select: { id: true, name: true, type: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
  
  return await prisma.bug.findMany({
    where: { reporterId },
    include: {
      reporter: {
        select: { id: true, name: true, email: true }
      },
      assignedTo: {
        select: { id: true, name: true, email: true }
      },
      affectedContent: {
        select: { id: true, name: true, type: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateBugStatus(bugId: string, status: string) {
  const validatedData = validateInput(updateBugStatusSchema, { bugId, status })
  
  try {
    const bugExists = await prisma.bug.findUnique({
      where: { id: validatedData.bugId },
      select: { id: true }
    })
    
    if (!bugExists) {
      throw new Error('Bug not found')
    }

    const bug = await prisma.bug.update({
      where: { id: validatedData.bugId },
      data: { status: validatedData.status },
    })
    
    revalidatePath('/bugs')
    revalidatePath('/dashboard')
    return bug
  } catch (error) {
    console.error('Failed to update bug status:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update bug status. Please try again.')
  }
}

export async function assignBug(bugId: string, assignedToId: string | null) {
  const validatedData = validateInput(assignBugSchema, { bugId, assignedToId })
  
  try {
    const bugExists = await prisma.bug.findUnique({
      where: { id: validatedData.bugId },
      select: { id: true }
    })
    
    if (!bugExists) {
      throw new Error('Bug not found')
    }
    
    if (validatedData.assignedToId) {
      const userExists = await prisma.user.findUnique({
        where: { id: validatedData.assignedToId },
        select: { id: true, role: true }
      })
      
      if (!userExists) {
        throw new Error('User not found')
      }
      
      if (userExists.role !== 'CONTENT_MANAGER') {
        throw new Error('Only content managers can be assigned bugs')
      }
    }

    const bug = await prisma.bug.update({
      where: { id: validatedData.bugId },
      data: { assignedToId: validatedData.assignedToId },
    })
    
    revalidatePath('/bugs')
    return bug
  } catch (error) {
    console.error('Failed to assign bug:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to assign bug. Please try again.')
  }
}

export async function getBugById(bugId: string) {
  return await prisma.bug.findUnique({
    where: { id: bugId },
    include: {
      reporter: {
        select: { id: true, name: true, email: true }
      },
      assignedTo: {
        select: { id: true, name: true, email: true }
      },
      affectedContent: {
        select: { id: true, name: true, type: true }
      }
    }
  })
}

export async function exportBugsToCSV(reporterId: string, userRole: string) {
  try {
    const bugs = await getBugs(reporterId, userRole)

    const csvData = bugs.map((bug) => ({
      title: bug.title,
      description: bug.description,
      priority: bug.priority,
      status: bug.status,
      browserDevice: bug.browserDevice || '',
      affectedContent: bug.affectedContent?.name || '',
      reportedBy: bug.reporter?.name || bug.reporter?.email || '',
      assignedTo: bug.assignedTo?.name || bug.assignedTo?.email || '',
      createdDate: bug.createdAt,
    }))

    return csvData
  } catch (error) {
    console.error('Failed to export bugs:', error)
    throw new Error('Failed to export bugs. Please try again.')
  }
}

