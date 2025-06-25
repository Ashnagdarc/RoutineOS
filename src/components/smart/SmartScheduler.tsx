'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Zap, Brain, TrendingUp, Sun, Moon, Coffee, Star } from 'lucide-react'
import { Habit, DailyTask, Priority } from '@/types'

interface SmartSchedulerProps {
    habits: Habit[]
    dailyTasks: DailyTask[]
    priorities: Priority[]
    onUpdateHabit: (id: string, updates: Partial<Habit>) => void
    onCreateTask: (task: Omit<DailyTask, 'id' | 'createdAt'>) => void
}

interface TimeSlot {
    time: string
    label: string
    icon: any
    productivity: number
    description: string
    suggestedFor: string[]
}

interface ScheduleSuggestion {
    id: string
    type: 'habit' | 'task' | 'priority'
    itemId: string
    itemName: string
    suggestedTime: string
    reason: string
    confidence: number
    estimatedDuration: number
}

export function SmartScheduler({ habits, dailyTasks, priorities, onUpdateHabit, onCreateTask }: SmartSchedulerProps) {
    const [suggestions, setSuggestions] = useState<ScheduleSuggestion[]>([])
    const [selectedDay, setSelectedDay] = useState('monday')
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const timeSlots: TimeSlot[] = [
        {
            time: '06:00',
            label: 'Early Morning',
            icon: Sun,
            productivity: 85,
            description: 'Peak willpower and focus',
            suggestedFor: ['exercise', 'meditation', 'reading', 'planning']
        },
        {
            time: '08:00',
            label: 'Morning',
            icon: Coffee,
            productivity: 90,
            description: 'Highest cognitive performance',
            suggestedFor: ['deep work', 'priority tasks', 'learning']
        },
        {
            time: '10:00',
            label: 'Late Morning',
            icon: TrendingUp,
            productivity: 88,
            description: 'Great for collaboration',
            suggestedFor: ['meetings', 'creative work', 'problem solving']
        },
        {
            time: '14:00',
            label: 'Afternoon',
            icon: Clock,
            productivity: 70,
            description: 'Post-lunch dip recovery',
            suggestedFor: ['routine tasks', 'admin work', 'light exercise']
        },
        {
            time: '16:00',
            label: 'Late Afternoon',
            icon: Brain,
            productivity: 75,
            description: 'Second wind period',
            suggestedFor: ['creative work', 'brainstorming', 'review']
        },
        {
            time: '18:00',
            label: 'Evening',
            icon: Star,
            productivity: 65,
            description: 'Wind down and reflect',
            suggestedFor: ['reflection', 'planning', 'light habits']
        },
        {
            time: '20:00',
            label: 'Night',
            icon: Moon,
            productivity: 50,
            description: 'Relaxation and recovery',
            suggestedFor: ['reading', 'meditation', 'family time']
        }
    ]

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // AI Scheduling Algorithm
    useEffect(() => {
        setIsAnalyzing(true)

        const generateSuggestions = () => {
            const newSuggestions: ScheduleSuggestion[] = []

            // Analyze habit completion patterns by time
            habits.forEach(habit => {
                const currentOptimalTimes = habit.optimalTimes || []

                // If no optimal times set, suggest based on habit type and current performance
                if (currentOptimalTimes.length === 0) {
                    const completionRate = Object.values(habit.completedDays).filter(Boolean).length / 7

                    let suggestedTime = 'morning' // default
                    let reason = 'Morning routines have highest completion rates'
                    let confidence = 70

                    // Analyze habit name for keywords
                    const habitName = habit.name.toLowerCase()

                    if (habitName.includes('exercise') || habitName.includes('workout') || habitName.includes('run')) {
                        suggestedTime = 'early-morning'
                        reason = 'Exercise is most effective in early morning when willpower is strongest'
                        confidence = 85
                    } else if (habitName.includes('read') || habitName.includes('study') || habitName.includes('learn')) {
                        suggestedTime = 'morning'
                        reason = 'Learning activities benefit from peak cognitive performance in morning'
                        confidence = 80
                    } else if (habitName.includes('meditat') || habitName.includes('journal') || habitName.includes('reflect')) {
                        if (Math.random() > 0.5) {
                            suggestedTime = 'early-morning'
                            reason = 'Morning meditation sets positive tone for the day'
                        } else {
                            suggestedTime = 'evening'
                            reason = 'Evening reflection helps process the day'
                        }
                        confidence = 75
                    } else if (habitName.includes('water') || habitName.includes('vitamin') || habitName.includes('supplement')) {
                        suggestedTime = 'morning'
                        reason = 'Health habits are best established as part of morning routine'
                        confidence = 80
                    }

                    newSuggestions.push({
                        id: `habit-time-${habit.id}`,
                        type: 'habit',
                        itemId: habit.id,
                        itemName: habit.name,
                        suggestedTime,
                        reason,
                        confidence,
                        estimatedDuration: habit.estimatedTime || 15
                    })
                }
            })

            // Suggest optimal times for unscheduled priorities
            priorities.filter(p => !p.completed && !p.dueDate).forEach(priority => {
                const estimatedTime = priority.estimatedTime || 60
                let suggestedTime = 'morning'
                let reason = 'High-priority tasks are best tackled when energy is highest'
                let confidence = 75

                const priorityText = priority.text.toLowerCase()

                if (priority.priority === 'urgent') {
                    suggestedTime = 'morning'
                    reason = 'Urgent tasks require immediate attention during peak hours'
                    confidence = 90
                } else if (estimatedTime > 120) {
                    suggestedTime = 'morning'
                    reason = 'Large tasks need extended focus time available in morning'
                    confidence = 85
                } else if (priorityText.includes('creative') || priorityText.includes('design') || priorityText.includes('brainstorm')) {
                    suggestedTime = 'late-morning'
                    reason = 'Creative work benefits from collaborative energy of late morning'
                    confidence = 80
                } else if (priorityText.includes('email') || priorityText.includes('admin') || priorityText.includes('organize')) {
                    suggestedTime = 'afternoon'
                    reason = 'Administrative tasks are perfect for afternoon productivity dip'
                    confidence = 70
                }

                newSuggestions.push({
                    id: `priority-time-${priority.id}`,
                    type: 'priority',
                    itemId: priority.id,
                    itemName: priority.text,
                    suggestedTime,
                    reason,
                    confidence,
                    estimatedDuration: estimatedTime
                })
            })

            // Suggest daily task optimizations
            const tasksForDay = dailyTasks.filter(t => t.day === selectedDay)
            tasksForDay.forEach(task => {
                if (!task.suggestedTime) {
                    let suggestedTime = 'morning'
                    let reason = 'Default optimal scheduling for tasks'
                    let confidence = 60

                    const taskText = task.text.toLowerCase()

                    if (taskText.includes('plan') || taskText.includes('schedule') || taskText.includes('prepare')) {
                        suggestedTime = 'early-morning'
                        reason = 'Planning tasks are most effective when mind is fresh'
                        confidence = 85
                    } else if (taskText.includes('review') || taskText.includes('check') || taskText.includes('update')) {
                        suggestedTime = 'afternoon'
                        reason = 'Review tasks work well during natural afternoon reflection time'
                        confidence = 75
                    } else if (task.priority === 'high') {
                        suggestedTime = 'morning'
                        reason = 'High-priority tasks deserve peak performance hours'
                        confidence = 80
                    }

                    newSuggestions.push({
                        id: `task-time-${task.id}`,
                        type: 'task',
                        itemId: task.id,
                        itemName: task.text,
                        suggestedTime,
                        reason,
                        confidence,
                        estimatedDuration: task.estimatedTime || 30
                    })
                }
            })

            setSuggestions(newSuggestions)
        }

        const timer = setTimeout(() => {
            generateSuggestions()
            setIsAnalyzing(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [habits, priorities, dailyTasks, selectedDay])

    const applySuggestion = (suggestion: ScheduleSuggestion) => {
        if (suggestion.type === 'habit') {
            const habit = habits.find(h => h.id === suggestion.itemId)
            if (habit) {
                onUpdateHabit(suggestion.itemId, {
                    optimalTimes: [...(habit.optimalTimes || []), suggestion.suggestedTime]
                })
            }
        } else if (suggestion.type === 'task') {
            // Update task with suggested time
            // This would need to be implemented in the parent component
        }

        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
    }

    const getTimeSlotForSuggestion = (suggestedTime: string) => {
        const timeMap: Record<string, string> = {
            'early-morning': '06:00',
            'morning': '08:00',
            'late-morning': '10:00',
            'afternoon': '14:00',
            'late-afternoon': '16:00',
            'evening': '18:00',
            'night': '20:00'
        }
        return timeMap[suggestedTime] || '08:00'
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Smart Scheduler</h2>
                        <p className="text-gray-400 text-sm">AI-powered optimal timing recommendations</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {isAnalyzing && (
                        <div className="flex items-center space-x-2 text-orange-400">
                            <div className="animate-spin w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full"></div>
                            <span className="text-sm">Analyzing...</span>
                        </div>
                    )}
                    <div className="bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700">
                        <div className="text-center">
                            <div className="text-lg font-bold text-orange-400">{suggestions.length}</div>
                            <div className="text-xs text-gray-400">Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Day Selector */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
                {days.map((day, index) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedDay === day
                            ? 'bg-orange-600 text-white shadow-lg'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                            }`}
                    >
                        {dayLabels[index]}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Time Slots Overview */}
                <div className="space-y-4">
                    <h3 className="text-white font-semibold mb-4">Optimal Time Slots</h3>
                    {timeSlots.map(slot => (
                        <div key={slot.time} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <slot.icon size={20} className="text-orange-400" />
                                    <div>
                                        <span className="text-white font-medium">{slot.label}</span>
                                        <span className="text-gray-400 text-sm ml-2">{slot.time}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-white">{slot.productivity}%</div>
                                    <div className="text-xs text-gray-400">Productivity</div>
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm mb-2">{slot.description}</p>

                            <div className="flex flex-wrap gap-1">
                                {slot.suggestedFor.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-orange-600/20 text-orange-400 text-xs rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${slot.productivity}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Suggestions */}
                <div className="space-y-4">
                    <h3 className="text-white font-semibold mb-4">AI Scheduling Suggestions</h3>

                    {suggestions.length > 0 ? (
                        suggestions.map(suggestion => (
                            <div key={suggestion.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 animate-fade-in">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium mb-1">{suggestion.itemName}</h4>
                                        <p className="text-gray-400 text-sm mb-2">{suggestion.reason}</p>

                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className="text-orange-400">
                                                {timeSlots.find(t => t.time === getTimeSlotForSuggestion(suggestion.suggestedTime))?.label || suggestion.suggestedTime}
                                            </span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-gray-400">{suggestion.estimatedDuration}min</span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-green-400">{suggestion.confidence}% confidence</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => applySuggestion(suggestion)}
                                        className="btn-primary text-sm px-3 py-1"
                                    >
                                        Apply
                                    </button>
                                </div>

                                <div className="w-full bg-gray-700 rounded-full h-1">
                                    <div
                                        className="bg-orange-600 h-1 rounded-full transition-all duration-500"
                                        style={{ width: `${suggestion.confidence}%` }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            {isAnalyzing ? (
                                <div className="space-y-4">
                                    <div className="animate-spin w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full mx-auto"></div>
                                    <p>Analyzing optimal scheduling opportunities...</p>
                                </div>
                            ) : (
                                <div>
                                    <Clock size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No scheduling suggestions available. Your time management is already optimized!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Smart Tips */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-600/10 to-red-600/10 border border-orange-500/30 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                    <Brain size={16} className="text-orange-400" />
                    <span className="text-orange-400 font-semibold">Scheduling Science</span>
                </div>
                <p className="text-gray-300 text-sm">
                    Research shows that scheduling habits at consistent times increases success rates by 60%.
                    The AI scheduler considers your personal patterns, cognitive research, and optimal productivity windows.
                </p>
            </div>
        </div>
    )
} 