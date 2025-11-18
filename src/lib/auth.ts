export interface User {
  id: string
  name: string
  email: string
  role: 'VIEWER' | 'CONTENT_MANAGER'
}

export const USERS: User[] = [
  {
    id: '1',
    name: 'Viewer',
    email: 'viewer@disneyplus.com',
    role: 'VIEWER'
  },
  {
    id: '2',
    name: 'Content Manager',
    email: 'manager@disneyplus.com',
    role: 'CONTENT_MANAGER'
  }
]

export const CREDENTIALS = {
  'viewer@disneyplus.com': 'viewer123',
  'manager@disneyplus.com': 'manager123'
}

export function authenticateUser(email: string, password: string): User | null {
  const storedPassword = CREDENTIALS[email as keyof typeof CREDENTIALS]
  if (storedPassword && storedPassword === password) {
    return USERS.find(user => user.email === email) || null
  }
  return null
}

export function getUserById(id: string): User | null {
  return USERS.find(user => user.id === id) || null
}

export function getUserByEmail(email: string): User | null {
  return USERS.find(user => user.email === email) || null
}
