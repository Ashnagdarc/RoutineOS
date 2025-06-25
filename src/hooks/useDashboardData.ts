import { useState, useCallback, useEffect } from 'react'
import { Priority, Habit, DailyTask, WeeklyStats, SmartInsight } from '@/types'
import { useLocalStorage } from './useLocalStorage'

export function useDashboardData() {
  const [priorities, setPriorities] = useLocalStorage<Priority[]>('dashboard-priorities', [])
  const [habits, setHabits] = useLocalStorage<Habit[]>('dashboard-habits', [])
  const [dailyTasks, setDailyTasks] = useLocalStorage<DailyTask[]>('dashboard-tasks', [])
  const [smartInsights, setSmartInsights] = useLocalStorage<SmartInsight[]>('dashboard-insights', [])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize loading state
  useEffect(() => {
    // Simulate initial data load time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Priority Management
  const addPriority = useCallback((text: string, options?: Partial<Priority>) => {
    const newPriority: Priority = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
      priority: options?.priority || 'medium',
      estimatedTime: options?.estimatedTime,
      dueDate: options?.dueDate,
      tags: options?.tags || [],
    }
    setPriorities(prev => [...prev, newPriority])
  }, [setPriorities])

  const togglePriority = useCallback((id: string) => {
    setPriorities(prev =>
      prev.map(priority =>
        priority.id === id
          ? { ...priority, completed: !priority.completed }
          : priority
      )
    )
  }, [setPriorities])

  const deletePriority = useCallback((id: string) => {
    setPriorities(prev => prev.filter(priority => priority.id !== id))
  }, [setPriorities])

  const updatePriority = useCallback((id: string, updates: Partial<Priority>) => {
    setPriorities(prev =>
      prev.map(priority =>
        priority.id === id
          ? { ...priority, ...updates }
          : priority
      )
    )
  }, [setPriorities])

  // Habit Management
  const addHabit = useCallback((name: string, options?: Partial<Habit>) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      completedDays: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      createdAt: new Date(),
      category: options?.category,
      difficulty: options?.difficulty || 'medium',
      estimatedTime: options?.estimatedTime || 15,
      optimalTimes: options?.optimalTimes || [],
      chainedHabits: options?.chainedHabits || [],
      prerequisiteHabits: options?.prerequisiteHabits || [],
    }
    setHabits(prev => [...prev, newHabit])
  }, [setHabits])

  const toggleHabitDay = useCallback((id: string, day: string) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id
          ? {
            ...habit,
            completedDays: {
              ...habit.completedDays,
              [day]: !habit.completedDays[day as keyof typeof habit.completedDays],
            },
          }
          : habit
      )
    )
  }, [setHabits])

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id))
  }, [setHabits])

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id
          ? { ...habit, ...updates }
          : habit
      )
    )
  }, [setHabits])

  // Daily Task Management
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
  }, [setDailyTasks])

  const toggleDailyTask = useCallback((id: string) => {
    setDailyTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }, [setDailyTasks])

  const deleteDailyTask = useCallback((id: string) => {
    setDailyTasks(prev => prev.filter(task => task.id !== id))
  }, [setDailyTasks])

  const updateDailyTask = useCallback((id: string, updates: Partial<DailyTask>) => {
    setDailyTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates }
          : task
      )
    )
  }, [setDailyTasks])

  // Smart Insights Management
  const addSmartInsight = useCallback((insight: SmartInsight) => {
    setSmartInsights(prev => {
      // Avoid duplicates
      const exists = prev.some(existing => existing.id === insight.id)
      if (exists) return prev
      return [...prev, insight]
    })
  }, [setSmartInsights])

  const dismissSmartInsight = useCallback((insightId: string) => {
    setSmartInsights(prev =>
      prev.map(insight =>
        insight.id === insightId
          ? { ...insight, dismissed: true }
          : insight
      )
    )
  }, [setSmartInsights])

  const removeSmartInsight = useCallback((insightId: string) => {
    setSmartInsights(prev => prev.filter(insight => insight.id !== insightId))
  }, [setSmartInsights])

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

    // Enhanced metrics
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

    // Calculate habit chain success rate
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

    // Simple trend calculation (could be enhanced with historical data)
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
    const days = ['sunday', 'saturday', 'friday', 'thursday', 'wednesday', 'tuesday', 'monday'] // Reverse order for streak calculation
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
  }
}