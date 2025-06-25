'use client'

import { signIn } from 'next-auth/react'
import { Calendar, BarChart3, Target, CheckCircle, Sparkles, TrendingUp, Users, Shield } from 'lucide-react'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          {/* Logo and Title Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <BarChart3 size={36} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <Sparkles size={12} className="text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                RoutineOS
              </h1>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-400"></div>
                <p className="text-gray-400 text-sm font-medium">Personal Dashboard</p>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400"></div>
              </div>
            </div>

            <p className="text-gray-300 text-lg max-w-sm mx-auto leading-relaxed">
              Your personal operating system for
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold"> building better habits</span>
            </p>
          </div>

          {/* Features Preview Card */}
          <div className="relative group mb-8 animate-slide-up">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-gray-950/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">What you'll unlock:</h2>
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group/feature">
                  <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-900/50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover/feature:bg-blue-500/30 transition-colors">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium text-sm">Weekly</p>
                      <p className="text-gray-500 text-xs">Priorities</p>
                    </div>
                  </div>
                </div>

                <div className="group/feature">
                  <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-900/50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center group-hover/feature:bg-green-500/30 transition-colors">
                      <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium text-sm">Daily</p>
                      <p className="text-gray-500 text-xs">Habits</p>
                    </div>
                  </div>
                </div>

                <div className="group/feature">
                  <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-900/50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover/feature:bg-purple-500/30 transition-colors">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium text-sm">Task</p>
                      <p className="text-gray-500 text-xs">Management</p>
                    </div>
                  </div>
                </div>

                <div className="group/feature">
                  <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-900/50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover/feature:bg-orange-500/30 transition-colors">
                      <BarChart3 className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium text-sm">Progress</p>
                      <p className="text-gray-500 text-xs">Analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div className="relative group animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="relative w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center space-x-4 group"
            >
              <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
              <span className="text-lg">Continue with Google</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure authentication</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <Users className="w-4 h-4" />
                <span className="text-sm">Google Sheets sync</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Join thousands building better habits with RoutineOS
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}