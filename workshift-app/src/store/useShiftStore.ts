'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import type { ActiveTab, DayEntry, UserProfile, WorkSettings } from '@/shared/types'

interface ShiftStore {
  activeTab: ActiveTab
  selectedDate: string | null
  month: string
  profile: UserProfile
  settings: WorkSettings
  entries: Record<string, DayEntry>
  setActiveTab: (tab: ActiveTab) => void
  setSelectedDate: (date: string | null) => void
  setMonth: (date: Date) => void
  updateProfile: (patch: Partial<UserProfile>) => void
  updateSettings: (patch: Partial<WorkSettings>) => void
  upsertDay: (entry: DayEntry) => void
  resetMonth: () => void
}

function seedEntries(): Record<string, DayEntry> {
  const seed: Record<string, DayEntry> = {}
  const base = new Date()
  const year = base.getFullYear()
  const month = base.getMonth()
  const days = new Date(year, month + 1, 0).getDate()
  for (let day = 1; day <= days; day++) {
    const date = new Date(year, month, day)
    const weekday = date.getDay()
    const key = format(date, 'yyyy-MM-dd')
    const dayInCycle = ((day - 1) % 4) < 2
    if (weekday === 0 || weekday === 6) {
      seed[key] = { date: key, kind: 'off', hours: 0 }
    } else if (dayInCycle) {
      seed[key] = { date: key, kind: 'work', hours: 8, start: '09:00', end: '18:00' }
    }
  }
  return seed
}

export const useShiftStore = create<ShiftStore>()(persist((set) => ({
  activeTab: 'calendar',
  selectedDate: null,
  month: format(new Date(), 'yyyy-MM-dd'),
  profile: { name: 'Александр', username: '@alex', email: 'alex@example.com' },
  settings: {
    payPerShift: 4200,
    defaultStart: '09:00',
    defaultEnd: '18:00',
    monthlyHoursTarget: 160,
    scheduleType: '2/2',
    timezone: 'Europe/Moscow',
    customPattern: '1100',
    extraPayMultiplier: 1.25,
  },
  entries: seedEntries(),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setMonth: (date) => set({ month: format(date, 'yyyy-MM-dd') }),
  updateProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
  updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
  upsertDay: (entry) => set((state) => ({ entries: { ...state.entries, [entry.date]: entry } })),
  resetMonth: () => set({ entries: seedEntries() }),
}), {
  name: 'shiftly-store-v1',
}))
