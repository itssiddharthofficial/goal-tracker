import { useState } from 'react'
import Modal from './Modal'
import { useToast } from './Toast'
import firestoreDb from '../utils/firestoreDb'

export default function AddGoalForm({ onGoalAdded, isOpen, onClose }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('medium')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !category.trim()) {
      toast('Please fill in all fields', 'warning')
      return
    }

    setLoading(true)
    try {
      await firestoreDb.addGoal(title.trim(), category.trim(), priority)
      toast('Goal added successfully! 🎉', 'success')
      setTitle('')
      setCategory('')
      setPriority('medium')
      onGoalAdded()
      onClose()
    } catch (error) {
      console.error('Error adding goal:', error)
      toast('Error adding goal', 'error')
    } finally {
      setLoading(false)
    }
  }

  const priorityOptions = [
    { value: 'low', label: '🟢 Low Priority', color: 'from-emerald-500/20 to-emerald-600/10' },
    { value: 'medium', label: '🟡 Medium Priority', color: 'from-amber-500/20 to-amber-600/10' },
    { value: 'high', label: '🔴 High Priority', color: 'from-red-500/20 to-red-600/10' }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Goal">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-200">📝 Goal Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Master React & Tailwind CSS"
            className="w-full bg-dark-700/50 border border-dark-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 hover:border-dark-600/70"
            required
            autoFocus
          />
        </div>

        {/* Category Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-200">📁 Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Work, Learning, Health, Personal"
            className="w-full bg-dark-700/50 border border-dark-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 hover:border-dark-600/70"
            required
          />
        </div>

        {/* Priority Select */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-200">⚡ Priority Level</label>
          <div className="grid grid-cols-3 gap-3">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPriority(option.value)}
                className={`relative p-3 rounded-lg border-2 transition-all duration-300 font-medium text-sm group ${
                  priority === option.value
                    ? `bg-gradient-to-br ${option.color} border-blue-500 shadow-lg shadow-blue-500/50 scale-105`
                    : 'bg-dark-700/50 border-dark-600/50 hover:border-dark-600'
                }`}
              >
                <span className="group-hover:scale-125 transition-transform duration-300 inline-block">
                  {option.label.split(' ')[0]}
                </span>
                <span className="block text-xs mt-1 opacity-70">{option.label.substring(2)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-blue-500/50 active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
              <span>Adding Goal...</span>
            </>
          ) : (
            <>
              <span className="text-xl">✨</span>
              <span>Add Goal</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 text-center pt-2">
          ✓ Your goal will be saved automatically
        </p>
      </form>
    </Modal>
  )
}
