import { prisma } from './db'
import type { UserRole, ContentRequestPriority, ContentRequestStatus, ContentStatus } from './types'

export interface SeedUser {
  name: string
  email: string
  role: UserRole
}

export interface SeedContentRequest {
  title: string
  description: string
  priority: ContentRequestPriority
  category: string
  status: ContentRequestStatus
  viewerEmail: string
  reviewedByEmail?: string
}

export interface SeedContent {
  name: string
  type: string
  genre: string
  status: ContentStatus
  releaseDate?: Date
  duration?: number
  rating?: string
  posterUrl?: string
  description?: string
  assignedToEmail?: string
}

// Demo users
const seedUsers: SeedUser[] = [
  // Existing authentication users
  {
    name: 'Viewer',
    email: 'viewer@disneyplus.com',
    role: 'VIEWER'
  },
  {
    name: 'Content Manager',
    email: 'manager@disneyplus.com',
    role: 'CONTENT_MANAGER'
  },
  
  // Additional demo users
  {
    name: 'Mickey Mouse',
    email: 'mickey.mouse@disneyplus.com',
    role: 'VIEWER'
  },
  {
    name: 'Minnie Mouse',
    email: 'minnie.mouse@disneyplus.com', 
    role: 'VIEWER'
  },
  {
    name: 'Donald Duck',
    email: 'donald.duck@disneyplus.com',
    role: 'VIEWER'
  },
  {
    name: 'Goofy',
    email: 'goofy@disneyplus.com',
    role: 'CONTENT_MANAGER'
  },
  {
    name: 'Pluto',
    email: 'pluto@disneyplus.com',
    role: 'VIEWER'
  },
  {
    name: 'Daisy Duck',
    email: 'daisy.duck@disneyplus.com',
    role: 'CONTENT_MANAGER'
  },
  {
    name: 'Ariel',
    email: 'ariel@disneyplus.com',
    role: 'VIEWER'
  },
  {
    name: 'Belle',
    email: 'belle@disneyplus.com',
    role: 'VIEWER'
  }
]

// Demo content requests with Disney+ content
const seedContentRequests: SeedContentRequest[] = [
  {
    title: 'Request: Add The Lion King (1994)',
    description: 'I would love to see the original animated classic The Lion King added to Disney+. This is one of my favorite Disney movies and I think many viewers would enjoy it.',
    priority: 'HIGH',
    category: 'MOVIE',
    status: 'PENDING',
    viewerEmail: 'mickey.mouse@disneyplus.com'
  },
  {
    title: 'Request: Add Frozen II',
    description: 'Frozen II was a huge hit and should definitely be available on Disney+. Many families are requesting this title.',
    priority: 'HIGH',
    category: 'MOVIE',
    status: 'IN_REVIEW',
    viewerEmail: 'minnie.mouse@disneyplus.com',
    reviewedByEmail: 'manager@disneyplus.com'
  },
  {
    title: 'Request: Add The Mandalorian Season 3',
    description: 'The Mandalorian is one of the most popular shows on Disney+. Please add Season 3 as soon as possible.',
    priority: 'CRITICAL',
    category: 'SERIES',
    status: 'APPROVED',
    viewerEmail: 'donald.duck@disneyplus.com',
    reviewedByEmail: 'goofy@disneyplus.com'
  },
  {
    title: 'Request: Add Moana',
    description: 'Moana is a beautiful Disney animated film that would be perfect for the Disney+ library. Great music and story!',
    priority: 'MEDIUM',
    category: 'MOVIE',
    status: 'PENDING',
    viewerEmail: 'pluto@disneyplus.com'
  },
  {
    title: 'Request: Add Encanto',
    description: 'Encanto was a huge success and won an Academy Award. It should definitely be featured prominently on Disney+.',
    priority: 'HIGH',
    category: 'MOVIE',
    status: 'PENDING', 
    viewerEmail: 'ariel@disneyplus.com'
  },
  {
    title: 'Request: Add WandaVision',
    description: 'WandaVision was a groundbreaking Marvel series that brought something new to the MCU. Please add it to the library.',
    priority: 'MEDIUM',
    category: 'SERIES',
    status: 'IN_REVIEW',
    viewerEmail: 'belle@disneyplus.com',
    reviewedByEmail: 'daisy.duck@disneyplus.com'
  },
  {
    title: 'Request: Add Toy Story Collection',
    description: 'All four Toy Story movies should be available as a collection. These are beloved Pixar classics.',
    priority: 'HIGH',
    category: 'MOVIE',
    status: 'PENDING',
    viewerEmail: 'viewer@disneyplus.com'
  },
  {
    title: 'Request: Add The Little Mermaid (2023)',
    description: 'The live-action remake of The Little Mermaid was fantastic. Please add it to Disney+ for all viewers to enjoy.',
    priority: 'MEDIUM',
    category: 'MOVIE',
    status: 'ADDED',
    viewerEmail: 'mickey.mouse@disneyplus.com',
    reviewedByEmail: 'manager@disneyplus.com'
  },
  {
    title: 'Request: Add National Geographic Documentaries',
    description: 'I love National Geographic content. Please add more nature and wildlife documentaries to the platform.',
    priority: 'LOW',
    category: 'DOCUMENTARY',
    status: 'IN_REVIEW',
    viewerEmail: 'minnie.mouse@disneyplus.com',
    reviewedByEmail: 'goofy@disneyplus.com'
  },
  {
    title: 'Request: Add Star Wars: The Clone Wars',
    description: 'The Clone Wars animated series is essential Star Wars content. Please make all seasons available.',
    priority: 'MEDIUM',
    category: 'SERIES',
    status: 'APPROVED',
    viewerEmail: 'donald.duck@disneyplus.com',
    reviewedByEmail: 'daisy.duck@disneyplus.com'
  }
]

