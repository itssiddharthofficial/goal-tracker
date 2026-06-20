import { useAuth } from '../context/AuthContext'

export default function Header({ onAddClick }) {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-dark-700/50 bg-dark-900/60 backdrop-blur-xl sticky top-0 z-40 shadow-lg shadow-blue-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-3 group">
              <div className="text-4xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">🎯</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Goal Tracker
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">Your personal goal management system</p>
              </div>
            </div>
          </div>

          {/* Status, User Info & Add Button */}
          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass rounded-xl hover:bg-dark-700/60 transition-all duration-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300 font-medium">Live</span>
            </div>

            {/* User Info */}
            {user && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 glass rounded-xl bg-dark-800/40">
                <span className="text-sm text-gray-300">{user.displayName || user.email}</span>
              </div>
            )}

            {/* Add Goal Button */}
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 active:scale-95 group"
            >
              <span className="text-lg group-hover:scale-125 group-hover:rotate-180 transition-transform duration-300">✨</span>
              <span className="hidden sm:inline">Add Goal</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-300 hover:text-red-400 text-sm font-medium transition-colors duration-200 hover:bg-red-500/10 rounded-lg"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Animated divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </header>
  )
}
