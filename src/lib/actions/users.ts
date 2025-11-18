'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { validateInput, createUserSchema, updateUserRoleSchema, checkRateLimit } from '@/lib/validation'

export interface CreateUserData {
  name: string
  email: string
  role: 'VIEWER' | 'CONTENT_MANAGER'
  password: string
}

export async function createUser(data: CreateUserData) {
  // Rate limiting check
  if (!checkRateLimit('create-user', 5, 60000)) {
    throw new Error('Too many requests. Please try again in a minute.')
  }

  // Validate input data
  const validatedData = validateInput(createUserSchema, data)
  
  try {
    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { id: true }
    })
    
    if (existingUser) {
      throw new Error('A user with this email already exists')
    }

    // Hash password (though not stored in this demo implementation)
    await bcrypt.hash(validatedData.password, 10)
    
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
      },
    })
    
    revalidatePath('/users')
    revalidatePath('/dashboard')
    return user
  } catch (error) {
    console.error('Failed to create user:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create user. Please try again.')
  }
}

export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          contentRequests: true,
          content: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      contentRequests: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        }
      },
      content: {
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
        }
      }
    }
  })
}

export async function updateUserRole(userId: string, role: 'VIEWER' | 'CONTENT_MANAGER') {
  // Validate input data
  const validatedData = validateInput(updateUserRoleSchema, { userId, role })
  
  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { id: true }
    })
    
    if (!userExists) {
      throw new Error('User not found')
    }

    const user = await prisma.user.update({
      where: { id: validatedData.userId },
      data: { role: validatedData.role },
    })
    
    revalidatePath('/users')
    return user
  } catch (error) {
    console.error('Failed to update user role:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update user role. Please try again.')
  }
}
