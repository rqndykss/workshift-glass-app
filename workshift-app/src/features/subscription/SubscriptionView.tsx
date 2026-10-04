'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'

const plans = [
  { id: '1', title: '1 месяц', price: 199, note: 'Помогаем войти в ритм', badge: 'Гибко' },
  { id: '6', title: '6 месяцев', price: 899, note: 'Экономия 25%', badge: 'Популярно' },
  { id: '12', title: '12 месяцев', price: 1490, note: 'Экономия 38%', badge: 'Лучший выбор' },
]

export function SubscriptionView() {
  const [selected, setSelected] = useState('1')
  const plan = plans.find((item) => item.id === selected) ?? plans[0]
  return (
    <section>
      <div className="text-sm text-neutral-400">Отдельная вкладка</div>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">Подписка</h1>
      <div className="mt-6 overflow-hidden rounded-[32px] bg-white/65 p-5 shadow-glass md:p-8">
        <div className="rounded-[30px] bg-[radial-gradient(circle_at_25%_15%,rgba(217,83,79,.12),transparent_35%),linear-gradient(135deg,rgba(255,255,255,.95),rgba(245,245,247,.88))] p-5 md:p-10">
          <div className="grid items-end gap-8 md:grid-cols-[1fr_1.15fr]">
            <div>
              <div className="text-sm text-neutral-400">Премиум-доступ</div>
              <motion.div key={selected} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="mt-2 text-6xl font-semibold tracking-[-0.06em]">{plan.price.toLocaleString('ru-RU')} ₽</motion.div>
              <div className="mt-2 max-w-md text-sm leading-6 text-neutral-500">Календарь без ограничений, аналитика заработка, гибкие графики и ручная корректировка каждой смены.</div>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-neutral-500"><span className="rounded-full bg-white/80 px-3 py-2">∞ смен</span><span className="rounded-full bg-white/80 px-3 py-2">История 12 мес.</span><span className="rounded-full bg-white/80 px-3 py-2">Экспорт</span></div>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-2">
                {plans.map((item) => (
                  <motion.button key={item.id} layout onClick={() => setSelected(item.id)} whileTap={{ scale: .98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className={`rounded-full border px-3 py-3 text-xs font-semibold ${item.id === selected ? 'border-[#d9534f]/50 bg-white text-[#b44440]' : 'border-black/5 bg-white/55 text-neutral-500'}`}>
                    {item.title}
                  </motion.button>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: .98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="mt-3 flex w-full items-center justify-between rounded-full bg-[#1d1d1f] px-5 py-4 text-sm font-semibold text-white">Купить подписку <ChevronRight className="h-5 w-5" /></motion.button>
              <div className="mt-5 space-y-2">
                {[`План: ${plan.title}`, plan.note, 'Оплата безопасно через ваш платёжный сервис'].map((item) => <div key={item} className="flex items-center gap-2 text-sm text-neutral-500"><Check className="h-4 w-4 text-[#d9534f]" />{item}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
