'use client'

import { motion } from 'framer-motion'
import { CalendarDays, ChartNoAxesCombined, CreditCard, LayoutDashboard, Settings2, UserRound } from 'lucide-react'
import type { ActiveTab } from '@/shared/types'
import { useShiftStore } from '@/store/useShiftStore'
import { cn } from '@/shared/lib/cn'

const items: Array<{ id: ActiveTab; label: string; icon: typeof CalendarDays }> = [
  { id: 'calendar', label: 'Календарь', icon: CalendarDays },
  { id: 'earnings', label: 'Заработок', icon: ChartNoAxesCombined },
  { id: 'settings', label: 'Настройки', icon: Settings2 },
  { id: 'subscription', label: 'Подписка', icon: CreditCard },
]

export function Sidebar() {
  const { activeTab, setActiveTab, profile } = useShiftStore()
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[250px] p-5 md:block">
      <div className="glass flex h-full flex-col rounded-[28px] px-3 py-5">
        <div className="flex items-center gap-3 px-3 pb-6">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1d1d1f] text-sm font-bold text-white">S</div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight">Shiftly</div>
            <div className="text-xs text-neutral-400">work & earnings</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const active = item.id === activeTab
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'relative flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-[14px] font-medium transition',
                  active ? 'text-[#1d1d1f]' : 'text-neutral-500 hover:text-neutral-900',
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-[18px] bg-white/80 shadow-soft"
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  />
                )}
                <Icon className="relative z-10 h-[18px] w-[18px]" />
                <span className="relative z-10">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-black/5 pt-4">
          <button onClick={() => setActiveTab('settings')} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-white/60">
            <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#ececf0] text-xs font-semibold">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Аватар" className="h-full w-full object-cover" /> : profile.name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{profile.name}</div>
              <div className="truncate text-xs text-neutral-400">{profile.username}</div>
            </div>
            <UserRound className="ml-auto h-4 w-4 text-neutral-400" />
          </button>
        </div>
      </div>
    </aside>
  )
}
