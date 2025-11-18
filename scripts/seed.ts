#!/usr/bin/env ts-node

import { seedDatabase, resetDatabase, seedMinimalData } from '../src/lib/seed-data'
import { prisma } from '../src/lib/db'

async function main() {
  const command = process.argv[2] || 'seed'
  
  try {
    switch (command) {
      case 'seed':
        console.log('🌱 Seeding database with demo data...')
        const result = await seedDatabase()
        console.log('✅ Seeding completed!')
        console.log(`Created: ${result.users} users, ${result.contentRequests} content requests, ${result.content} content items, ${result.subscriptions} subscriptions`)
        break
        
      case 'reset':
        console.log('🗑️  Resetting database...')
        await resetDatabase()
        console.log('✅ Database reset completed!')
        break
        
      case 'minimal':
        console.log('🌱 Seeding minimal demo data...')
        await seedMinimalData()
        console.log('✅ Minimal seeding completed!')
        break
        
      default:
        console.log('Usage: npm run seed [command]')
        console.log('Commands:')
        console.log('  seed     - Seed database with full demo data (default)')
        console.log('  reset    - Clear all data from database')
        console.log('  minimal  - Seed only basic auth users')
        process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