// Demo content with Disney+ movies and shows
const seedContent: SeedContent[] = [
  {
    name: 'The Lion King',
    type: 'MOVIE',
    genre: 'MOVIE',
    status: 'FEATURED',
    releaseDate: new Date('1994-06-15'),
    duration: 88,
    rating: 'G',
    posterUrl: '/posters/lion-king.jpg',
    description: 'A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.',
    assignedToEmail: 'manager@disneyplus.com'
  },
  {
    name: 'Frozen',
    type: 'MOVIE',
    genre: 'MOVIE',
    status: 'FEATURED',
    releaseDate: new Date('2013-11-27'),
    duration: 102,
    rating: 'PG',
    posterUrl: '/posters/frozen.jpg',
    description: 'Fearless optimist Anna teams up with rugged mountain man Kristoff and his reindeer to find her sister Elsa.',
    assignedToEmail: 'goofy@disneyplus.com'
  },
  {
    name: 'Moana',
    type: 'MOVIE',
    genre: 'MOVIE',
    status: 'AVAILABLE',
    releaseDate: new Date('2016-11-23'),
    duration: 107,
    rating: 'PG',
    posterUrl: '/posters/moana.jpg',
    description: 'In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches Moana\'s island, she answers the Ocean\'s call to seek out the Demigod to set things right.'
  },
  {
    name: 'The Mandalorian',
    type: 'TV_SERIES',
    genre: 'SERIES',
    status: 'FEATURED',
    releaseDate: new Date('2019-11-12'),
    duration: 40,
    rating: 'TV-PG',
    posterUrl: '/posters/mandalorian.jpg',
    description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy.',
    assignedToEmail: 'daisy.duck@disneyplus.com'
  },
  {
    name: 'Encanto',
    type: 'MOVIE',
    genre: 'MOVIE',
    status: 'AVAILABLE',
    releaseDate: new Date('2021-11-24'),
    duration: 102,
    rating: 'PG',
    posterUrl: '/posters/encanto.jpg',
    description: 'A Colombian teenage girl has to face the frustration of being the only member of her family without magical powers.'
  },
  {
    name: 'WandaVision',
    type: 'TV_SERIES',
    genre: 'SERIES',
    status: 'AVAILABLE',
    releaseDate: new Date('2021-01-15'),
    duration: 50,
    rating: 'TV-14',
    posterUrl: '/posters/wandavision.jpg',
    description: 'Blends the style of classic sitcoms with the MCU, in which Wanda Maximoff and Vision live an idyllic suburban life.'
  },
  {
    name: 'Toy Story',
    type: 'MOVIE',
    genre: 'MOVIE',
    status: 'AVAILABLE',
    releaseDate: new Date('1995-11-22'),
    duration: 81,
    rating: 'G',
    posterUrl: '/posters/toy-story.jpg',
    description: 'A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy\'s room.'
  },
  {
    name: 'The Little Mermaid',
    type: 'MOVIE',
    genre: 'MOVIE',
    status: 'ARCHIVED',
    releaseDate: new Date('1989-11-17'),
    duration: 83,
    rating: 'G',
    posterUrl: '/posters/little-mermaid.jpg',
    description: 'A mermaid princess makes a Faustian bargain with an unscrupulous sea-witch in order to meet a human prince on land.'
  },
  {
    name: 'Free Solo',
    type: 'DOCUMENTARY',
    genre: 'DOCUMENTARY',
    status: 'AVAILABLE',
    releaseDate: new Date('2018-09-28'),
    duration: 100,
    rating: 'PG-13',
    posterUrl: '/posters/free-solo.jpg',
    description: 'Follow Alex Honnold as he attempts to become the first person to ever free solo climb El Capitan.'
  },
  {
    name: 'Star Wars: The Clone Wars',
    type: 'TV_SERIES',
    genre: 'SERIES',
    status: 'FEATURED',
    releaseDate: new Date('2008-10-03'),
    duration: 22,
    rating: 'TV-PG',
    posterUrl: '/posters/clone-wars.jpg',
    description: 'Jedi Knights lead the Grand Army of the Republic against the droid army of the Separatists.',
    assignedToEmail: 'manager@disneyplus.com'
  },
  {
    name: 'Zootopia',
    type: 'MOVIE',
    genre: 'MOVIE',
    status: 'AVAILABLE',
    releaseDate: new Date('2016-03-04'),
    duration: 108,
    rating: 'PG',
    posterUrl: '/posters/zootopia.jpg',
    description: 'In a city of anthropomorphic animals, a rookie bunny cop and a cynical con artist fox must work together to uncover a conspiracy.'
  },
  {
    name: 'Loki',
    type: 'TV_SERIES',
    genre: 'SERIES',
    status: 'AVAILABLE',
    releaseDate: new Date('2021-06-09'),
    duration: 45,
    rating: 'TV-14',
    posterUrl: '/posters/loki.jpg',
    description: 'The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of Avengers: Endgame.'
  }
]

