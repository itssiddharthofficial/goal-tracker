import { useState, useEffect } from 'react'
import Stats from './Stats'
import CurrentGoal from './CurrentGoal'
import RecentlyCompleted from './RecentlyCompleted'
import GoalsList from './GoalsList'
import Header from './Header'
import AddGoalForm from './AddGoalForm'
import AnimatedBackground from './AnimatedBackground'
import Toast from './Toast'
import firestoreDb from '../utils/firestoreDb'

export default function Dashboard() {
  const [goals, setGoals] = useState([])
  const [activeGoal, setActiveGoal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)

  useEffect(() => {
    loadGoals()
    const interval = setInterval(loadGoals, 2000)
    return () => clearInterval(interval)
  }, [])

  async function loadGoals() {
    try {
      const goalsData = await firestoreDb.getAllGoals()
      const activeData = await firestoreDb.getActiveGoal()
      console.log('Goals loaded:', goalsData)
      setGoals(goalsData)
      setActiveGoal(activeData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading goals:', error)
      if (error.code === 'permission-denied') {
        console.error('Permission denied - check Firestore security rules')
      }
    }
  }

  const handleAddGoal = () => {
    loadGoals()
  }

  const handleUpdateGoal = () => {
    loadGoals()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative z-10">
        <Header onAddClick={() => setIsAddGoalOpen(true)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* Stats Section */}
          <div className="animate-fadeIn">
            <Stats goals={goals} />
          </div>

          {/* Currently Working On Section */}
          <div className="animate-slideUp" style={{animationDelay: '0.1s'}}>
            <CurrentGoal goal={activeGoal} />
          </div>

          {/* Recently Completed Section */}
          <div className="animate-slideUp" style={{animationDelay: '0.2s'}}>
            <RecentlyCompleted goals={goals} />
          </div>

          {/* Goals List */}
          <div className="animate-slideUp" style={{animationDelay: '0.3s'}}>
            <GoalsList goals={goals} onUpdate={handleUpdateGoal} />
          </div>
        </main>
      </div>

      {/* Modal */}
      <AddGoalForm
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onGoalAdded={handleAddGoal}
      />

      {/* Toast Notifications */}
      <Toast />
    </div>
  )
}
