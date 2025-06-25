export interface Priority {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  dueDate?: Date
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  estimatedTime?: number // minutes
  tags?: string[]
  category?: string
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
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  estimatedTime?: number // minutes
  streak?: number
  longestStreak?: number
  chainedHabits?: string[] // IDs of habits that should be completed together
  prerequisiteHabits?: string[] // IDs of habits that must be completed first
  optimalTimes?: string[] // Suggested times like ['morning', 'afternoon', 'evening']
  aiInsights?: {
    successRate: number
    bestCompletionTime: string
    suggestionText: string
    lastUpdated: Date
  }
}

export interface DailyTask {
  id: string
  text: string
  day: string
  completed: boolean
  createdAt: Date
  priority?: 'low' | 'medium' | 'high'
  estimatedTime?: number
  category?: string
  aiGenerated?: boolean
  suggestedTime?: string
}

export interface Goal {
  id: string
  title: string
  description: string
  targetDate: Date
  createdAt: Date
  completed: boolean
  progress: number // 0-100
  type: 'habit' | 'priority' | 'custom'
  relatedItemIds: string[] // Related habits/priorities
  milestones: Milestone[]
  category: string
  aiInsights?: {
    completionProbability: number
    suggestedActions: string[]
    riskFactors: string[]
    lastUpdated: Date
  }
}

export interface Milestone {
  id: string
  title: string
  completed: boolean
  dueDate: Date
  progress: number
}

export interface SmartInsight {
  id: string
  type: 'habit' | 'priority' | 'task' | 'goal' | 'general'
  title: string
  description: string
  actionable: boolean
  action?: string
  confidence: number // 0-100
  createdAt: Date
  dismissed?: boolean
  category: 'performance' | 'timing' | 'streak' | 'productivity' | 'warning'
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
  // Enhanced stats
  averageStreakLength: number
  longestCurrentStreak: number
  habitChainSuccessRate: number
  timeSpentOnHabits: number // minutes
  productivityTrend: 'increasing' | 'decreasing' | 'stable'
  aiInsights: SmartInsight[]
}