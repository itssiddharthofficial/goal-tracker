import { useState } from 'react'
import { useToast } from './Toast'
import firestoreDb from '../utils/firestoreDb'

export default function GoalCard({ goal, onUpdate, isExpanded, onToggleExpand }) {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const getPriorityColor = (priority) => {
    const colors = {
      high: {
        bg: 'from-red-500/20 to-red-600/10',
        border: 'border-red-500/50',
        text: 'text-red-300',
        dot: 'bg-red-500',
        label: '🔴 High',
        glow: 'shadow-red-500/50'
      },
      medium: {
        bg: 'from-amber-500/20 to-amber-600/10',
        border: 'border-amber-500/50',
        text: 'text-amber-300',
        dot: 'bg-amber-500',
        label: '🟡 Medium',
        glow: 'shadow-amber-500/50'
      },
      low: {
        bg: 'from-emerald-500/20 to-emerald-600/10',
        border: 'border-emerald-500/50',
        text: 'text-emerald-300',
        dot: 'bg-emerald-500',
        label: '🟢 Low',
        glow: 'shadow-emerald-500/50'
      },
    }
    return colors[priority] || colors.medium
  }

  const handleAction = async (action, status = null) => {
    setLoading(true)
    try {
      if (action === 'delete') {
        await firestoreDb.deleteGoal(goal.id)
      } else if (action === 'setActive') {
        await firestoreDb.setActiveGoal(goal.id)
      } else if (action === 'updateStatus') {
        await firestoreDb.updateGoalStatus(goal.id, status)
      }

      const messages = {
        setActive: '🎯 Goal activated!',
        updateStatus: status === 'done' ? '🎉 Goal completed! Great work!' : status === 'paused' ? '⏸ Goal paused' : '▶ Goal resumed!',
        delete: '🗑 Goal deleted'
      }

      toast(messages[action] || 'Action completed!', 'success')
      onUpdate()
      onToggleExpand()
    } catch (error) {
      console.error('Error:', error)
      toast('Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }

  const color = getPriorityColor(goal.priority)
  const isPaused = goal.status === 'paused'

  return (
    <div className={`glass rounded-2xl p-6 bg-gradient-to-br ${goal.is_active ? 'from-blue-500/20 to-blue-600/10 border-2 border-blue-500/50 shadow-xl shadow-blue-500/20' : 'from-dark-700/30 to-dark-800/30'} group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-102 cursor-pointer ${isPaused ? 'opacity-60' : ''}`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/10 transition-all duration-500 pointer-events-none"></div>

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Active indicator */}
            <div className="flex items-start gap-2 mb-3">
              {goal.is_active && (
                <div className="text-2xl flex-shrink-0 animate-pulse">▶</div>
              )}
              <div className="flex-1">
                <h4 className={`text-lg font-bold group-hover:text-white transition-colors ${
                  isPaused ? 'line-through text-gray-500' : 'text-white'
                }`}>
                  {goal.title}
                </h4>
              </div>
            </div>

            {/* Badges Container */}
            <div className="flex flex-wrap gap-2">
              {/* Priority Badge */}
              <div className={`badge bg-gradient-to-br ${color.bg} border-2 ${color.border} ${color.text} font-bold hover:scale-110 transition-transform duration-300`}>
                <div className={`w-2 h-2 rounded-full ${color.dot} animate-pulse`}></div>
                <span className="text-xs">{color.label}</span>
              </div>

              {/* Category Badge */}
              <div className="badge bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/30 text-blue-200 text-xs font-bold hover:scale-110 transition-transform duration-300">
                📁
                <span>{goal.category}</span>
              </div>

              {/* Status Badge */}
              {goal.status === 'paused' && (
                <div className="badge bg-gray-500/20 border-2 border-gray-500/30 text-gray-300 text-xs font-bold">
                  ⏸ Paused
                </div>
              )}

              {goal.is_active && (
                <div className="badge bg-green-500/20 border-2 border-green-500/30 text-green-300 text-xs font-bold animate-pulse">
                  ● Active
                </div>
              )}
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={onToggleExpand}
            className={`text-gray-400 hover:text-white transition-all p-2 hover:bg-dark-700/50 rounded-xl group-hover:bg-dark-700/30 ${isExpanded ? 'rotate-180' : ''}`}
          >
            <span className="inline-block transition-transform duration-300 text-lg">▼</span>
          </button>
        </div>

        {/* Actions - Expanded */}
        {isExpanded && (
          <div className="space-y-3 pt-4 border-t border-dark-700/50 animate-slideDown">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {!goal.is_active && goal.status === 'active' && (
                <button
                  onClick={() => handleAction('setActive')}
                  disabled={loading}
                  className="px-3 py-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 active:scale-95"
                >
                  🎯 Focus
                </button>
              )}

              {goal.status === 'active' && (
                <>
                  <button
                    onClick={() => handleAction('updateStatus', 'done')}
                    disabled={loading}
                    className="px-3 py-2 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 active:scale-95"
                  >
                    ✓ Done
                  </button>
                  <button
                    onClick={() => handleAction('updateStatus', 'paused')}
                    disabled={loading}
                    className="px-3 py-2 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-sm font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 active:scale-95"
                  >
                    ⏸ Pause
                  </button>
                </>
              )}

              {goal.status === 'paused' && (
                <button
                  onClick={() => handleAction('updateStatus', 'active', 'resume')}
                  disabled={loading}
                  className="px-3 py-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 active:scale-95"
                >
                  ▶ Resume
                </button>
              )}

              <button
                onClick={() => handleAction('delete')}
                disabled={loading}
                className="px-3 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 text-sm font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 disabled:opacity-50 active:scale-95 sm:col-span-1"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
    </div>
  )
}
