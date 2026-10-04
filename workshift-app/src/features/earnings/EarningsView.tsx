'use client'

import { useMemo } from 'react'
import { format, subMonths } from 'date-fns'
import { useShiftStore } from '@/store/useShiftStore'

export function EarningsView() {
  const entries = useShiftStore((s) => s.entries)
  const settings = useShiftStore((s) => s.settings)
  const data = useMemo(() => Array.from({ length: 6 }, (_, index) => {
    const date = subMonths(new Date(), 5 - index)
    const prefix = format(date, 'yyyy-MM')
    const monthEntries = Object.values(entries).filter((e) => e.date.startsWith(prefix))
    const work = monthEntries.filter((e) => e.kind === 'work').length
    const extra = monthEntries.filter((e) => e.kind === 'extra').length
    const hours = monthEntries.reduce((sum, e) => sum + e.hours, 0)
    return { label: format(date, 'LLL'), income: work * settings.payPerShift + extra * settings.payPerShift * settings.extraPayMultiplier, hours }
  }), [entries, settings.payPerShift])
  const max = Math.max(...data.map((d) => d.income), settings.payPerShift)

  return (
    <section>
      <div className="text-sm text-neutral-400">Аналитика</div>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">Заработок</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_.9fr]">
        <div className="glass rounded-[28px] p-5 md:p-7">
          <div className="flex items-end justify-between"><div><div className="text-sm text-neutral-400">Динамика за 6 месяцев</div><div className="mt-1 text-3xl font-semibold">{Math.round(data.reduce((s, d) => s + d.income, 0)).toLocaleString('ru-RU')} ₽</div></div><div className="text-right text-xs text-neutral-400">ставка {settings.payPerShift.toLocaleString('ru-RU')} ₽/смена</div></div>
          <div className="mt-8 flex h-64 items-end gap-2 md:gap-4">
            {data.map((item) => <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="relative flex-1"><div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-[#1d1d1f]/[.07]" style={{ height: `${Math.max(8, (item.income / max) * 100)}%` }} /><div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-[#d9534f]/65" style={{ height: `${Math.max(3, (item.income / max) * 76)}%` }} /></div><div className="text-center text-xs font-medium text-neutral-400">{item.label}</div></div>)}
          </div>
        </div>
        <div className="space-y-4">
          <div className="glass rounded-[28px] p-5"><div className="text-sm text-neutral-400">Средняя выплата</div><div className="mt-2 text-3xl font-semibold">{Math.round(data.reduce((s, d) => s + d.income, 0) / data.length).toLocaleString('ru-RU')} ₽</div></div>
          <div className="glass rounded-[28px] p-5"><div className="text-sm text-neutral-400">Часов за период</div><div className="mt-2 text-3xl font-semibold">{data.reduce((s, d) => s + d.hours, 0).toFixed(1)} ч</div></div>
          <div className="glass rounded-[28px] p-5"><div className="text-sm text-neutral-400">Цель месяца</div><div className="mt-2 text-3xl font-semibold">{settings.monthlyHoursTarget} ч</div></div>
        </div>
      </div>
    </section>
  )
}
