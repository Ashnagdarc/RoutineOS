'use client'

import { signIn } from 'next-auth/react'
import { Calendar, BarChart3, Target, CheckCircle } from 'lucide-react'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Personal Dashboard</h1>
          <h1 className="text-3xl font-bold text-white mb-2">RoutineOS</h1>
          <p className="text-gray-400">Your personal operating system for better habits</p>
        </div>

        {/* Features Preview */}
        <div className="glass-effect rounded-2xl p-6 mb-8 animate-slide-up">
          <h2 className="text-lg font-semibold text-white mb-4">What you'll get:</h2>
          <div className="space-y-3">
            <div className="flex items-center text-gray-300">
              <Target className="w-5 h-5 text-blue-400 mr-3" />
              <span>Weekly priority tracking</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="w-5 h-5 text-green-400 mr-3" />
              <span>Daily habit monitoring</span>
            </div>
            <div className="flex items-center text-gray-300">
              <CheckCircle className="w-5 h-5 text-purple-400 mr-3" />
              <span>Task management</span>
            </div>
            <div className="flex items-center text-gray-300">
              <BarChart3 className="w-5 h-5 text-orange-400 mr-3" />
              <span>Progress analytics</span>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center space-x-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Secure authentication with Google Sheets integration
        </p>
      </div>
    </div>
  )
}