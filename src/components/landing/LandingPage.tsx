'use client'

import { Button } from '@/components/ui/button'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import Link from 'next/link'

export function LandingPage() {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const navigationStrings = strings.navigation

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="relative border-b border-border">
        <div className="max-w-[1500px] mx-auto px-10 py-5">
          <div className="flex items-center justify-between h-[148px]">
            <div className="font-bold text-[30px] text-foreground tracking-[-1.5px]">
              {navigationStrings.disneyPlusContentManagement}
            </div>
            <Link href="/login">
              <Button variant="secondary" className="rounded-lg px-[22px] py-3.5">
                <span className="font-medium">LOG IN</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-[1500px] mx-auto px-10 py-20">
        <div className="flex flex-col gap-[240px] items-start">
          <h1 className="text-6xl font-bold text-foreground text-center w-full">
            {navigationStrings.welcomeTitle}
          </h1>
          
          <div className="bg-card h-[362px] rounded-lg w-full relative border border-border">
            <div className="absolute bg-background h-[644px] rounded-[24px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[907px] border border-border">
              <div className="h-[644px] overflow-hidden relative w-[907px] flex items-center justify-center">
                <div className="text-foreground text-xl p-8 text-center">
                  {navigationStrings.welcomeSubtitle}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Cards */}
      <section className="max-w-[1500px] mx-auto px-10 py-[50px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">{navigationStrings.contentRequestsCardTitle}</h3>
            <p className="text-muted-foreground">{navigationStrings.contentRequestsCardDescription}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">{navigationStrings.contentCardTitle}</h3>
            <p className="text-muted-foreground">{navigationStrings.contentCardDescription}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">{navigationStrings.usersCardTitle}</h3>
            <p className="text-muted-foreground">{navigationStrings.usersCardDescription}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
