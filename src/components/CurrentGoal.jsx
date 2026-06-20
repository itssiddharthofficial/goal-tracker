import { useEffect, useState } from 'react'

export default function CurrentGoal({ goal }) {
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [goal])

  const getPriorityBadge = (priority) => {
    const badges = {
      high: {
        bg: 'from-red-500/20 to-red-600/10',
        border: 'border-red-500/50',
        text: 'text-red-300',
        dot: 'bg-red-500',
        label: '🔴 High Priority',
        glow: 'shadow-red-500/50',
        icon: '⚠️'
      },
      medium: {
        bg: 'from-amber-500/20 to-amber-600/10',
        border: 'border-amber-500/50',
        text: 'text-amber-300',
        dot: 'bg-amber-500',
        label: '🟡 Medium Priority',
        glow: 'shadow-amber-500/50',
        icon: '🎯'
      },
      low: {
        bg: 'from-emerald-500/20 to-emerald-600/10',
        border: 'border-emerald-500/50',
        text: 'text-emerald-300',
        dot: 'bg-emerald-500',
        label: '🟢 Low Priority',
        glow: 'shadow-emerald-500/50',
        icon: '✨'
      },
    }
    return badges[priority] || badges.medium
  }

  if (!goal) {
    return (
      <div className={`glass rounded-2xl p-12 border-2 border-dashed border-gray-600/50 ${fadeIn ? 'animate-fadeIn' : 'opacity-0'}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce-smooth">😌</div>
            <div>
              <h3 className="text-3xl font-bold text-gray-300 mb-2">Nothing Active Right Now</h3>
              <p className="text-gray-500 text-lg">Select a goal to start your journey</p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-4 text-sm text-gray-400">
              <span>💡</span>
              <span>Choose a goal from the list below to begin tracking</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const badge = getPriorityBadge(goal.priority)

  return (
    <div className={`relative glass rounded-3xl p-8 sm:p-10 border-2 glow-border transition-all duration-500 overflow-hidden ${fadeIn ? 'animate-fadeIn' : 'opacity-0'}`}>
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/5 to-blue-600/0 animate-shimmer pointer-events-none"></div>

      {/* Decorative animated elements */}
      <div className="absolute top-4 right-4 text-4xl animate-float opacity-20">🌟</div>
      <div className="absolute bottom-4 left-4 text-3xl animate-bounce-smooth opacity-20" style={{animationDelay: '1s'}}>✨</div>

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
          {/* Main Content */}
          <div className="flex-1 space-y-5">
            {/* Icon + Label */}
            <div className="flex items-center gap-3">
              <div className="text-5xl animate-float">🚀</div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Focus Mode Active</p>
                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight mt-1 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  {goal.title}
                </h2>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {/* Priority Badge */}
              <div className={`badge bg-gradient-to-br ${badge.bg} border-2 ${badge.border} ${badge.text} group cursor-default hover:scale-105 transition-all duration-300 font-bold`}>
                <div className={`w-3 h-3 rounded-full ${badge.dot} group-hover:scale-150 transition-all duration-300 animate-pulse shadow-lg ${badge.glow}`}></div>
                <span>{badge.label}</span>
              </div>

              {/* Category Badge */}
              <div className="badge bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/50 text-blue-200 font-semibold hover:scale-105 transition-all duration-300">
                <span>📁</span>
                <span>{goal.category}</span>
              </div>

              {/* Status Badge */}
              <div className="badge bg-gradient-to-br from-green-500/20 to-green-600/10 border-2 border-green-500/50 text-green-200 font-semibold animate-pulse">
                <span>●</span>
                <span>Active</span>
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="hidden sm:flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-2 border-blue-500/50 flex-shrink-0 shadow-lg shadow-blue-500/30">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-spin-slow opacity-50"></div>
              <div className="relative text-5xl animate-pulse">⭐</div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      </div>
    </div>
  )
}
