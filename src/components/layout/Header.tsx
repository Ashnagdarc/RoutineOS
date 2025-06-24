'use client'

import { Calendar, Settings, BarChart3, Download, LogOut } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  user?: any
  onShowProgress: () => void
  onShowSync: () => void
  onSignOut: () => void
  showingProgress: boolean
}

export function Header({ user, onShowProgress, onShowSync, onSignOut, showingProgress }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  
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
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 size={20} className="text-white" />
            </div>
            RoutineOS
          </h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center">
            <Calendar size={14} className="mr-1" />
            {dateString}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onShowProgress}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              showingProgress
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-blue-400 hover:bg-gray-800'
            }`}
          >
            <BarChart3 size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Progress</span>
          </button>
          
          <button
            onClick={onShowSync}
            className="flex items-center text-gray-400 hover:text-green-400 hover:bg-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            <Download size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <Settings size={16} className="hidden sm:block" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50">
                <div className="px-3 py-2 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    onSignOut()
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                >
                  <LogOut size={14} className="mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}