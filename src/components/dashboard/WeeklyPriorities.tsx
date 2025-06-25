'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, X, Target, Clock, Calendar, AlertTriangle, CheckCircle2, TrendingUp, Filter, Zap, Timer, Flag, Star, ChevronDown, Edit3 } from 'lucide-react'
import { Priority } from '@/types'
import { SwipeableTaskCard } from '@/components/mobile/SwipeableCard'

interface WeeklyPrioritiesProps {
  priorities: Priority[]
  onAdd: (text: string, options?: Partial<Priority>) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate?: (id: string, updates: Partial<Priority>) => void
}

const PRIORITY_LEVELS = [
  { id: 'urgent', label: 'Urgent', icon: '🚨', color: 'bg-red-500', textColor: 'text-red-400', bgColor: 'bg-red-600/20' },
  { id: 'high', label: 'High', icon: '🔥', color: 'bg-orange-500', textColor: 'text-orange-400', bgColor: 'bg-orange-600/20' },
  { id: 'medium', label: 'Medium', icon: '⚡', color: 'bg-yellow-500', textColor: 'text-yellow-400', bgColor: 'bg-yellow-600/20' },
  { id: 'low', label: 'Low', icon: '💡', color: 'bg-green-500', textColor: 'text-green-400', bgColor: 'bg-green-600/20' }
]

const PRIORITY_CATEGORIES = [
  { id: 'work', label: 'Work', icon: '💼', color: 'bg-blue-500' },
  { id: 'personal', label: 'Personal', icon: '🏠', color: 'bg-purple-500' },
  { id: 'health', label: 'Health', icon: '💪', color: 'bg-green-500' },
  { id: 'learning', label: 'Learning', icon: '📚', color: 'bg-orange-500' },
  { id: 'finance', label: 'Finance', icon: '💰', color: 'bg-yellow-500' },
  { id: 'social', label: 'Social', icon: '👥', color: 'bg-pink-500' },
  { id: 'creative', label: 'Creative', icon: '🎨', color: 'bg-indigo-500' },
  { id: 'other', label: 'Other', icon: '📋', color: 'bg-gray-500' }
]

const TIME_ESTIMATES = [
  { value: 15, label: '15 min', icon: '⚡' },
  { value: 30, label: '30 min', icon: '🏃' },
  { value: 60, label: '1 hour', icon: '⏰' },
  { value: 120, label: '2 hours', icon: '⏱️' },
  { value: 240, label: '4+ hours', icon: '🎯' }
]

