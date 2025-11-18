'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  HomeIcon, 
  FilmIcon, 
  PlayIcon, 
  UsersIcon, 
  SettingsIcon,
  AlertCircleIcon,
  BarChart3Icon
} from 'lucide-react'


interface NavigationStrings {
  dashboard: string;
  contentRequests: string;
  content: string;
  users: string;
  settings: string;
  bugs: string;
  viewership: string;
}

function getNavigationItems(navigationStrings: NavigationStrings, getLocalizedPath: (path: string) => string) {
  return [
    { name: navigationStrings.dashboard, href: getLocalizedPath('/dashboard'), icon: HomeIcon },
    { name: navigationStrings.contentRequests, href: getLocalizedPath('/content-requests'), icon: FilmIcon },
    { name: navigationStrings.content, href: getLocalizedPath('/content'), icon: PlayIcon },
    { name: navigationStrings.viewership, href: getLocalizedPath('/viewership'), icon: BarChart3Icon },
    { name: navigationStrings.bugs, href: getLocalizedPath('/bugs'), icon: AlertCircleIcon },
    { name: navigationStrings.users, href: getLocalizedPath('/users'), icon: UsersIcon, adminOnly: true },
    { name: navigationStrings.settings, href: getLocalizedPath('/settings'), icon: SettingsIcon, adminOnly: true },
  ]
}

export function Sidebar() {
  const { user } = useAuth()
  const { getLocalizedPath, getStrings } = useLocalizedStrings()
  const pathname = usePathname()

  if (!user) return null

  const strings = getStrings()
  const navigation = getNavigationItems(strings.navigation, getLocalizedPath)
  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || user.role === 'CONTENT_MANAGER'
  )

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start text-sidebar-foreground',
                  isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
