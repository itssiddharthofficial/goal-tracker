import { useState, useEffect } from 'react'

const toastStore = {
  listeners: [],
  subscribe(fn) {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn)
    }
  },
  notify(message, type = 'success', duration = 3000) {
    const id = Date.now()
    this.listeners.forEach(fn => fn({ id, message, type, duration }))
    if (duration > 0) {
      setTimeout(() => {
        this.listeners.forEach(fn => fn({ id, message, type, remove: true }))
      }, duration)
    }
  }
}

export function useToast() {
  return toastStore.notify.bind(toastStore)
}

export default function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const unsubscribe = toastStore.subscribe((toast) => {
      if (toast.remove) {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      } else {
        setToasts(prev => [...prev, toast])
      }
    })
    return unsubscribe
  }, [])

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  const colors = {
    success: { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/50', text: 'text-emerald-300', icon: 'text-emerald-400' },
    error: { bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/50', text: 'text-red-300', icon: 'text-red-400' },
    warning: { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/50', text: 'text-amber-300', icon: 'text-amber-400' },
    info: { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/50', text: 'text-blue-300', icon: 'text-blue-400' }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => {
        const color = colors[toast.type] || colors.info
        return (
          <div
            key={toast.id}
            className={`bg-gradient-to-r ${color.bg} border ${color.border} rounded-lg px-4 py-3 backdrop-blur-md animate-slideDown pointer-events-auto flex items-center gap-3`}
          >
            <div className={`text-xl font-bold ${color.icon}`}>
              {icons[toast.type]}
            </div>
            <span className={`font-medium ${color.text}`}>
              {toast.message}
            </span>
          </div>
        )
      })}
    </div>
  )
}
