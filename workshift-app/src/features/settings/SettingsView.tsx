'use client'

import { ChangeEvent } from 'react'
import { parseISO } from 'date-fns'
import { useShiftStore } from '@/store/useShiftStore'
import { generateMonthEntries } from '@/shared/lib/schedule'

export function SettingsView() {
  const profile = useShiftStore((s) => s.profile)
  const settings = useShiftStore((s) => s.settings)
  const updateProfile = useShiftStore((s) => s.updateProfile)
  const updateSettings = useShiftStore((s) => s.updateSettings)
  const month = useShiftStore((s) => s.month)

  const applySchedule = () => {
    const generated = generateMonthEntries(parseISO(month), settings)
    // resetMonth очищает только seed, поэтому здесь напрямую записываем дни через store action.
    Object.values(generated).forEach((entry) => useShiftStore.getState().upsertDay(entry))
  }

  const avatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateProfile({ avatarUrl: String(reader.result) })
    reader.readAsDataURL(file)
  }

  return (
    <section>
      <div className="text-sm text-neutral-400">Профиль и правила расчёта</div>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">Настройки</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-[28px] p-5 md:p-7">
          <div className="text-lg font-semibold">Профиль</div>
          <div className="mt-5 flex items-center gap-4">
            <label className="grid h-20 w-20 cursor-pointer place-items-center overflow-hidden rounded-[24px] bg-white/75 text-2xl font-semibold">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Аватар профиля" className="h-full w-full object-cover" /> : profile.name.slice(0, 1)}
              <input type="file" accept="image/*" onChange={avatarChange} className="hidden" />
            </label>
            <div><div className="font-semibold">Фото профиля</div><div className="mt-1 text-xs text-neutral-400">Нажмите на аватар, чтобы заменить его.</div></div>
          </div>
          <Field label="Имя" value={profile.name} onChange={(v) => updateProfile({ name: v })} />
          <Field label="Логин" value={profile.username} onChange={(v) => updateProfile({ username: v })} />
          <Field label="Email" value={profile.email ?? ''} onChange={(v) => updateProfile({ email: v })} />
        </div>

        <div className="glass rounded-[28px] p-5 md:p-7">
          <div className="text-lg font-semibold">Рабочая схема</div>
          <div className="mt-1 text-sm text-neutral-400">График, часы и цена выхода используются календарём.</div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">График
              <select value={settings.scheduleType} onChange={(e) => updateSettings({ scheduleType: e.target.value as typeof settings.scheduleType })} className="soft-control mt-2 w-full rounded-2xl px-3 py-3 outline-none">
                <option value="5/2">5 / 2</option><option value="2/2">2 / 2</option><option value="1/3">1 / 3</option><option value="3/3">3 / 3</option><option value="4/2">4 / 2</option><option value="custom">Свободный</option>
              </select>
            </label>
            <label className="text-sm font-medium">Свободный цикл (1 = смена, 0 = выходной)
              <input value={settings.customPattern} onChange={(e) => updateSettings({ customPattern: e.target.value })} className="soft-control mt-2 w-full rounded-2xl px-3 py-3" placeholder="1100" />
            </label>
            <label className="text-sm font-medium">Цена выхода
              <input type="number" min="0" value={settings.payPerShift} onChange={(e) => updateSettings({ payPerShift: Number(e.target.value) })} className="soft-control mt-2 w-full rounded-2xl px-3 py-3" />
            </label>
            <label className="text-sm font-medium">Смена с
              <input type="time" value={settings.defaultStart} onChange={(e) => updateSettings({ defaultStart: e.target.value })} className="soft-control mt-2 w-full rounded-2xl px-3 py-3" />
            </label>
            <label className="text-sm font-medium">Смена до
              <input type="time" value={settings.defaultEnd} onChange={(e) => updateSettings({ defaultEnd: e.target.value })} className="soft-control mt-2 w-full rounded-2xl px-3 py-3" />
            </label>
          </div>
          <label className="mt-4 block text-sm font-medium">План часов в месяц
            <input type="number" min="0" step="1" value={settings.monthlyHoursTarget} onChange={(e) => updateSettings({ monthlyHoursTarget: Number(e.target.value) })} className="soft-control mt-2 w-full rounded-2xl px-3 py-3" />
          </label>
          <button onClick={applySchedule} className="mt-4 w-full rounded-2xl bg-[#1d1d1f] px-4 py-3 text-sm font-semibold text-white">Применить график к текущему месяцу</button>
          <div className="mt-5 rounded-2xl bg-white/55 p-4 text-sm leading-6 text-neutral-500">Любой конкретный день можно переопределить вручную в календаре: поменять тип дня и выставить фактические часы, даже если смена закончилась раньше стандартного времени.</div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="mt-4 block text-sm font-medium">{label}<input value={value} onChange={(e) => onChange(e.target.value)} className="soft-control mt-2 w-full rounded-2xl px-4 py-3 outline-none" /></label>
}
