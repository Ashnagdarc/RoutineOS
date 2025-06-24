'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Header } from './layout/Header'
import { WeeklyPriorities } from './dashboard/WeeklyPriorities'
import { HabitTracker } from './dashboard/HabitTracker'
import { DailyTasks } from './dashboard/DailyTasks'
import { ProgressReport } from './dashboard/ProgressReport'
import { GoogleSheetsSync } from './integrations/GoogleSheetsSync'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useSheetsSync } from '@/hooks/useSheetsSync'

export function Dashboard() {
  const { data: session } = useSession()
  const [showProgressReport, setShowProgressReport] = useState(false)
  const [showSheetsSync, setShowSheetsSync] = useState(false)
  
  const {
    priorities,
    habits,
    dailyTasks,
    addPriority,
    togglePriority,
    deletePriority,
    addHabit,
    toggleHabitDay,
    deleteHabit,
    addDailyTask,
    toggleDailyTask,
    deleteDailyTask,
    getWeeklyStats,
  } = useDashboardData()

  const { syncToSheets, isSyncing } = useSheetsSync()
  const weeklyStats = getWeeklyStats()

  const handleSyncToSheets = async (sheetId: string) => {
    await syncToSheets({
      priorities,
      habits,
      dailyTasks,
    }, sheetId)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        user={session?.user}
        onShowProgress={() => setShowProgressReport(!showProgressReport)}
        onShowSync={() => setShowSheetsSync(!showSheetsSync)}
        onSignOut={() => signOut()}
        showingProgress={showProgressReport}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Google Sheets Sync */}
          {showSheetsSync && (
            <div className="animate-slide-up">
              <GoogleSheetsSync
                onSync={handleSyncToSheets}
                isLoading={isSyncing}
                onClose={() => setShowSheetsSync(false)}
              />
            </div>
          )}

          {/* Weekly Priorities */}
          <div className="animate-fade-in">
            <WeeklyPriorities
              priorities={priorities}
              onAdd={addPriority}
              onToggle={togglePriority}
              onDelete={deletePriority}
            />
          </div>

          {/* Habit Tracker */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <HabitTracker
              habits={habits}
              onAdd={addHabit}
              onToggleDay={toggleHabitDay}
              onDelete={deleteHabit}
            />
          </div>

          {/* Daily Tasks */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <DailyTasks
              tasks={dailyTasks}
              onAdd={addDailyTask}
              onToggle={toggleDailyTask}
              onDelete={deleteDailyTask}
            />
          </div>

          {/* Progress Report */}
          {showProgressReport && (
            <div className="animate-slide-up">
              <ProgressReport stats={weeklyStats} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}