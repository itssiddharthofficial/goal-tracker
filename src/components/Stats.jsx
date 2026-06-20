export default function Stats({ goals }) {
  const total = goals.length
  const done = goals.filter(g => g.status === 'done').length
  const inProgress = goals.filter(g => g.status === 'active').length
  const paused = goals.filter(g => g.status === 'paused').length
  const percentComplete = total === 0 ? 0 : Math.round((done / total) * 100)

  const stats = [
    { label: 'Total Goals', value: total, color: 'from-blue-500 to-blue-600', icon: '📊', bgColor: 'from-blue-500/20 to-blue-600/10' },
    { label: 'In Progress', value: inProgress, color: 'from-cyan-500 to-blue-500', icon: '⚡', bgColor: 'from-cyan-500/20 to-blue-500/10' },
    { label: 'Completed', value: done, color: 'from-emerald-500 to-green-600', icon: '✓', bgColor: 'from-emerald-500/20 to-green-600/10' },
    { label: 'Paused', value: paused, color: 'from-gray-500 to-gray-600', icon: '⏸', bgColor: 'from-gray-500/20 to-gray-600/10' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`glass rounded-2xl p-6 bg-gradient-to-br ${stat.bgColor} hover:shadow-2xl hover:shadow-blue-500/20 group cursor-pointer border-l-4 transition-all duration-300 hover:scale-105`}
            style={{ animation: `slideUp 0.5s ease-out ${idx * 100}ms forwards`, opacity: 0 }}
            onAnimationEnd={(e) => e.target.style.opacity = 1}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className={`text-4xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">{stat.label}</p>
              </div>
              <div className="text-3xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="glass rounded-2xl p-8 bg-gradient-to-br from-emerald-500/10 to-transparent border-t-2 border-emerald-500/30">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">🚀 Progress Overview</h3>
              <p className="text-sm text-gray-400">{done} of {total} goals completed</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                {percentComplete}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Complete</p>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-3">
            <div className="relative h-4 bg-dark-700/50 rounded-full overflow-hidden border border-emerald-500/30 shadow-inner">
              <div
                className={`h-full rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 transition-all duration-700 ease-out ${
                  percentComplete > 0 ? 'shadow-lg shadow-emerald-500/50' : ''
                }`}
                style={{
                  width: `${percentComplete}%`,
                }}
              />
              {/* Shimmer effect */}
              {percentComplete > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
            </div>

            {/* Motivational message */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-300">
                {total === 0 ? '🎯 Start by adding your first goal!' :
                 percentComplete === 100 ? '🎉 Amazing! You completed all goals!' :
                 percentComplete >= 75 ? '🔥 Almost there, keep pushing!' :
                 percentComplete >= 50 ? '💪 Great progress, halfway there!' :
                 percentComplete > 0 ? '⭐ You\'re on your way!' :
                 'Get started!'}
              </span>
              {percentComplete > 0 && (
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  {total - done} left
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
