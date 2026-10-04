'use client'

import { Layout } from '@/components/layout/Layout'
import { CalendarView } from '@/features/calendar/CalendarView'
import { EarningsView } from '@/features/earnings/EarningsView'
import { SettingsView } from '@/features/settings/SettingsView'
import { SubscriptionView } from '@/features/subscription/SubscriptionView'
import { useShiftStore } from '@/store/useShiftStore'

export default function HomePage() {
  const activeTab = useShiftStore((state) => state.activeTab)
  return (
    <Layout>
      {activeTab === 'calendar' && <CalendarView />}
      {activeTab === 'earnings' && <EarningsView />}
      {activeTab === 'settings' && <SettingsView />}
      {activeTab === 'subscription' && <SubscriptionView />}
    </Layout>
  )
}
