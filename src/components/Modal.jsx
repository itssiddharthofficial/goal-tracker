import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700/50 rounded-3xl p-8 max-w-lg w-full shadow-2xl shadow-blue-500/20 animate-popIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 hover:rotate-90 transition-all duration-300 text-2xl"
        >
          ✕
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-3xl">✨</span>
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
