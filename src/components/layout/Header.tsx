'use client'

import { Calendar, Settings, BarChart3, Download, LogOut, Brain, User, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  onShowProgress: () => void
  onShowSync: () => void
  onShowSmartFeatures?: () => void
  onSignOut: () => void
  showingProgress: boolean
  showingSmartFeatures?: boolean
}

export function Header({
  user,
  onShowProgress,
  onShowSync,
  onShowSmartFeatures,
  onSignOut,
  showingProgress,
  showingSmartFeatures = false
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-40 backdrop-blur-sm bg-gray-900/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-white">
            RoutineOS
          </h1>
          <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
          <span className="hidden sm:block text-gray-400 text-sm">Personal Productivity Dashboard</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Smart Features Button */}
          {onShowSmartFeatures && (
            <button
              onClick={onShowSmartFeatures}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${showingSmartFeatures
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
            >
              <Brain size={16} />
              <span className="hidden sm:inline">Smart Features</span>
            </button>
          )}

          {/* Analytics Button */}
          <button
            onClick={onShowProgress}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${showingProgress
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
          >
            <BarChart3 size={16} />
            <span className="hidden sm:inline">Analytics</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onShowSync}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white rounded-lg text-sm font-medium transition-all duration-200"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-300" />
                </div>
              )}
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 animate-slide-up">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-300" />
                      </div>
                    )}
                    <div>
                      <div className="text-white font-medium">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      onSignOut()
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}