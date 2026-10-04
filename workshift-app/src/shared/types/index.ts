export type ShiftKind = 'work' | 'off' | 'extra' | 'vacation'

export interface DayEntry {
  date: string
  kind: ShiftKind
  hours: number
  start?: string
  end?: string
  note?: string
}

export type ScheduleType = '5/2' | '2/2' | '1/3' | '3/3' | '4/2' | 'custom'

export interface WorkSettings {
  payPerShift: number
  defaultStart: string
  defaultEnd: string
  monthlyHoursTarget: number
  scheduleType: ScheduleType
  timezone: string
  customPattern: string
  extraPayMultiplier: number
}

export interface UserProfile {
  name: string
  username: string
  avatarUrl?: string
  email?: string
}

export type ActiveTab = 'calendar' | 'earnings' | 'settings' | 'subscription'
