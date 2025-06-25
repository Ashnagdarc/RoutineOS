import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Priority, Habit, DailyTask, WeeklyStats, SmartInsight } from '@/types'

export function useDashboardData() {
  const { data: session } = useSession()
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [smartInsights, setSmartInsights] = useState<SmartInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API helper function
  const apiCall = useCallback(async (url: string, options?: RequestInit) => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }, [])

  // Load initial data when user is authenticated
  useEffect(() => {
    async function loadData() {
      if (!session?.user) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const [habitsData, prioritiesData] = await Promise.all([
          apiCall('/api/habits'),
          apiCall('/api/priorities'),
        ])

        setHabits(habitsData.habits || [])
        setPriorities(prioritiesData.priorities || [])
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [session?.user, apiCall])

  // Priority Management
  const addPriority = useCallback(async (text: string, options?: Partial<Priority>) => {
    if (!session?.user) throw new Error('User not authenticated')

    try {
      const response = await apiCall('/api/priorities', {
        method: 'POST',
        body: JSON.stringify({
          text,
          priority: options?.priority || 'medium',
          estimatedTime: options?.estimatedTime,
          category: options?.category,
          dueDate: options?.dueDate?.toISOString(),
          tags: options?.tags || [],
        }),
      })

      const newPriority = response.priority
      setPriorities(prev => [...prev, newPriority])
      return newPriority
    } catch (err) {
      console.error('Error adding priority:', err)
      throw err
    }
  }, [session?.user, apiCall])

  const togglePriority = useCallback(async (id: string) => {
    if (!session?.user) throw new Error('User not authenticated')

    const priority = priorities.find(p => p.id === id)
    if (!priority) return

    try {
      const response = await apiCall(`/api/priorities/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !priority.completed }),
      })

      setPriorities(prev =>
        prev.map(p => p.id === id ? response.priority : p)
      )
    } catch (err) {
      console.error('Error toggling priority:', err)
      throw err
    }
  }, [session?.user, priorities, apiCall])

  const deletePriority = useCallback(async (id: string) => {
    if (!session?.user) throw new Error('User not authenticated')

    try {
      await apiCall(`/api/priorities/${id}`, { method: 'DELETE' })
      setPriorities(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting priority:', err)
      throw err
    }
  }, [session?.user, apiCall])

  const updatePriority = useCallback(async (id: string, updates: Partial<Priority>) => {
    if (!session?.user) throw new Error('User not authenticated')

    try {
      const updateData: any = { ...updates }
      if (updateData.dueDate && updateData.dueDate instanceof Date) {
        updateData.dueDate = updateData.dueDate.toISOString()
      }

      const response = await apiCall(`/api/priorities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })

      setPriorities(prev =>
        prev.map(p => p.id === id ? response.priority : p)
      )
    } catch (err) {
      console.error('Error updating priority:', err)
      throw err
    }
  }, [session?.user, apiCall])

  // Habit Management
  const addHabit = useCallback(async (name: string, options?: Partial<Habit>) => {
    if (!session?.user) throw new Error('User not authenticated')

    try {
      const response = await apiCall('/api/habits', {
        method: 'POST',
        body: JSON.stringify({
          name,
          category: options?.category,
          difficulty: options?.difficulty || 'medium',
          estimatedTime: options?.estimatedTime || 15,
          completedDays: options?.completedDays || {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
          },
        }),
      })

      const newHabit = response.habit
      setHabits(prev => [...prev, newHabit])
      return newHabit
    } catch (err) {
      console.error('Error adding habit:', err)
      throw err
    }
  }, [session?.user, apiCall])

  const toggleHabitDay = useCallback(async (id: string, day: string) => {
    if (!session?.user) throw new Error('User not authenticated')

    const habit = habits.find(h => h.id === id)
    if (!habit) return

    try {
      const updatedCompletedDays = {
        ...habit.completedDays,
        [day]: !habit.completedDays[day as keyof typeof habit.completedDays],
      }

      const response = await apiCall(`/api/habits/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completedDays: updatedCompletedDays }),
      })

      setHabits(prev =>
        prev.map(h => h.id === id ? response.habit : h)
      )
    } catch (err) {
      console.error('Error toggling habit day:', err)
      throw err
    }
  }, [session?.user, habits, apiCall])

  const deleteHabit = useCallback(async (id: string) => {
    if (!session?.user) throw new Error('User not authenticated')

    try {
      await apiCall(`/api/habits/${id}`, { method: 'DELETE' })
      setHabits(prev => prev.filter(h => h.id !== id))
    } catch (err) {
      console.error('Error deleting habit:', err)
      throw err
    }
  }, [session?.user, apiCall])

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    if (!session?.user) throw new Error('User not authenticated')

    try {
      const response = await apiCall(`/api/habits/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })

      setHabits(prev =>
        prev.map(h => h.id === id ? response.habit : h)
      )
    } catch (err) {
      console.error('Error updating habit:', err)
      throw err
    }
  }, [session?.user, apiCall])

  // Daily Task Management (localStorage for now - can be extended to API later)
  const addDailyTask = useCallback((day: string, text: string, options?: Partial<DailyTask>) => {
    const newTask: DailyTask = {
      id: Date.now().toString(),
      text,
      day,
      completed: false,
      createdAt: new Date(),
      priority: options?.priority || 'medium',
      estimatedTime: options?.estimatedTime,
      category: options?.category,
      aiGenerated: options?.aiGenerated || false,
      suggestedTime: options?.suggestedTime,
    }
    setDailyTasks(prev => [...prev, newTask])
  }, [])

  const toggleDailyTask = useCallback((id: string) => {
    setDailyTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }, [])

  const deleteDailyTask = useCallback((id: string) => {
    setDailyTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  const updateDailyTask = useCallback((id: string, updates: Partial<DailyTask>) => {
    setDailyTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates }
          : task
      )
    )
  }, [])

  // Smart Insights Management (localStorage for now)
  const addSmartInsight = useCallback((insight: SmartInsight) => {
    setSmartInsights(prev => {
      const exists = prev.some(existing => existing.id === insight.id)
      if (exists) return prev
      return [...prev, insight]
    })
  }, [])

  const dismissSmartInsight = useCallback((insightId: string) => {
    setSmartInsights(prev =>
      prev.map(insight =>
        insight.id === insightId
          ? { ...insight, dismissed: true }
          : insight
      )
    )
  }, [])

  const removeSmartInsight = useCallback((insightId: string) => {
    setSmartInsights(prev => prev.filter(insight => insight.id !== insightId))
  }, [])

  // Enhanced Statistics
  const getWeeklyStats = useCallback((): WeeklyStats => {
    const totalPriorities = priorities.length
    const prioritiesCompleted = priorities.filter(p => p.completed).length
    const prioritiesCompletionRate = totalPriorities > 0
      ? (prioritiesCompleted / totalPriorities) * 100
      : 0

    const totalHabits = habits.length
    const habitConsistency = totalHabits > 0
      ? habits.reduce((acc, habit) => {
        const completedDays = Object.values(habit.completedDays).filter(Boolean).length
        return acc + (completedDays / 7) * 100
      }, 0) / totalHabits
      : 0

    const totalTasks = dailyTasks.length
    const tasksCompleted = dailyTasks.filter(t => t.completed).length
    const tasksCompletionRate = totalTasks > 0
      ? (tasksCompleted / totalTasks) * 100
      : 0

    const overallScore = (prioritiesCompletionRate + habitConsistency + tasksCompletionRate) / 3

    const averageStreakLength = habits.length > 0
      ? habits.reduce((acc, habit) => {
        const streak = getHabitStreak(habit)
        return acc + streak
      }, 0) / habits.length
      : 0

    const longestCurrentStreak = habits.reduce((max, habit) => {
      const streak = getHabitStreak(habit)
      return Math.max(max, streak)
    }, 0)

    const habitsWithChains = habits.filter(h => h.chainedHabits && h.chainedHabits.length > 0)
    const habitChainSuccessRate = habitsWithChains.length > 0
      ? habitsWithChains.reduce((acc, habit) => {
        const completedDays = Object.values(habit.completedDays).filter(Boolean).length
        return acc + (completedDays / 7) * 100
      }, 0) / habitsWithChains.length
      : 0

    const timeSpentOnHabits = habits.reduce((total, habit) => {
      const completedDays = Object.values(habit.completedDays).filter(Boolean).length
      const timePerDay = habit.estimatedTime || 15
      return total + (completedDays * timePerDay)
    }, 0)

    const recentCompletionRate = (prioritiesCompletionRate + habitConsistency + tasksCompletionRate) / 3
    const productivityTrend: 'increasing' | 'decreasing' | 'stable' =
      recentCompletionRate > 75 ? 'increasing' :
        recentCompletionRate < 50 ? 'decreasing' : 'stable'

    const activeInsights = smartInsights.filter(insight => !insight.dismissed)

    return {
      totalPriorities,
      prioritiesCompleted,
      prioritiesCompletionRate,
      totalHabits,
      habitConsistency,
      totalTasks,
      tasksCompleted,
      tasksCompletionRate,
      overallScore,
      averageStreakLength,
      longestCurrentStreak,
      habitChainSuccessRate,
      timeSpentOnHabits,
      productivityTrend,
      aiInsights: activeInsights,
    }
  }, [priorities, habits, dailyTasks, smartInsights])

  // Helper function to calculate habit streak
  const getHabitStreak = useCallback((habit: Habit): number => {
    const days = ['sunday', 'saturday', 'friday', 'thursday', 'wednesday', 'tuesday', 'monday']
    let streak = 0

    for (const day of days) {
      const dayKey = day as keyof typeof habit.completedDays
      if (habit.completedDays[dayKey]) {
        streak++
      } else {
        break
      }
    }

    return streak
  }, [])

  return {
    // Data
    priorities,
    habits,
    dailyTasks,
    smartInsights,

    // Priority actions
    addPriority,
    togglePriority,
    deletePriority,
    updatePriority,

    // Habit actions
    addHabit,
    toggleHabitDay,
    deleteHabit,
    updateHabit,

    // Task actions
    addDailyTask,
    toggleDailyTask,
    deleteDailyTask,
    updateDailyTask,

    // Insights actions
    addSmartInsight,
    dismissSmartInsight,
    removeSmartInsight,

    // Statistics
    getWeeklyStats,
    getHabitStreak,

    // State
    isLoading,
    error,
  }
}