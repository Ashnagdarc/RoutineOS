'use client'

import { useState, useEffect } from 'react'
import { Link, Zap, Plus, X, Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Habit, SmartInsight } from '@/types'

interface SmartHabitChainsProps {
    habits: Habit[]
    onUpdateHabit: (id: string, updates: Partial<Habit>) => void
    onCreateInsight: (insight: SmartInsight) => void
}

interface HabitChain {
    id: string
    name: string
    habits: string[]
    completionRate: number
    currentStreak: number
    longestStreak: number
    createdAt: Date
}

export function SmartHabitChains({ habits, onUpdateHabit, onCreateInsight }: SmartHabitChainsProps) {
    const [chains, setChains] = useState<HabitChain[]>([])
    const [isCreatingChain, setIsCreatingChain] = useState(false)
    const [newChainName, setNewChainName] = useState('')
    const [selectedHabits, setSelectedHabits] = useState<string[]>([])
    const [activeTab, setActiveTab] = useState<'chains' | 'prerequisites' | 'insights'>('chains')

    // Calculate chain completion rates
    useEffect(() => {
        const updatedChains = chains.map(chain => {
            const chainHabits = habits.filter(h => chain.habits.includes(h.id))
            const dailyCompletions = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                const dayKey = day as keyof typeof chainHabits[0]['completedDays']
                return chainHabits.every(habit => habit.completedDays[dayKey])
            })

            const completionRate = (dailyCompletions.filter(Boolean).length / 7) * 100

            // Calculate current streak
            let currentStreak = 0
            for (let i = dailyCompletions.length - 1; i >= 0; i--) {
                if (dailyCompletions[i]) {
                    currentStreak++
                } else {
                    break
                }
            }

            return {
                ...chain,
                completionRate,
                currentStreak
            }
        })

        setChains(updatedChains)

        // Generate insights for struggling chains
        updatedChains.forEach(chain => {
            if (chain.completionRate < 50 && chain.habits.length > 1) {
                onCreateInsight({
                    id: `chain-struggling-${chain.id}`,
                    type: 'habit',
                    title: `Chain "${chain.name}" needs attention`,
                    description: `This habit chain has a ${Math.round(chain.completionRate)}% completion rate. Consider breaking it into smaller chains or focusing on the weakest habit.`,
                    actionable: true,
                    action: 'Review chain structure',
                    confidence: 85,
                    createdAt: new Date(),
                    category: 'performance'
                })
            }
        })
    }, [habits, chains, onCreateInsight])

    const createChain = () => {
        if (newChainName.trim() && selectedHabits.length >= 2) {
            const newChain: HabitChain = {
                id: Date.now().toString(),
                name: newChainName.trim(),
                habits: selectedHabits,
                completionRate: 0,
                currentStreak: 0,
                longestStreak: 0,
                createdAt: new Date()
            }

            setChains(prev => [...prev, newChain])

            // Update habits with chain references
            selectedHabits.forEach(habitId => {
                const habit = habits.find(h => h.id === habitId)
                if (habit) {
                    onUpdateHabit(habitId, {
                        chainedHabits: [...(habit.chainedHabits || []), ...selectedHabits.filter(id => id !== habitId)]
                    })
                }
            })

            setNewChainName('')
            setSelectedHabits([])
            setIsCreatingChain(false)
        }
    }

    const deleteChain = (chainId: string) => {
        const chain = chains.find(c => c.id === chainId)
        if (chain) {
            // Remove chain references from habits
            chain.habits.forEach(habitId => {
                const habit = habits.find(h => h.id === habitId)
                if (habit) {
                    onUpdateHabit(habitId, {
                        chainedHabits: habit.chainedHabits?.filter(id => !chain.habits.includes(id))
                    })
                }
            })
        }
        setChains(prev => prev.filter(c => c.id !== chainId))
    }

    const addPrerequisite = (habitId: string, prerequisiteId: string) => {
        const habit = habits.find(h => h.id === habitId)
        if (habit && !habit.prerequisiteHabits?.includes(prerequisiteId)) {
            onUpdateHabit(habitId, {
                prerequisiteHabits: [...(habit.prerequisiteHabits || []), prerequisiteId]
            })
        }
    }

    const removePrerequisite = (habitId: string, prerequisiteId: string) => {
        const habit = habits.find(h => h.id === habitId)
        if (habit) {
            onUpdateHabit(habitId, {
                prerequisiteHabits: habit.prerequisiteHabits?.filter(id => id !== prerequisiteId)
            })
        }
    }

    const getChainSuccessRate = () => {
        if (chains.length === 0) return 0
        return chains.reduce((acc, chain) => acc + chain.completionRate, 0) / chains.length
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Link size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Smart Habit Chains</h2>
                        <p className="text-gray-400 text-sm">Link habits together for compound success</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{Math.round(getChainSuccessRate())}%</div>
                            <div className="text-xs text-gray-400">Chain Success Rate</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCreatingChain(true)}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus size={16} />
                        <span>Create Chain</span>
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-800/50 rounded-lg p-1">
                {[
                    { id: 'chains', label: 'Habit Chains', icon: Link },
                    { id: 'prerequisites', label: 'Prerequisites', icon: Target },
                    { id: 'insights', label: 'AI Insights', icon: TrendingUp }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                    >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Create Chain Form */}
            {isCreatingChain && (
                <div className="mb-6 p-6 bg-gray-800/50 rounded-xl border border-gray-700 animate-slide-up">
                    <h3 className="text-white font-semibold mb-4">Create New Habit Chain</h3>

                    <div className="space-y-4">
                        <input
                            type="text"
                            value={newChainName}
                            onChange={(e) => setNewChainName(e.target.value)}
                            placeholder="Chain name (e.g., 'Morning Routine')"
                            className="input-primary w-full"
                        />

                        <div>
                            <label className="text-gray-400 text-sm mb-2 block">Select habits to chain (minimum 2):</label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                {habits.map(habit => (
                                    <label key={habit.id} className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded cursor-pointer hover:bg-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={selectedHabits.includes(habit.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedHabits(prev => [...prev, habit.id])
                                                } else {
                                                    setSelectedHabits(prev => prev.filter(id => id !== habit.id))
                                                }
                                            }}
                                            className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="text-white text-sm">{habit.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={createChain}
                                disabled={!newChainName.trim() || selectedHabits.length < 2}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Chain
                            </button>
                            <button
                                onClick={() => {
                                    setIsCreatingChain(false)
                                    setNewChainName('')
                                    setSelectedHabits([])
                                }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Content */}
            {activeTab === 'chains' && (
                <div className="space-y-4">
                    {chains.map(chain => {
                        const chainHabits = habits.filter(h => chain.habits.includes(h.id))

                        return (
                            <div key={chain.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                            <Link size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{chain.name}</h3>
                                            <p className="text-gray-400 text-sm">{chainHabits.length} linked habits</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-white">{Math.round(chain.completionRate)}%</div>
                                            <div className="text-xs text-gray-400">Success Rate</div>
                                        </div>
                                        {chain.currentStreak > 0 && (
                                            <div className="flex items-center space-x-1 bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                                                <Zap size={14} />
                                                <span>{chain.currentStreak} day streak</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => deleteChain(chain.id)}
                                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {chainHabits.map((habit, index) => (
                                        <div key={habit.id} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                                            <div className="text-gray-400 text-sm w-6">{index + 1}.</div>
                                            <div className="flex-1">
                                                <span className="text-white">{habit.name}</span>
                                            </div>
                                            <div className="flex space-x-1">
                                                {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map(day => {
                                                    const isCompleted = habit.completedDays[day]
                                                    return (
                                                        <div
                                                            key={day}
                                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isCompleted
                                                                ? 'bg-green-600 text-white'
                                                                : 'bg-gray-600 text-gray-400'
                                                                }`}
                                                        >
                                                            {isCompleted ? <CheckCircle2 size={12} /> : day[0].toUpperCase()}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${chain.completionRate}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}

                    {chains.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <Link size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No habit chains yet. Create your first chain to boost consistency!</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'prerequisites' && (
                <div className="space-y-4">
                    {habits.map(habit => (
                        <div key={habit.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-white font-medium">{habit.name}</span>
                                <span className="text-gray-400 text-sm">
                                    {habit.prerequisiteHabits?.length || 0} prerequisites
                                </span>
                            </div>

                            {habit.prerequisiteHabits?.length ? (
                                <div className="space-y-2">
                                    {habit.prerequisiteHabits.map(prereqId => {
                                        const prereqHabit = habits.find(h => h.id === prereqId)
                                        return prereqHabit ? (
                                            <div key={prereqId} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                                                <span className="text-gray-300 text-sm">{prereqHabit.name}</span>
                                                <button
                                                    onClick={() => removePrerequisite(habit.id, prereqId)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : null
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No prerequisites set</p>
                            )}

                            <div className="mt-3 pt-3 border-t border-gray-700">
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addPrerequisite(habit.id, e.target.value)
                                            e.target.value = ''
                                        }
                                    }}
                                    className="input-primary text-sm"
                                    defaultValue=""
                                >
                                    <option value="">Add prerequisite...</option>
                                    {habits
                                        .filter(h => h.id !== habit.id && !habit.prerequisiteHabits?.includes(h.id))
                                        .map(h => (
                                            <option key={h.id} value={h.id}>{h.name}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'insights' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp size={16} className="text-green-400" />
                                <span className="text-white font-medium">Chain Performance</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400">{Math.round(getChainSuccessRate())}%</div>
                            <p className="text-gray-400 text-sm">Average success rate across all chains</p>
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertCircle size={16} className="text-orange-400" />
                                <span className="text-white font-medium">Active Chains</span>
                            </div>
                            <div className="text-2xl font-bold text-orange-400">{chains.length}</div>
                            <p className="text-gray-400 text-sm">Total habit chains created</p>
                        </div>
                    </div>

                    <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                        <h3 className="text-blue-400 font-semibold mb-2">💡 Smart Tip</h3>
                        <p className="text-gray-300 text-sm">
                            Habit chains work best with 2-4 related habits. Start small and build complexity as your consistency improves.
                            Morning and evening routines are typically the most successful chains.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
} 