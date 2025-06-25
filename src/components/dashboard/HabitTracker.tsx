'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, X, Calendar, Zap, Target, TrendingUp, Award, ChevronDown, Edit3, Clock, Filter } from 'lucide-react'
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
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_LABELS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const HABIT_CATEGORIES = [
  { id: 'health', label: 'Health & Fitness', icon: '💪', color: 'bg-green-500' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: 'bg-purple-500' },
  { id: 'productivity', label: 'Productivity', icon: '⚡', color: 'bg-blue-500' },
  { id: 'learning', label: 'Learning', icon: '📚', color: 'bg-orange-500' },
  { id: 'social', label: 'Social', icon: '👥', color: 'bg-pink-500' },
  { id: 'creative', label: 'Creative', icon: '🎨', color: 'bg-indigo-500' },
  { id: 'general', label: 'General', icon: '📋', color: 'bg-gray-500' }
]

export function HabitTracker({ habits, onAdd, onToggleDay, onDelete, onUpdate }: HabitTrackerProps) {
  const [newHabit, setNewHabit] = useState('')
  const [newHabitCategory, setNewHabitCategory] = useState('general')
  const [isAdding, setIsAdding] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'streak' | 'category'>('name')
  const [editingHabit, setEditingHabit] = useState<string | null>(null)

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
      onAdd(newHabit.trim(), {
        category: newHabitCategory,
        createdAt: new Date(),
        difficulty: 'medium'
      })
      setNewHabit('')
      setNewHabitCategory('general')
      setIsAdding(false)
    }
  }

  const getHabitProgress = (habit: Habit) => {
    const completed = Object.values(habit.completedDays).filter(Boolean).length
    return (completed / 7) * 100
  }

  const getStreak = (habit: Habit) => {
    let streak = 0
    const today = new Date().getDay()
    const dayOrder = [6, 0, 1, 2, 3, 4, 5] // Sunday = 0, Monday = 1, etc.
    const todayIndex = dayOrder.indexOf(today)

    // Count backwards from today
    for (let i = 0; i < 7; i++) {
      const dayIndex = (todayIndex - i + 7) % 7
      const dayKey = DAYS[dayIndex] as keyof typeof habit.completedDays
      if (habit.completedDays[dayKey]) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const getLongestStreak = (habit: Habit) => {
    // This would typically come from historical data
    // For now, return current streak as a placeholder
    return getStreak(habit)
  }

  const getHabitCategory = (habit: Habit) => {
    return HABIT_CATEGORIES.find(cat => cat.id === habit.category) || HABIT_CATEGORIES[6]
  }

  const filteredAndSortedHabits = useMemo(() => {
    let filtered = habits

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(habit => habit.category === filterCategory)
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return getHabitProgress(b) - getHabitProgress(a)
        case 'streak':
          return getStreak(b) - getStreak(a)
        case 'category':
          return (a.category || 'general').localeCompare(b.category || 'general')
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }, [habits, filterCategory, sortBy])

  const weeklyStats = useMemo(() => {
    const totalHabits = habits.length
    const totalPossible = totalHabits * 7
    const totalCompleted = habits.reduce((acc, habit) =>
      acc + Object.values(habit.completedDays).filter(Boolean).length, 0
    )
    const averageCompletion = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0
    const habitsWithStreaks = habits.filter(habit => getStreak(habit) > 0).length

    return {
      totalHabits,
      averageCompletion: Math.round(averageCompletion),
      habitsWithStreaks,
      totalCompleted
    }
  }, [habits])

  const getTodayStatus = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const todayCompleted = habits.filter(habit =>
      habit.completedDays[today as keyof typeof habit.completedDays]
    ).length

    return {
      completed: todayCompleted,
      total: habits.length,
      percentage: habits.length > 0 ? Math.round((todayCompleted / habits.length) * 100) : 0
    }
  }

  const todayStatus = getTodayStatus()

  return (
    <div className="card">
      {/* Enhanced Header with Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Habit Tracker</h2>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-400">
                {habits.length} habits
              </span>
              <span className="text-blue-400">
                {weeklyStats.averageCompletion}% weekly avg
              </span>
              {!isMobile && (
                <span className="text-green-400">
                  {weeklyStats.habitsWithStreaks} active streaks
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Today's Progress Circle */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-700"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${(todayStatus.percentage / 100) * 62.83} 62.83`}
                className="text-green-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{todayStatus.percentage}%</span>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={16} />
            <span className={isMobile ? '' : 'inline'}>Add</span>
          </button>
        </div>
      </div>

      {/* Filters and Sort */}
      {habits.length > 3 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center space-x-3">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            >
              <option value="all">All Categories</option>
              {HABIT_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            >
              <option value="name">Name</option>
              <option value="progress">Progress</option>
              <option value="streak">Streak</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      )}

      {/* Enhanced Add Habit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 animate-slide-up">
          <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Habit Name
              </label>
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="e.g., Drink 8 glasses of water, Exercise for 30 min..."
                className="input-primary w-full"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HABIT_CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setNewHabitCategory(category.id)}
                    className={`p-2 rounded-lg border-2 transition-all text-sm ${newHabitCategory === category.id
                      ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                      : 'border-gray-600 hover:border-gray-500 text-gray-400'
                      }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">{category.icon}</div>
                      <div className="text-xs">{category.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button type="submit" className="btn-primary flex-1">
                Create Habit
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setNewHabit('')
                  setNewHabitCategory('general')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Day Labels */}
      {!isMobile && filteredAndSortedHabits.length > 0 && (
        <div className="grid grid-cols-9 gap-2 mb-4">
          <div className="p-2 text-sm font-medium text-gray-400">Habit</div>
          <div className="p-2 text-sm font-medium text-gray-400 text-center">Cat</div>
          {DAY_LABELS.map((day, index) => (
            <div key={index} className="p-2 text-center text-sm font-medium text-gray-400">
              {day}
            </div>
          ))}
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        {filteredAndSortedHabits.map((habit) => {
          const progress = getHabitProgress(habit)
          const streak = getStreak(habit)
          const longestStreak = getLongestStreak(habit)
          const category = getHabitCategory(habit)

          const habitContent = (
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all duration-200">
              {/* Habit Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center text-sm`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">{habit.name}</span>
                    {!isMobile && (
                      <div className="flex items-center space-x-3 mt-1">
                        {streak > 0 && (
                          <div className="flex items-center space-x-1 bg-orange-600/20 text-orange-400 px-2 py-1 rounded-full text-xs">
                            <Zap size={10} />
                            <span>{streak}d streak</span>
                          </div>
                        )}
                        {longestStreak > streak && (
                          <div className="flex items-center space-x-1 bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                            <Award size={10} />
                            <span>Best: {longestStreak}d</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1 bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                          <TrendingUp size={10} />
                          <span>{Math.round(progress)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!isMobile && (
                  <div className="flex items-center space-x-1">
                    {onUpdate && (
                      <button
                        onClick={() => setEditingHabit(editingHabit === habit.id ? null : habit.id)}
                        className="text-gray-500 hover:text-blue-400 transition-colors p-1"
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(habit.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Stats */}
              {isMobile && (
                <div className="flex items-center space-x-3 mb-3">
                  {streak > 0 && (
                    <div className="flex items-center space-x-1 bg-orange-600/20 text-orange-400 px-2 py-1 rounded-full text-xs">
                      <Zap size={10} />
                      <span>{streak}d</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                    <TrendingUp size={10} />
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              )}

              {/* Day Buttons */}
              <div className={`grid grid-cols-7 mb-3 ${isMobile ? 'gap-1' : 'gap-2'}`}>
                {DAYS.map((day, index) => {
                  const dayKey = day as keyof typeof habit.completedDays
                  const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day

                  return (
                    <button
                      key={day}
                      onClick={() => onToggleDay(habit.id, day)}
                      className={`aspect-square rounded-lg border-2 transition-all duration-200 flex items-center justify-center touch-feedback relative ${habit.completedDays[dayKey]
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-500 hover:border-green-500 text-gray-400 hover:text-green-400'
                        } ${isMobile ? 'text-xs' : ''} ${isToday ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
                    >
                      {isToday && !habit.completedDays[dayKey] && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}

                      {habit.completedDays[dayKey] ? (
                        <svg className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className={`font-medium ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                          {isMobile ? DAY_LABELS_SHORT[index] : DAY_LABELS[index].slice(0, 1)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Enhanced Progress Bar */}
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className={`w-full bg-gray-600 rounded-full ${isMobile ? 'h-2' : 'h-2'} relative overflow-hidden`}>
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-500 relative"
                      style={{ width: `${progress}%` }}
                    >
                      {progress > 20 && (
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {Math.round(progress)}%
                  </span>
                  {progress === 100 && (
                    <Award size={isMobile ? 12 : 14} className="text-yellow-400" />
                  )}
                </div>
              </div>
            </div>
          )

          return isMobile ? (
            <SwipeableHabitCard
              key={habit.id}
              onEdit={onUpdate ? () => setEditingHabit(habit.id) : undefined}
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

        {filteredAndSortedHabits.length === 0 && habits.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <Filter size={48} className="mx-auto mb-4 opacity-50" />
            <p>No habits found for the selected category.</p>
            <button
              onClick={() => setFilterCategory('all')}
              className="text-blue-400 hover:text-blue-300 text-sm mt-2"
            >
              Show all habits
            </button>
          </div>
        )}

        {habits.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">Ready to build better habits?</h3>
            <p className="mb-4">Start with small, achievable daily actions that compound over time.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="btn-primary"
            >
              Create Your First Habit
            </button>
          </div>
        )}
      </div>

      {/* Weekly Summary */}
      {habits.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-gray-300">This Week</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-400">
                {weeklyStats.totalCompleted}/{habits.length * 7} completed
              </span>
              <span className="text-green-400 font-medium">
                {weeklyStats.averageCompletion}% average
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}