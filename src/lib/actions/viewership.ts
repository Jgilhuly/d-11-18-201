'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ViewershipMetrics, Content, User } from '@/lib/types'

export interface ViewershipStats {
  totalViews: number
  totalWatchTime: number
  averageCompletionRate: number
  uniqueViewers: number
  topContent: Array<{
    content: Pick<Content, 'id' | 'name' | 'type' | 'posterUrl'>
    views: number
    watchTime: number
    completionRate: number
  }>
}

export interface ViewershipTrendData {
  date: string
  views: number
  watchTime: number
}

export async function getViewershipStats(): Promise<ViewershipStats> {
  try {
    const metrics = await prisma.viewershipMetrics.findMany({
      include: {
        content: {
          select: {
            id: true,
            name: true,
            type: true,
            posterUrl: true,
          },
        },
      },
    })

    const totalViews = metrics.reduce((sum, m) => sum + m.views, 0)
    const totalWatchTime = metrics.reduce((sum, m) => sum + m.watchTimeMinutes, 0)
    const uniqueViewers = new Set(metrics.map((m) => m.userId)).size
    const averageCompletionRate =
      metrics.length > 0
        ? metrics.reduce((sum, m) => sum + m.completionRate, 0) / metrics.length
        : 0

    const contentMap = new Map<
      string,
      { content: Content; views: number; watchTime: number; completionRate: number }
    >()

    metrics.forEach((metric) => {
      const existing = contentMap.get(metric.contentId)
      if (existing) {
        const oldViews = existing.views
        const totalViews = oldViews + metric.views
        existing.views = totalViews
        existing.watchTime += metric.watchTimeMinutes
        existing.completionRate =
          (existing.completionRate * oldViews + metric.completionRate * metric.views) / totalViews
      } else {
        contentMap.set(metric.contentId, {
          content: metric.content as Content,
          views: metric.views,
          watchTime: metric.watchTimeMinutes,
          completionRate: metric.completionRate,
        })
      }
    })

    const topContent = Array.from(contentMap.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    return {
      totalViews,
      totalWatchTime,
      averageCompletionRate,
      uniqueViewers,
      topContent,
    }
  } catch (error) {
    console.error('Failed to fetch viewership stats:', error)
    throw new Error('Failed to fetch viewership statistics')
  }
}

export async function getViewershipTrends(days: number = 30): Promise<ViewershipTrendData[]> {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const metrics = await prisma.viewershipMetrics.findMany({
      where: {
        lastWatchedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const dateMap = new Map<string, { views: number; watchTime: number }>()

    metrics.forEach((metric) => {
      const dateStr = metric.lastWatchedAt.toISOString().split('T')[0]
      const existing = dateMap.get(dateStr)
      if (existing) {
        existing.views += metric.views
        existing.watchTime += metric.watchTimeMinutes
      } else {
        dateMap.set(dateStr, {
          views: metric.views,
          watchTime: metric.watchTimeMinutes,
        })
      }
    })

    return Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        views: data.views,
        watchTime: data.watchTime,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  } catch (error) {
    console.error('Failed to fetch viewership trends:', error)
    throw new Error('Failed to fetch viewership trends')
  }
}

export async function getAllViewershipMetrics(): Promise<ViewershipMetrics[]> {
  try {
    const metrics = await prisma.viewershipMetrics.findMany({
      include: {
        content: {
          select: {
            id: true,
            name: true,
            type: true,
            posterUrl: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        lastWatchedAt: 'desc',
      },
    })

    return metrics.map((m) => ({
      id: m.id,
      contentId: m.contentId,
      userId: m.userId,
      views: m.views,
      watchTimeMinutes: m.watchTimeMinutes,
      completionRate: m.completionRate,
      lastWatchedAt: m.lastWatchedAt,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      content: m.content as Pick<Content, 'id' | 'name' | 'type' | 'posterUrl'>,
      user: m.user as Pick<User, 'id' | 'name' | 'email'>,
    }))
  } catch (error) {
    console.error('Failed to fetch viewership metrics:', error)
    throw new Error('Failed to fetch viewership metrics')
  }
}

