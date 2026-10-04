import { format, getDaysInMonth, startOfMonth } from 'date-fns'
import type { DayEntry, ScheduleType, WorkSettings } from '@/shared/types'

/**
 * Преобразует выбранный пользователем график в бинарный цикл:
 * 1 = рабочий день, 0 = выходной.
 */
export function patternForSettings(settings: WorkSettings): string {
  if (settings.scheduleType === '5/2') return '1111100'
  if (settings.scheduleType === '2/2') return '1100'
  if (settings.scheduleType === '1/3') return '1000'
  if (settings.scheduleType === '3/3') return '111000'
  if (settings.scheduleType === '4/2') return '111100'
  return settings.customPattern.replace(/[^01]/g, '') || '10'
}

/**
 * Создаёт месячный план по циклу. Реальные правки пользователя не описываем
 * здесь — это задача store.upsertDay, который накладывает ручные изменения.
 */
export function generateMonthEntries(month: Date, settings: WorkSettings): Record<string, DayEntry> {
  const result: Record<string, DayEntry> = {}
  const pattern = patternForSettings(settings)
  const days = getDaysInMonth(month)
  const start = startOfMonth(month)

  for (let index = 0; index < days; index += 1) {
    const date = new Date(start)
    date.setDate(index + 1)
    const key = format(date, 'yyyy-MM-dd')
    const working = pattern[index % pattern.length] === '1'
    result[key] = working
      ? { date: key, kind: 'work', hours: 8, start: settings.defaultStart, end: settings.defaultEnd }
      : { date: key, kind: 'off', hours: 0 }
  }

  return result
}
