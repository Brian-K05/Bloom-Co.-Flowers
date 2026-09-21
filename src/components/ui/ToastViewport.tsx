import { useToast } from '../../context/ToastContext'
import { X } from 'lucide-react'

export function ToastViewport() {
  const { toasts, dismiss } = useToast()

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-enter pointer-events-auto flex items-start justify-between gap-4 border border-line bg-paper px-4 py-3 shadow-[0_12px_40px_rgba(42,39,36,0.12)]"
        >
          <p className="text-sm leading-relaxed text-ink">{toast.message}</p>
          <button
            type="button"
            aria-label="Dismiss"
            className="mt-0.5 text-muted hover:text-ink"
            onClick={() => dismiss(toast.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
