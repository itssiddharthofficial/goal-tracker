export default function AnimatedBackground() {
  return (
    <>
      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top Left */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-float"></div>

        {/* Top Right */}
        <div className="absolute -top-20 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

        {/* Bottom Left */}
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

        {/* Bottom Right */}
        <div className="absolute -bottom-20 -right-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>

        {/* Center Float */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl animate-bounce-smooth" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Animated Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </>
  )
}
