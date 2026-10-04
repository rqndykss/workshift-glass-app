'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ActiveTab } from '@/shared/types'
import { useShiftStore } from '@/store/useShiftStore'

const items: Array<{ id: ActiveTab; label: string }> = [
  { id: 'calendar', label: 'Календарь' },
  { id: 'earnings', label: 'Заработок' },
  { id: 'settings', label: 'Настройки' },
  { id: 'subscription', label: 'Подписка' },
]

export function MobileNav({ onClose }: { onClose: () => void }) {
  const setActiveTab = useShiftStore((state) => state.setActiveTab)
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 bg-black/15 backdrop-blur-sm md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.aside initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="glass h-full w-[300px] rounded-r-[32px] p-5">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Shiftly</div>
            <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/70"><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-8 space-y-2">
            {items.map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); onClose() }} className="w-full rounded-2xl bg-white/55 px-4 py-3 text-left text-sm font-medium">{item.label}</button>
            ))}
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  )
}
