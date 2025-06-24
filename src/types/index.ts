export interface Priority {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export interface Habit {
  id: string
  name: string
  completedDays: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  createdAt: Date
}

export interface DailyTask {
  id: string
  text: string
  day: string
  completed: boolean
  createdAt: Date
}

export interface WeeklyStats {
  totalPriorities: number
  prioritiesCompleted: number
  prioritiesCompletionRate: number
  
  totalHabits: number
  habitConsistency: number
  
  totalTasks: number
  tasksCompleted: number
  tasksCompletionRate: number
  
  overallScore: number
}