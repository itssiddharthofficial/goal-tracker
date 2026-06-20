import { useState } from 'react'
import GoalCard from './GoalCard'

export default function GoalsList({ goals, onUpdate }) {
  const [expandedId, setExpandedId] = useState(null)

  const activeGoals = goals.filter(g => g.status === 'active').sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  const pausedGoals = goals.filter(g => g.status === 'paused')

  if (goals.length === 0) {
    return null
  }

  return (
    <div className="space-y-8 animate-slideUp" style={{animationDelay: '0.4s'}}>
      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> Active Goals
          </h3>
          <div className="grid gap-4">
            {activeGoals.map((goal, idx) => (
              <div
                key={goal.id}
                style={{
                  animation: `slideUp 0.5s ease-out ${idx * 100}ms forwards`,
                  opacity: 0
                }}
                onAnimationEnd={(e) => e.target.style.opacity = 1}
              >
                <GoalCard
                  goal={goal}
                  onUpdate={onUpdate}
                  isExpanded={expandedId === goal.id}
                  onToggleExpand={() => setExpandedId(expandedId === goal.id ? null : goal.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paused Goals */}
      {pausedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-400 flex items-center gap-2">
            <span>⏸</span> Paused
          </h3>
          <div className="grid gap-4">
            {pausedGoals.map((goal, idx) => (
              <div
                key={goal.id}
                style={{
                  animation: `slideUp 0.5s ease-out ${(activeGoals.length + idx) * 100}ms forwards`,
                  opacity: 0
                }}
                onAnimationEnd={(e) => e.target.style.opacity = 1}
              >
                <GoalCard
                  goal={goal}
                  onUpdate={onUpdate}
                  isExpanded={expandedId === goal.id}
                  onToggleExpand={() => setExpandedId(expandedId === goal.id ? null : goal.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
