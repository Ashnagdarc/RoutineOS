import { useState, useCallback } from 'react'
import { Priority, Habit, DailyTask, WeeklyStats } from '@/types'
import { useLocalStorage } from './useLocalStorage'

export function useDashboardData() {
  const [priorities, setPriorities] = useLocalStorage<Priority[]>('dashboard-priorities', [])
  const [habits, setHabits] = useLocalStorage<Habit[]>('dashboard-habits', [])
  const [dailyTasks, setDailyTasks] = useLocalStorage<DailyTask[]>('dashboard-tasks', [])

  // Priority Management
  const addPriority = useCallback((text: string) => {
    const newPriority: Priority = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
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

  // Habit Management
  const addHabit = useCallback((name: string) => {
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

  // Daily Task Management
  const addDailyTask = useCallback((day: string, text: string) => {
    const newTask: DailyTask = {
      id: Date.now().toString(),
      text,
      day,
      completed: false,
      createdAt: new Date(),
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

  // Statistics
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
    }
  }, [priorities, habits, dailyTasks])

  return {
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
  }
}