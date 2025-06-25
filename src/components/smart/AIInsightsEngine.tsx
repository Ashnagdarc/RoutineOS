'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, Target, Lightbulb, X, Star } from 'lucide-react'
import { Habit, Priority, DailyTask, SmartInsight } from '@/types'

interface AIInsightsEngineProps {
    habits: Habit[]
    priorities: Priority[]
    dailyTasks: DailyTask[]
    onDismissInsight: (insightId: string) => void
}

export function AIInsightsEngine({ habits, priorities, dailyTasks, onDismissInsight }: AIInsightsEngineProps) {
    const [insights, setInsights] = useState<SmartInsight[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // AI Analysis Engine
    useEffect(() => {
        setIsAnalyzing(true)

        const generateInsights = () => {
            const newInsights: SmartInsight[] = []

            // Habit Streak Analysis
            habits.forEach(habit => {
                const completedDays = Object.values(habit.completedDays).filter(Boolean).length
                const consistencyRate = (completedDays / 7) * 100

                if (consistencyRate < 30) {
                    newInsights.push({
                        id: `habit-struggling-${habit.id}`,
                        type: 'habit',
                        title: `"${habit.name}" needs attention`,
                        description: `Only ${Math.round(consistencyRate)}% completion this week. Consider reducing difficulty or breaking into smaller steps.`,
                        actionable: true,
                        action: 'Simplify habit',
                        confidence: 85,
                        createdAt: new Date(),
                        category: 'warning'
                    })
                } else if (consistencyRate > 85) {
                    newInsights.push({
                        id: `habit-success-${habit.id}`,
                        type: 'habit',
                        title: `"${habit.name}" is crushing it! 🎉`,
                        description: `${Math.round(consistencyRate)}% completion rate is excellent. Consider adding a related habit to build momentum.`,
                        actionable: true,
                        action: 'Expand habit stack',
                        confidence: 90,
                        createdAt: new Date(),
                        category: 'performance'
                    })
                }
            })

            // Priority Completion Patterns
            const completedPriorities = priorities.filter(p => p.completed).length
            const totalPriorities = priorities.length
            const priorityRate = totalPriorities > 0 ? (completedPriorities / totalPriorities) * 100 : 0

            if (priorityRate < 50 && totalPriorities > 0) {
                newInsights.push({
                    id: 'priorities-overload',
                    type: 'priority',
                    title: 'Priority overload detected',
                    description: `You're completing only ${Math.round(priorityRate)}% of priorities. Consider reducing weekly goals or breaking large tasks into smaller ones.`,
                    actionable: true,
                    action: 'Reduce weekly priorities',
                    confidence: 80,
                    createdAt: new Date(),
                    category: 'productivity'
                })
            }

            // Time-based Insights
            const morningHabits = habits.filter(h => h.optimalTimes?.includes('morning')).length
            const eveningHabits = habits.filter(h => h.optimalTimes?.includes('evening')).length

            if (morningHabits === 0 && habits.length > 0) {
                newInsights.push({
                    id: 'morning-routine-missing',
                    type: 'habit',
                    title: 'Missing morning routine',
                    description: 'Starting your day with consistent habits can boost daily productivity by up to 40%. Consider adding a morning habit.',
                    actionable: true,
                    action: 'Add morning habit',
                    confidence: 75,
                    createdAt: new Date(),
                    category: 'timing'
                })
            }

            // Task Completion Patterns
            const tasksByDay = dailyTasks.reduce((acc, task) => {
                acc[task.day] = (acc[task.day] || 0) + 1
                return acc
            }, {} as Record<string, number>)

            const completedTasksByDay = dailyTasks.filter(t => t.completed).reduce((acc, task) => {
                acc[task.day] = (acc[task.day] || 0) + 1
                return acc
            }, {} as Record<string, number>)

            // Find best and worst performing days
            const dayPerformance = Object.keys(tasksByDay).map(day => ({
                day,
                total: tasksByDay[day],
                completed: completedTasksByDay[day] || 0,
                rate: ((completedTasksByDay[day] || 0) / tasksByDay[day]) * 100
            })).sort((a, b) => b.rate - a.rate)

            if (dayPerformance.length > 0) {
                const bestDay = dayPerformance[0]
                const worstDay = dayPerformance[dayPerformance.length - 1]

                if (bestDay.rate > 80) {
                    newInsights.push({
                        id: 'best-day-insight',
                        type: 'general',
                        title: `${bestDay.day} is your power day!`,
                        description: `You complete ${Math.round(bestDay.rate)}% of tasks on ${bestDay.day}s. Consider scheduling important priorities on this day.`,
                        actionable: true,
                        action: `Schedule important tasks on ${bestDay.day}`,
                        confidence: 85,
                        createdAt: new Date(),
                        category: 'timing'
                    })
                }

                if (worstDay.rate < 40 && worstDay.total > 1) {
                    newInsights.push({
                        id: 'worst-day-insight',
                        type: 'general',
                        title: `${worstDay.day} needs optimization`,
                        description: `Only ${Math.round(worstDay.rate)}% task completion on ${worstDay.day}s. Consider reducing tasks or identifying blockers.`,
                        actionable: true,
                        action: `Optimize ${worstDay.day} schedule`,
                        confidence: 75,
                        createdAt: new Date(),
                        category: 'productivity'
                    })
                }
            }

            // Productivity Trend Analysis
            const recentHabits = habits.filter(h => {
                const daysAgo = (Date.now() - new Date(h.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                return daysAgo <= 7
            }).length

            if (recentHabits > 3) {
                newInsights.push({
                    id: 'habit-overload',
                    type: 'general',
                    title: 'Too many new habits at once',
                    description: `You've added ${recentHabits} habits this week. Research shows focusing on 1-2 habits at a time leads to 80% higher success rates.`,
                    actionable: true,
                    action: 'Focus on top 2 habits',
                    confidence: 90,
                    createdAt: new Date(),
                    category: 'warning'
                })
            }

            // Streak Opportunities
            habits.forEach(habit => {
                const daysInOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                let potentialStreak = 0

                for (let i = 0; i < daysInOrder.length; i++) {
                    const day = daysInOrder[i] as keyof typeof habit.completedDays
                    if (habit.completedDays[day]) {
                        potentialStreak++
                    } else if (potentialStreak >= 3) {
                        newInsights.push({
                            id: `streak-opportunity-${habit.id}`,
                            type: 'habit',
                            title: `Streak opportunity: "${habit.name}"`,
                            description: `You're ${potentialStreak} days into a potential streak! Complete today to keep momentum going.`,
                            actionable: true,
                            action: 'Complete habit today',
                            confidence: 70,
                            createdAt: new Date(),
                            category: 'streak'
                        })
                        break
                    } else {
                        potentialStreak = 0
                    }
                }
            })

            setInsights(newInsights)
        }

        // Simulate AI processing time
        const timer = setTimeout(() => {
            generateInsights()
            setIsAnalyzing(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [habits, priorities, dailyTasks])

    const filteredInsights = insights.filter(insight =>
        selectedCategory === 'all' || insight.category === selectedCategory
    )

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'performance': return TrendingUp
            case 'timing': return Clock
            case 'streak': return Star
            case 'productivity': return Target
            case 'warning': return AlertTriangle
            default: return Lightbulb
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'performance': return 'text-green-400 bg-green-600/20 border-green-500/30'
            case 'timing': return 'text-blue-400 bg-blue-600/20 border-blue-500/30'
            case 'streak': return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/30'
            case 'productivity': return 'text-purple-400 bg-purple-600/20 border-purple-500/30'
            case 'warning': return 'text-red-400 bg-red-600/20 border-red-500/30'
            default: return 'text-gray-400 bg-gray-600/20 border-gray-500/30'
        }
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Brain size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">AI Insights Engine</h2>
                        <p className="text-gray-400 text-sm">Personalized recommendations based on your patterns</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {isAnalyzing && (
                        <div className="flex items-center space-x-2 text-blue-400">
                            <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                            <span className="text-sm">Analyzing...</span>
                        </div>
                    )}
                    <div className="bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700">
                        <div className="text-center">
                            <div className="text-lg font-bold text-blue-400">{insights.length}</div>
                            <div className="text-xs text-gray-400">Active Insights</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'performance', 'timing', 'streak', 'productivity', 'warning'].map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                            }`}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                        {category !== 'all' && (
                            <span className="ml-1 text-xs">
                                ({insights.filter(i => i.category === category).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Insights List */}
            <div className="space-y-4">
                {filteredInsights.length > 0 ? (
                    filteredInsights.map(insight => {
                        const Icon = getCategoryIcon(insight.category)
                        const colorClass = getCategoryColor(insight.category)

                        return (
                            <div
                                key={insight.id}
                                className={`p-4 rounded-xl border ${colorClass} relative animate-fade-in`}
                            >
                                <button
                                    onClick={() => onDismissInsight(insight.id)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-400"
                                >
                                    <X size={16} />
                                </button>

                                <div className="flex items-start space-x-3 pr-8">
                                    <Icon size={20} className={insight.category === 'performance' ? 'text-green-400' :
                                        insight.category === 'timing' ? 'text-blue-400' :
                                            insight.category === 'streak' ? 'text-yellow-400' :
                                                insight.category === 'productivity' ? 'text-purple-400' :
                                                    insight.category === 'warning' ? 'text-red-400' : 'text-gray-400'} />

                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold mb-1">{insight.title}</h3>
                                        <p className="text-gray-300 text-sm mb-3">{insight.description}</p>

                                        <div className="flex items-center justify-between">
                                            {insight.actionable && insight.action && (
                                                <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors">
                                                    {insight.action}
                                                </button>
                                            )}

                                            <div className="flex items-center space-x-3 text-xs text-gray-400">
                                                <span>Confidence: {insight.confidence}%</span>
                                                <span>•</span>
                                                <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        {isAnalyzing ? (
                            <div className="space-y-4">
                                <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
                                <p>AI is analyzing your productivity patterns...</p>
                            </div>
                        ) : (
                            <div>
                                <Brain size={48} className="mx-auto mb-4 opacity-50" />
                                <p>
                                    {selectedCategory === 'all'
                                        ? "No insights available. Keep tracking your habits and priorities to unlock AI recommendations!"
                                        : `No ${selectedCategory} insights at the moment.`
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* AI Tips */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb size={16} className="text-blue-400" />
                    <span className="text-blue-400 font-semibold">AI Tip</span>
                </div>
                <p className="text-gray-300 text-sm">
                    The AI insights engine learns from your patterns and adapts its recommendations over time.
                    The more data you provide through consistent tracking, the more personalized and accurate the insights become.
                </p>
            </div>
        </div>
    )
} 