// Demo subscriptions
const seedSubscriptions = [
  {
    name: 'Disney+ Basic',
    planType: 'BASIC',
    price: 7.99,
    expiryDate: new Date('2024-12-31'),
    assignedToEmail: 'mickey.mouse@disneyplus.com'
  },
  {
    name: 'Disney+ Premium',
    planType: 'PREMIUM',
    price: 10.99,
    expiryDate: new Date('2024-12-31'),
    assignedToEmail: 'minnie.mouse@disneyplus.com'
  },
  {
    name: 'Disney Bundle',
    planType: 'BUNDLE',
    price: 13.99,
    expiryDate: new Date('2024-11-15')
  },
  {
    name: 'Disney+ Premium',
    planType: 'PREMIUM',
    price: 10.99,
    expiryDate: new Date('2024-08-20'),
    assignedToEmail: 'donald.duck@disneyplus.com'
  },
  {
    name: 'Disney+ Basic',
    planType: 'BASIC',
    price: 7.99,
    expiryDate: new Date('2024-10-10'),
    assignedToEmail: 'ariel@disneyplus.com'
  }
]

export async function seedDatabase() {
  console.log('Starting database seed...')

  try {
    // Clear existing data in correct order (respecting foreign key constraints)
    console.log('Clearing existing data...')
    await prisma.subscription.deleteMany()
    await prisma.content.deleteMany() 
    await prisma.contentRequest.deleteMany()
    await prisma.user.deleteMany()

    // Seed users
    console.log('Seeding users...')
    const createdUsers = await Promise.all(
      seedUsers.map(userData => 
        prisma.user.create({
          data: userData
        })
      )
    )
    console.log(`Created ${createdUsers.length} users`)

    // Create user email to ID mapping for relationships
    const userEmailToId = createdUsers.reduce((acc, user) => {
      acc[user.email] = user.id
      return acc
    }, {} as Record<string, string>)

    // Seed content requests
    console.log('Seeding content requests...')
    const createdContentRequests = await Promise.all(
      seedContentRequests.map(requestData => {
        const viewerId = userEmailToId[requestData.viewerEmail]
        const reviewedById = requestData.reviewedByEmail 
          ? userEmailToId[requestData.reviewedByEmail] 
          : null

        return prisma.contentRequest.create({
          data: {
            title: requestData.title,
            description: requestData.description,
            priority: requestData.priority,
            category: requestData.category,
            status: requestData.status,
            viewerId: viewerId,
            reviewedBy: reviewedById
          }
        })
      })
    )
    console.log(`Created ${createdContentRequests.length} content requests`)

    // Seed content 
    console.log('Seeding content...')
    const createdContent = await Promise.all(
      seedContent.map(contentData => {
        const assignedUserId = contentData.assignedToEmail
          ? userEmailToId[contentData.assignedToEmail]
          : null

        return prisma.content.create({
          data: {
            name: contentData.name,
            type: contentData.type,
            genre: contentData.genre,
            status: contentData.status,
            releaseDate: contentData.releaseDate,
            duration: contentData.duration,
            rating: contentData.rating,
            posterUrl: contentData.posterUrl,
            description: contentData.description,
            assignedUserId: assignedUserId
          }
        })
      })
    )
    console.log(`Created ${createdContent.length} content items`)

    // Seed subscriptions
    console.log('Seeding subscriptions...')
    const createdSubscriptions = await Promise.all(
      seedSubscriptions.map(subscriptionData => {
        const assignedUserId = subscriptionData.assignedToEmail
          ? userEmailToId[subscriptionData.assignedToEmail]
          : null

        return prisma.subscription.create({
          data: {
            name: subscriptionData.name,
            planType: subscriptionData.planType,
            price: subscriptionData.price,
            expiryDate: subscriptionData.expiryDate,
            assignedUserId: assignedUserId
          }
        })
      })
    )
    console.log(`Created ${createdSubscriptions.length} subscriptions`)

    console.log('Database seed completed successfully!')
    
    return {
      users: createdUsers.length,
      contentRequests: createdContentRequests.length,
      content: createdContent.length,
      subscriptions: createdSubscriptions.length
    }
    
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

// Function to reset database to initial state
export async function resetDatabase() {
  console.log('Resetting database...')
  
  try {
    await prisma.subscription.deleteMany()
    await prisma.content.deleteMany()
    await prisma.contentRequest.deleteMany()
    await prisma.user.deleteMany()
    
    console.log('Database reset completed')
  } catch (error) {
    console.error('Error resetting database:', error)
    throw error
  }
}

// Function to seed just demo users (for development)
export async function seedMinimalData() {
  console.log('Seeding minimal demo data...')
  
  try {
    // Create just the basic auth users if they don't exist
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: ['viewer@disneyplus.com', 'manager@disneyplus.com']
        }
      }
    })

    if (existingUsers.length === 0) {
      await prisma.user.createMany({
        data: [
          {
            name: 'Viewer',
            email: 'viewer@disneyplus.com',
            role: 'VIEWER'
          },
          {
            name: 'Content Manager',
            email: 'manager@disneyplus.com', 
            role: 'CONTENT_MANAGER'
          }
        ]
      })
      console.log('Created basic auth users')
    } else {
      console.log('Basic auth users already exist')
    }
    
  } catch (error) {
    console.error('Error seeding minimal data:', error)
    throw error
  }
}