export function WeeklyPriorities({ priorities, onAdd, onToggle, onDelete, onUpdate }: WeeklyPrioritiesProps) {
  const [newPriority, setNewPriority] = useState('')
  const [newPriorityLevel, setNewPriorityLevel] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')
  const [newPriorityCategory, setNewPriorityCategory] = useState('work')
  const [newPriorityTime, setNewPriorityTime] = useState(30)
  const [newPriorityDueDate, setNewPriorityDueDate] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'dueDate' | 'category' | 'timeEstimate'>('priority')
  const [showCompleted, setShowCompleted] = useState(true)
  const [editingPriority, setEditingPriority] = useState<string | null>(null)

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
    if (newPriority.trim()) {
      const dueDate = newPriorityDueDate ? new Date(newPriorityDueDate) : undefined
      onAdd(newPriority.trim(), {
        priority: newPriorityLevel,
        category: newPriorityCategory,
        estimatedTime: newPriorityTime,
        dueDate,
        createdAt: new Date(),
        tags: []
      })
      setNewPriority('')
      setNewPriorityLevel('medium')
      setNewPriorityCategory('work')
      setNewPriorityTime(30)
      setNewPriorityDueDate('')
      setIsAdding(false)
    }
  }

  const getPriorityLevel = (priority: Priority) => {
    return PRIORITY_LEVELS.find(level => level.id === priority.priority) || PRIORITY_LEVELS[1]
  }

  const getPriorityCategory = (priority: Priority) => {
    return PRIORITY_CATEGORIES.find(cat => cat.id === priority.category) || PRIORITY_CATEGORIES[0]
  }

  const isOverdue = (priority: Priority) => {
    if (!priority.dueDate || priority.completed) return false
    return new Date(priority.dueDate) < new Date()
  }

  const isDueSoon = (priority: Priority) => {
    if (!priority.dueDate || priority.completed) return false
    const dueDate = new Date(priority.dueDate)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return dueDate <= tomorrow && dueDate >= new Date()
  }

  const formatTimeEstimate = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const formatDueDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays <= 7) return `${diffDays} days`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const filteredAndSortedPriorities = useMemo(() => {
    let filtered = priorities

    // Apply completion filter
    if (!showCompleted) {
      filtered = filtered.filter(priority => !priority.completed)
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(priority => priority.priority === filterPriority)
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(priority => priority.category === filterCategory)
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      // Always show overdue items first
      const aOverdue = isOverdue(a)
      const bOverdue = isOverdue(b)
      if (aOverdue && !bOverdue) return -1
      if (!aOverdue && bOverdue) return 1

      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
          return (priorityOrder[a.priority || 'medium'] || 2) - (priorityOrder[b.priority || 'medium'] || 2)
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'category':
          return (a.category || '').localeCompare(b.category || '')
        case 'timeEstimate':
          return (a.estimatedTime || 0) - (b.estimatedTime || 0)
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
  }, [priorities, filterPriority, filterCategory, sortBy, showCompleted])

  const stats = useMemo(() => {
    const total = priorities.length
    const completed = priorities.filter(p => p.completed).length
    const overdue = priorities.filter(p => isOverdue(p)).length
    const dueSoon = priorities.filter(p => isDueSoon(p)).length
    const totalEstimatedTime = priorities
      .filter(p => !p.completed)
      .reduce((acc, p) => acc + (p.estimatedTime || 30), 0)

    const completionRate = total > 0 ? (completed / total) * 100 : 0

    const priorityBreakdown = {
      urgent: priorities.filter(p => p.priority === 'urgent' && !p.completed).length,
      high: priorities.filter(p => p.priority === 'high' && !p.completed).length,
      medium: priorities.filter(p => p.priority === 'medium' && !p.completed).length,
      low: priorities.filter(p => p.priority === 'low' && !p.completed).length
    }

    return {
      total,
      completed,
      overdue,
      dueSoon,
      completionRate: Math.round(completionRate),
      totalEstimatedTime,
      priorityBreakdown
    }
  }, [priorities])

  return (
    <div className="card">
      {/* Enhanced Header with Real-time Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Weekly Priorities</h2>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-400">
                {stats.completed}/{stats.total} completed
              </span>
              <span className="text-blue-400">
                {stats.completionRate}% done
              </span>
              {stats.overdue > 0 && (
                <span className="text-red-400">
                  {stats.overdue} overdue
                </span>
              )}
              {!isMobile && stats.totalEstimatedTime > 0 && (
                <span className="text-yellow-400">
                  {formatTimeEstimate(stats.totalEstimatedTime)} remaining
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Completion Progress Circle */}
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
                strokeDasharray={`${(stats.completionRate / 100) * 62.83} 62.83`}
                className={`${stats.completionRate === 100 ? 'text-green-500' : 'text-blue-500'}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{stats.completionRate}%</span>
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

      {/* Priority Level Breakdown */}
      {stats.total > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {PRIORITY_LEVELS.map(level => {
            const count = stats.priorityBreakdown[level.id as keyof typeof stats.priorityBreakdown]
            return (
              <div
                key={level.id}
                className={`p-2 rounded-lg border ${level.bgColor} border-opacity-30 ${count > 0 ? 'border-opacity-50' : ''}`}
              >
                <div className="text-center">
                  <div className="text-sm">{level.icon}</div>
                  <div className={`text-xs font-medium ${level.textColor}`}>
                    {count}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Enhanced Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${stats.completionRate}%` }}
          >
            {stats.completionRate > 20 && (
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            )}
          </div>
          {stats.completionRate === 100 && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <CheckCircle2 size={14} className="text-green-400" />
            </div>
          )}
        </div>
      </div>

      {/* Filters and Controls */}
      {priorities.length > 2 && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center space-x-3">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            >
              <option value="all">All Priorities</option>
              {PRIORITY_LEVELS.map(level => (
                <option key={level.id} value={level.id}>{level.icon} {level.label}</option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            >
              <option value="all">All Categories</option>
              {PRIORITY_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`text-sm px-2 py-1 rounded border ${showCompleted
                ? 'border-gray-500 text-gray-400 hover:text-gray-300'
                : 'border-blue-500 text-blue-400'
                }`}
            >
              {showCompleted ? 'Hide' : 'Show'} Completed
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            >
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="category">Category</option>
              <option value="timeEstimate">Time</option>
              <option value="created">Created</option>
            </select>
          </div>
        </div>
      )}

      {/* Enhanced Add Priority Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 animate-slide-up">
          <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority Description
              </label>
              <input
                type="text"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                placeholder="e.g., Complete quarterly report, Plan marketing campaign..."
                className="input-primary w-full"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRIORITY_LEVELS.map(level => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setNewPriorityLevel(level.id as any)}
                      className={`p-2 rounded-lg border-2 transition-all text-sm ${newPriorityLevel === level.id
                        ? `border-blue-500 ${level.bgColor} text-blue-400`
                        : 'border-gray-600 hover:border-gray-500 text-gray-400'
                        }`}
                    >
                      <div className="text-center">
                        <div className="text-base mb-1">{level.icon}</div>
                        <div className="text-xs">{level.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRIORITY_CATEGORIES.slice(0, 4).map(category => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setNewPriorityCategory(category.id)}
                      className={`p-2 rounded-lg border-2 transition-all text-sm ${newPriorityCategory === category.id
                        ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                        : 'border-gray-600 hover:border-gray-500 text-gray-400'
                        }`}
                    >
                      <div className="text-center">
                        <div className="text-base mb-1">{category.icon}</div>
                        <div className="text-xs">{category.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time Estimate
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_ESTIMATES.slice(0, 3).map(time => (
                    <button
                      key={time.value}
                      type="button"
                      onClick={() => setNewPriorityTime(time.value)}
                      className={`p-2 rounded-lg border-2 transition-all text-sm ${newPriorityTime === time.value
                        ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                        : 'border-gray-600 hover:border-gray-500 text-gray-400'
                        }`}
                    >
                      <div className="text-center">
                        <div className="text-base mb-1">{time.icon}</div>
                        <div className="text-xs">{time.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={newPriorityDueDate}
                  onChange={(e) => setNewPriorityDueDate(e.target.value)}
                  className="input-primary w-full"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button type="submit" className="btn-primary flex-1">
                Create Priority
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setNewPriority('')
                  setNewPriorityLevel('medium')
                  setNewPriorityCategory('work')
                  setNewPriorityTime(30)
                  setNewPriorityDueDate('')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Enhanced Priorities List */}
      <div className="space-y-3">
        {filteredAndSortedPriorities.map((priority) => {
          const priorityLevel = getPriorityLevel(priority)
          const category = getPriorityCategory(priority)
          const overdue = isOverdue(priority)
          const dueSoon = isDueSoon(priority)

          const priorityContent = (
            <div
              className={`rounded-lg border transition-all duration-200 p-4 ${priority.completed
                ? 'bg-green-900/20 border-green-700/30'
                : overdue
                  ? 'bg-red-900/20 border-red-700/50 hover:border-red-600'
                  : dueSoon
                    ? 'bg-yellow-900/20 border-yellow-700/50 hover:border-yellow-600'
                    : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => onToggle(priority.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 mt-0.5 flex-shrink-0 ${priority.completed
                    ? 'bg-green-600 border-green-600'
                    : overdue
                      ? 'border-red-500 hover:border-red-400'
                      : dueSoon
                        ? 'border-yellow-500 hover:border-yellow-400'
                        : 'border-gray-500 hover:border-blue-500'
                    }`}
                >
                  {priority.completed && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <span
                      className={`font-medium ${priority.completed
                        ? 'text-gray-400 line-through'
                        : overdue
                          ? 'text-red-300'
                          : dueSoon
                            ? 'text-yellow-300'
                            : 'text-white'
                        }`}
                    >
                      {priority.text}
                    </span>

                    {!isMobile && (
                      <div className="flex items-center space-x-1 ml-3">
                        {onUpdate && (
                          <button
                            onClick={() => setEditingPriority(editingPriority === priority.id ? null : priority.id)}
                            className="text-gray-500 hover:text-blue-400 transition-colors p-1"
                          >
                            <Edit3 size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(priority.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 mt-2">
                    {/* Priority Level Badge */}
                    <div className={`flex items-center space-x-1 ${priorityLevel.bgColor} ${priorityLevel.textColor} px-2 py-1 rounded-full text-xs`}>
                      <span>{priorityLevel.icon}</span>
                      <span>{priorityLevel.label}</span>
                    </div>

                    {/* Category Badge */}
                    <div className={`flex items-center space-x-1 ${category.color}/20 text-gray-300 px-2 py-1 rounded-full text-xs`}>
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </div>

                    {/* Time Estimate */}
                    {priority.estimatedTime && (
                      <div className="flex items-center space-x-1 bg-gray-600/20 text-gray-400 px-2 py-1 rounded-full text-xs">
                        <Timer size={10} />
                        <span>{formatTimeEstimate(priority.estimatedTime)}</span>
                      </div>
                    )}

                    {/* Due Date */}
                    {priority.dueDate && (
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${overdue
                        ? 'bg-red-600/20 text-red-400'
                        : dueSoon
                          ? 'bg-yellow-600/20 text-yellow-400'
                          : 'bg-blue-600/20 text-blue-400'
                        }`}>
                        {overdue ? <AlertTriangle size={10} /> : <Calendar size={10} />}
                        <span>{formatDueDate(new Date(priority.dueDate))}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )

          return isMobile ? (
            <SwipeableTaskCard
              key={priority.id}
              onEdit={onUpdate ? () => setEditingPriority(priority.id) : undefined}
              onDelete={() => onDelete(priority.id)}
              className="mobile-list-item"
            >
              {priorityContent}
            </SwipeableTaskCard>
          ) : (
            <div key={priority.id}>
              {priorityContent}
            </div>
          )
        })}

        {filteredAndSortedPriorities.length === 0 && priorities.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <Filter size={48} className="mx-auto mb-4 opacity-50" />
            <p>No priorities found with current filters.</p>
            <button
              onClick={() => {
                setFilterPriority('all')
                setFilterCategory('all')
                setShowCompleted(true)
              }}
              className="text-blue-400 hover:text-blue-300 text-sm mt-2"
            >
              Clear all filters
            </button>
          </div>
        )}

        {priorities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Target size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">Ready to prioritize your week?</h3>
            <p className="mb-4">Add your most important tasks and organize them by priority level.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="btn-primary"
            >
              Add Your First Priority
            </button>
          </div>
        )}
      </div>

      {/* Weekly Summary */}
      {priorities.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Weekly Summary</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-400">
                {stats.completed}/{stats.total} completed
              </span>
              <span className="text-blue-400 font-medium">
                {formatTimeEstimate(stats.totalEstimatedTime)} remaining
              </span>
              {stats.completionRate === 100 && (
                <span className="text-green-400 font-medium flex items-center space-x-1">
                  <CheckCircle2 size={14} />
                  <span>Week Complete!</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}