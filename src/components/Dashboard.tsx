'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Header } from './layout/Header'
import { WeeklyPriorities } from './dashboard/WeeklyPriorities'
import { HabitTracker } from './dashboard/HabitTracker'
import { DailyTasks } from './dashboard/DailyTasks'
import { ProgressReport } from './dashboard/ProgressReport'
import { GoogleSheetsSync } from './integrations/GoogleSheetsSync'
import { SmartHabitChains } from './smart/SmartHabitChains'
import { AIInsightsEngine } from './smart/AIInsightsEngine'
import { SmartScheduler } from './smart/SmartScheduler'
import { ErrorBoundary } from './ui/ErrorBoundary'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useSheetsSync } from '@/hooks/useSheetsSync'

// Mobile Components
import { MobileNavigation, QuickAddFab } from '@/components/mobile/MobileNavigation'
import { MobileHeader, MobileStatsBar } from '@/components/mobile/MobileHeader'

export function Dashboard() {
  const { data: session, status } = useSession()
  const [showProgressReport, setShowProgressReport] = useState(false)
  const [showSheetsSync, setShowSheetsSync] = useState(false)
  const [showSmartFeatures, setShowSmartFeatures] = useState(false)
  const [activeSmartTab, setActiveSmartTab] = useState<'chains' | 'insights' | 'scheduler'>('insights')

  // Mobile-specific state
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const {
    priorities,
    habits,
    dailyTasks,
    smartInsights,
    addPriority,
    togglePriority,
    deletePriority,
    updatePriority,
    addHabit,
    toggleHabitDay,
    deleteHabit,
    updateHabit,
    addDailyTask,
    toggleDailyTask,
    deleteDailyTask,
    updateDailyTask,
    addSmartInsight,
    dismissSmartInsight,
    removeSmartInsight,
    getWeeklyStats,
    isLoading,
  } = useDashboardData()

  const { syncToSheets, isSyncing } = useSheetsSync()
  const weeklyStats = getWeeklyStats()

  const handleSyncToSheets = async (sheetId: string) => {
    try {
      await syncToSheets({
        priorities,
        habits,
        dailyTasks,
      }, sheetId)
    } catch (error) {
      console.error('Failed to sync to sheets:', error)
      // Here you could add a toast notification for the error
    }
  }

  // Mobile handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)

    // Reset states when switching tabs
    setShowProgressReport(false)
    setShowSheetsSync(false)
    setShowSmartFeatures(false)

    // Set appropriate views based on tab
    if (tab === 'analytics') {
      setShowProgressReport(true)
    } else if (tab === 'smart') {
      setShowSmartFeatures(true)
    }
  }

  const handleQuickAdd = () => {
    setShowQuickAdd(true)
  }

  const handleAddHabit = () => {
    // For now, add a default habit - could be expanded to open a modal
    addHabit('New Habit', { category: 'general' })
    setShowQuickAdd(false)
  }

  const handleAddPriority = () => {
    addPriority('New Priority')
    setShowQuickAdd(false)
  }

  const handleAddTask = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    addDailyTask(today as any, 'New Task')
    setShowQuickAdd(false)
  }

  const mobileStats = {
    habits: habits.length,
    priorities: priorities.length,
    tasks: dailyTasks.length,
    streak: weeklyStats.longestCurrentStreak
  }

  // Show loading state while session or data is loading
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded"></div>
                <div className="w-32 h-6 bg-gray-700 rounded"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 h-8 bg-gray-700 rounded"></div>
                <div className="w-24 h-8 bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                      <div className="w-48 h-6 bg-gray-700 rounded"></div>
                    </div>
                    <div className="w-24 h-8 bg-gray-700 rounded"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-4 bg-gray-700 rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-700 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      {isMobile ? (
        <ErrorBoundary>
          <MobileHeader
            title={
              activeTab === 'home' ? 'RoutineOS' :
                activeTab === 'analytics' ? 'Analytics' :
                  activeTab === 'smart' ? 'AI Features' :
                    activeTab === 'settings' ? 'Settings' : 'RoutineOS'
            }
            user={session?.user}
            onProfilePress={() => signOut()}
            notificationCount={smartInsights.length}
          />
          <MobileStatsBar stats={mobileStats} />
        </ErrorBoundary>
      ) : (
        <ErrorBoundary>
          <Header
            user={session?.user}
            onShowProgress={() => setShowProgressReport(!showProgressReport)}
            onShowSync={() => setShowSheetsSync(!showSheetsSync)}
            onShowSmartFeatures={() => setShowSmartFeatures(!showSmartFeatures)}
            onSignOut={() => signOut()}
            showingProgress={showProgressReport}
            showingSmartFeatures={showSmartFeatures}
          />
        </ErrorBoundary>
      )}

      <main className={`max-w-7xl mx-auto ${isMobile ? 'mobile-container' : 'px-4 sm:px-6 lg:px-8 py-8'}`}>
        <div className={`${isMobile ? 'space-y-4' : 'space-y-8'}`}>
          {/* Google Sheets Sync */}
          {showSheetsSync && (
            <div className="animate-slide-up">
              <ErrorBoundary>
                <GoogleSheetsSync
                  onSync={handleSyncToSheets}
                  isLoading={isSyncing}
                  onClose={() => setShowSheetsSync(false)}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Smart Features Section */}
          {showSmartFeatures && (
            <div className="animate-slide-up">
              <ErrorBoundary>
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">🧠 Smart Features</h2>
                    <div className="flex space-x-2">
                      {[
                        { id: 'insights', label: 'AI Insights' },
                        { id: 'chains', label: 'Habit Chains' },
                        { id: 'scheduler', label: 'Smart Scheduler' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSmartTab(tab.id as any)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeSmartTab === tab.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeSmartTab === 'insights' && (
                    <AIInsightsEngine
                      habits={habits}
                      priorities={priorities}
                      dailyTasks={dailyTasks}
                      onDismissInsight={dismissSmartInsight}
                    />
                  )}

                  {activeSmartTab === 'chains' && (
                    <SmartHabitChains
                      habits={habits}
                      onUpdateHabit={updateHabit}
                      onCreateInsight={addSmartInsight}
                    />
                  )}

                  {activeSmartTab === 'scheduler' && (
                    <SmartScheduler
                      habits={habits}
                      dailyTasks={dailyTasks}
                      priorities={priorities}
                      onUpdateHabit={updateHabit}
                      onCreateTask={(task) => addDailyTask(task.day, task.text, task)}
                    />
                  )}
                </div>
              </ErrorBoundary>
            </div>
          )}

          {/* Weekly Priorities */}
          <div className="animate-fade-in">
            <ErrorBoundary>
              <WeeklyPriorities
                priorities={priorities}
                onAdd={addPriority}
                onToggle={togglePriority}
                onDelete={deletePriority}
              />
            </ErrorBoundary>
          </div>

          {/* Habit Tracker */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <ErrorBoundary>
              <HabitTracker
                habits={habits}
                onAdd={addHabit}
                onToggleDay={toggleHabitDay}
                onDelete={deleteHabit}
              />
            </ErrorBoundary>
          </div>

          {/* Daily Tasks */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ErrorBoundary>
              <DailyTasks
                tasks={dailyTasks}
                onAdd={addDailyTask}
                onToggle={toggleDailyTask}
                onDelete={deleteDailyTask}
              />
            </ErrorBoundary>
          </div>

          {/* Progress Report */}
          {showProgressReport && (
            <div className="animate-slide-up">
              <ErrorBoundary>
                <ProgressReport stats={weeklyStats} />
              </ErrorBoundary>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onQuickAdd={handleQuickAdd}
      />

      {/* Quick Add FAB */}
      <QuickAddFab
        onAddHabit={handleAddHabit}
        onAddPriority={handleAddPriority}
        onAddTask={handleAddTask}
      />
    </div>
  )
}