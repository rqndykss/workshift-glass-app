'use client'

import { ReactNode, useState } from 'react'
import { Menu, UserRound } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { AuthModal } from '@/features/auth/AuthModal'
import { useShiftStore } from '@/store/useShiftStore'

export function Layout({ children }: { children: ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const profile = useShiftStore((state) => state.profile)

  return (
    <div className="min-h-screen px-3 pb-6 md:px-6 md:pl-[270px]">
      <Sidebar />
      <header className="sticky top-0 z-20 mx-auto flex max-w-[1400px] items-center justify-between py-3 md:py-5">
        <button onClick={() => setMobileOpen((v) => !v)} className="glass grid h-11 w-11 place-items-center rounded-2xl md:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden text-sm text-neutral-400 md:block">Личный рабочий центр</div>
        <button onClick={() => setAuthOpen(true)} className="glass flex items-center gap-3 rounded-full px-3 py-2">
          <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-white text-xs font-semibold">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Аватар" className="h-full w-full object-cover" /> : profile.name.slice(0, 1)}
          </div>
          <span className="hidden text-sm font-medium sm:block">{profile.name}</span>
          <UserRound className="h-4 w-4 text-neutral-400" />
        </button>
      </header>

      <main className="mx-auto max-w-[1400px]">{children}</main>

      <AnimatePresence>
        {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
