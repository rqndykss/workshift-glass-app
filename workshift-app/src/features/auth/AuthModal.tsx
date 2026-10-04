'use client'

import { FormEvent, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useShiftStore } from '@/store/useShiftStore'

export function AuthModal({ onClose }: { onClose: () => void }) {
  const updateProfile = useShiftStore((state) => state.updateProfile)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('Александр')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    updateProfile({ name, email: email || undefined })
    onClose()
  }

  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/15 p-2 backdrop-blur-sm md:items-center md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.form onSubmit={submit} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="glass-strong w-full max-w-[460px] rounded-[30px] p-6 md:p-7">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-semibold">{mode === 'login' ? 'Войти' : 'Создать аккаунт'}</div>
            <div className="mt-1 text-sm text-neutral-400">Личный профиль, смены и история дохода.</div>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/65"><X className="h-5 w-5" /></button>
        </div>

        {mode === 'register' && (
          <label className="mt-5 block text-sm font-medium">Имя
            <input value={name} onChange={(e) => setName(e.target.value)} className="soft-control mt-2 w-full rounded-2xl px-4 py-3 outline-none focus:border-black/15" />
          </label>
        )}
        <label className="mt-5 block text-sm font-medium">Почта
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="soft-control mt-2 w-full rounded-2xl px-4 py-3 outline-none focus:border-black/15" />
        </label>
        <label className="mt-4 block text-sm font-medium">Пароль
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="soft-control mt-2 w-full rounded-2xl px-4 py-3 outline-none focus:border-black/15" />
        </label>

        <button type="submit" className="mt-6 w-full rounded-2xl bg-[#1d1d1f] px-4 py-3.5 text-sm font-semibold text-white">{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-3 w-full text-sm text-neutral-500 hover:text-neutral-900">
          {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </motion.form>
    </motion.div>
  )
}
