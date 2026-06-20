import { useEffect, useState } from 'react'

export default function RecentlyCompleted({ goals }) {
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [goals])

  const completedGoals = goals
    .filter(g => g.status === 'done')
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 3)

  if (completedGoals.length === 0) {
    return null
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const successMessages = [
    '🎉 Amazing work!',
    '⭐ Fantastic!',
    '🚀 Incredible!',
    '💪 Awesome effort!',
    '🏆 Well done!'
  ]

  return (
    <div className={`transition-all duration-500 ${fadeIn ? 'animate-fadeIn' : 'opacity-0'}`}>
      <div className="space-y-5">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl animate-float">🏆</span>
            <span>Recent Wins</span>
          </h3>
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
            {completedGoals.length} completed
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedGoals.map((goal, idx) => (
            <div
              key={goal.id}
              className="glass rounded-2xl p-6 bg-gradient-to-br from-emerald-500/15 via-green-600/10 to-transparent hover:from-emerald-500/20 hover:via-green-600/15 group border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-105 cursor-pointer relative overflow-hidden"
              style={{ animation: `slideUp 0.5s ease-out ${idx * 100}ms forwards`, opacity: 0 }}
              onAnimationEnd={(e) => e.target.style.opacity = 1}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 group-hover:via-emerald-500/15 transition-all duration-500 pointer-events-none"></div>

              <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="text-4xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 animate-pop-in">✓</div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/30 text-emerald-200 animate-pulse">
                    {successMessages[idx % successMessages.length]}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-100 transition-colors line-through decoration-emerald-500 decoration-2 opacity-90">
                    {goal.title}
                  </h4>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold">📁 {goal.category}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{formatDate(goal.updated_at)}</span>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
