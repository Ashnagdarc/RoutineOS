'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Calendar, Zap } from 'lucide-react'
import { Habit } from '@/types'
import { SwipeableHabitCard } from '@/components/mobile/SwipeableCard'

interface HabitTrackerProps {
  habits: Habit[]
  onAdd: (name: string, options?: Partial<Habit>) => void
  onToggleDay: (id: string, day: string) => void
  onDelete: (id: string) => void
  onUpdate?: (id: string, updates: Partial<Habit>) => void
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function HabitTracker({ habits, onAdd, onToggleDay, onDelete, onUpdate }: HabitTrackerProps) {
  const [newHabit, setNewHabit] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newHabit.trim()) {
      onAdd(newHabit.trim())
      setNewHabit('')
      setIsAdding(false)
    }
  }

  const getHabitProgress = (habit: Habit) => {
    const completed = Object.values(habit.completedDays).filter(Boolean).length
    return (completed / 7) * 100
  }

  const getStreak = (habit: Habit) => {
    let streak = 0
    for (let i = DAYS.length - 1; i >= 0; i--) {
      const day = DAYS[i] as keyof typeof habit.completedDays
      if (habit.completedDays[day]) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Habit Tracker</h2>
            <p className="text-gray-400 text-sm">
              {habits.length} habits • Track your daily progress
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Add Habit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 animate-slide-up">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Add a new habit..."
              className="input-primary flex-1"
              autoFocus
            />
            <button type="submit" className="btn-primary">
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setNewHabit('')
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Day Labels */}
      {!isMobile && (
        <div className="grid grid-cols-8 gap-2 mb-4">
          <div className="p-2 text-sm font-medium text-gray-400">Habit</div>
          {DAY_LABELS.map((day, index) => (
            <div key={index} className="p-2 text-center text-sm font-medium text-gray-400">
              {day}
            </div>
          ))}
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => {
          const progress = getHabitProgress(habit)
          const streak = getStreak(habit)

          const habitContent = (
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">{habit.name}</span>
                  {streak > 0 && (
                    <div className="flex items-center space-x-1 bg-orange-600/20 text-orange-400 px-2 py-1 rounded-full text-xs">
                      <Zap size={12} />
                      <span>{streak} day streak</span>
                    </div>
                  )}
                </div>
                {!isMobile && (
                  <button
                    onClick={() => onDelete(habit.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className={`grid grid-cols-7 gap-2 mb-3 ${isMobile ? 'gap-1' : 'gap-2'}`}>
                {DAYS.map((day, index) => {
                  const dayKey = day as keyof typeof habit.completedDays
                  return (
                    <button
                      key={day}
                      onClick={() => onToggleDay(habit.id, day)}
                      className={`aspect-square rounded-lg border-2 transition-all duration-200 flex items-center justify-center touch-feedback ${habit.completedDays[dayKey]
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-500 hover:border-green-500 text-gray-400 hover:text-green-400'
                        } ${isMobile ? 'text-xs' : ''}`}
                    >
                      {habit.completedDays[dayKey] && (
                        <svg className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className={`w-full bg-gray-600 rounded-full ${isMobile ? 'h-2' : 'h-2'}`}>
                    <div
                      className="bg-green-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>{Math.round(progress)}%</span>
              </div>
            </div>
          )

          return isMobile ? (
            <SwipeableHabitCard
              key={habit.id}
              onEdit={onUpdate ? () => {/* Could open edit modal */ } : undefined}
              onDelete={() => onDelete(habit.id)}
              className="mobile-list-item"
            >
              {habitContent}
            </SwipeableHabitCard>
          ) : (
            <div key={habit.id}>
              {habitContent}
            </div>
          )
        })}

        {habits.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>No habits yet. Start building better habits today!</p>
          </div>
        )}
      </div>
    </div>
  )
}