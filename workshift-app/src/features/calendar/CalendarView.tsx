'use client'
import { type ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { addMonths, format, isSameMonth, isToday, parseISO, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Clock3, WalletCards } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useShiftStore } from '@/store/useShiftStore'
import { getCalendarDays, keyForDate, ruWeekdays, hoursBetween } from '@/shared/lib/date'
import type { ShiftKind } from '@/shared/types'

const labels: Record<ShiftKind, string> = {
  work: 'Смена', off: 'Выходной', extra: 'Доп. смена', vacation: 'Отпуск',
}

export function CalendarView() {
  const monthString = useShiftStore((s) => s.month)
  const setMonth = useShiftStore((s) => s.setMonth)
  const entries = useShiftStore((s) => s.entries)
  const settings = useShiftStore((s) => s.settings)
  const selectedDate = useShiftStore((s) => s.selectedDate)
  const setSelectedDate = useShiftStore((s) => s.setSelectedDate)
  const upsertDay = useShiftStore((s) => s.upsertDay)
  const [draftKind, setDraftKind] = useState<ShiftKind>('work')
  const [draftHours, setDraftHours] = useState(8)
  const [draftStart, setDraftStart] = useState(settings.defaultStart)
  const [draftEnd, setDraftEnd] = useState(settings.defaultEnd)
  const month = parseISO(monthString)
  const days = useMemo(() => getCalendarDays(month), [month])

  const openDay = (date: Date) => {
    const key = keyForDate(date)
    const entry = entries[key]
    setSelectedDate(key)
    setDraftKind(entry?.kind ?? 'work')
    setDraftHours(entry?.hours ?? hoursBetween(settings.defaultStart, settings.defaultEnd))
    setDraftStart(entry?.start ?? settings.defaultStart)
    setDraftEnd(entry?.end ?? settings.defaultEnd)
  }

  const saveDay = () => {
    if (!selectedDate) return
    const hours = draftKind === 'off' || draftKind === 'vacation' ? 0 : draftHours
    upsertDay({ date: selectedDate, kind: draftKind, hours, start: draftStart, end: draftEnd })
    setSelectedDate(null)
  }

  const monthLabel = format(month, 'LLLL yyyy')
  const monthStats = Object.values(entries).filter((entry) => entry.date.startsWith(format(month, 'yyyy-MM')))
  const hours = monthStats.reduce((sum, e) => sum + e.hours, 0)
  const shifts = monthStats.filter((e) => e.kind === 'work' || e.kind === 'extra').length
  const income = monthStats.filter((e) => e.kind === 'work').length * settings.payPerShift + monthStats.filter((e) => e.kind === 'extra').length * settings.payPerShift * 1.25

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm text-neutral-400">Календарь смен</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">{monthLabel}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMonth(subMonths(month, 1))} className="glass grid h-11 w-11 place-items-center rounded-2xl"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={() => setMonth(new Date())} className="glass rounded-2xl px-4 text-sm font-semibold">Сегодня</button>
          <button onClick={() => setMonth(addMonths(month, 1))} className="glass grid h-11 w-11 place-items-center rounded-2xl"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Summary label="Смены" value={`${shifts}`} icon={<Clock3 className="h-4 w-4" />} />
        <Summary label="Часы" value={`${hours.toFixed(1)} ч`} icon={<Plus className="h-4 w-4" />} />
        <Summary label="Оценка дохода" value={`${Math.round(income).toLocaleString('ru-RU')} ₽`} icon={<WalletCards className="h-4 w-4" />} />
      </div>

      <div className="glass mt-4 overflow-hidden rounded-[28px] p-3 md:p-5">
        <div className="calendar-grid mb-2 grid gap-1 text-center text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {ruWeekdays.map((day) => <div key={day} className="px-1 py-2">{day}</div>)}
        </div>
        <div className="calendar-grid grid gap-2">
          {days.map((date) => {
            const key = keyForDate(date)
            const entry = entries[key]
            const outside = !isSameMonth(date, month)
            const today = isToday(date)
            return (
              <motion.button key={key} layout whileHover={{ y: -1 }} whileTap={{ scale: .98 }} onClick={() => openDay(date)} className={`min-h-[94px] rounded-2xl border p-2 text-left transition md:min-h-[116px] ${outside ? 'border-transparent bg-transparent opacity-35' : 'border-black/5 bg-white/55'} ${today ? 'ring-2 ring-[#d9534f]/25' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${today ? 'bg-[#1d1d1f] text-white' : 'bg-black/[.035]'}`}>{format(date, 'd')}</span>
                  {entry?.hours ? <span className="text-[11px] text-neutral-400">{entry.hours}ч</span> : null}
                </div>
                {entry && !outside ? (
                  <div className="mt-5">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${entry.kind === 'work' ? 'bg-black/[.05]' : entry.kind === 'extra' ? 'bg-[#d9534f]/10 text-[#b44440]' : 'bg-white/80 text-neutral-500'}`}>{labels[entry.kind]}</span>
                    {entry.start && entry.end && entry.kind !== 'off' && <div className="mt-2 text-[11px] text-neutral-400">{entry.start} — {entry.end}</div>}
                  </div>
                ) : null}
              </motion.button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDate && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-black/15 p-2 backdrop-blur-sm md:items-center md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div layout initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="glass-strong w-full max-w-[520px] rounded-[30px] p-5 md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-400">Редактирование дня</div>
                  <div className="mt-1 text-2xl font-semibold">{format(parseISO(selectedDate), 'd MMMM')}</div>
                </div>
                <button onClick={() => setSelectedDate(null)} className="rounded-full bg-white/70 px-3 py-2 text-sm">Закрыть</button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {(['work', 'off', 'extra', 'vacation'] as ShiftKind[]).map((kind) => (
                  <button key={kind} onClick={() => setDraftKind(kind)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${draftKind === kind ? 'border-black/10 bg-white shadow-soft' : 'border-black/5 bg-white/40'}`}>{labels[kind]}</button>
                ))}
              </div>

              {draftKind !== 'off' && draftKind !== 'vacation' && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <label className="text-sm font-medium">Начало<input type="time" value={draftStart} onChange={(e) => { setDraftStart(e.target.value); setDraftHours(hoursBetween(e.target.value, draftEnd)) }} className="soft-control mt-2 w-full rounded-2xl px-3 py-3" /></label>
                  <label className="text-sm font-medium">Конец<input type="time" value={draftEnd} onChange={(e) => { setDraftEnd(e.target.value); setDraftHours(hoursBetween(draftStart, e.target.value)) }} className="soft-control mt-2 w-full rounded-2xl px-3 py-3" /></label>
                </div>
              )}

              {draftKind !== 'off' && draftKind !== 'vacation' && (
                <label className="mt-4 block text-sm font-medium">Часы (можно вручную)
                  <input type="number" min="0" step="0.5" value={draftHours} onChange={(e) => setDraftHours(Number(e.target.value))} className="soft-control mt-2 w-full rounded-2xl px-3 py-3" />
                </label>
              )}

              <div className="mt-6 flex gap-2">
                <button onClick={() => setSelectedDate(null)} className="w-1/3 rounded-2xl bg-white/65 px-4 py-3 text-sm font-semibold">Отмена</button>
                <button onClick={saveDay} className="w-2/3 rounded-2xl bg-[#1d1d1f] px-4 py-3 text-sm font-semibold text-white">Сохранить день</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Summary({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return <div className="glass rounded-[22px] p-4"><div className="flex items-center gap-2 text-xs font-medium text-neutral-400">{icon}{label}</div><div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div></div>
}
