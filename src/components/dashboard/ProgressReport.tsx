'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Calendar, Download, Target, Zap, CheckSquare, Flame, Trophy, Clock, Brain, Star, Activity } from 'lucide-react'
import { WeeklyStats } from '@/types'

interface ProgressReportProps {
  stats: WeeklyStats
}

type ColorType = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'

export function ProgressReport({ stats }: ProgressReportProps) {
  const [timeRange, setTimeRange] = useState('week')
  const [activeTab, setActiveTab] = useState('overview')

  const generatePDFReport = () => {
    // This would implement PDF generation with jspdf
    console.log('Generating PDF report...')
  }

  // Mock data for enhanced analytics (in real app, this would come from your data store)
  const streakData = {
    currentStreak: 7,
    longestStreak: 21,
    weeklyStreaks: [3, 5, 7, 4, 6, 7, 7] // Last 7 weeks
  }

  const productivityScore = {
    current: 85,
    trend: '+12%',
    breakdown: {
      consistency: 90,
      efficiency: 82,
      focus: 83,
      completion: 85
    }
  }

  const weeklyTrends = [
    { day: 'Mon', priorities: 80, habits: 90, tasks: 75 },
    { day: 'Tue', priorities: 90, habits: 85, tasks: 80 },
    { day: 'Wed', priorities: 75, habits: 95, tasks: 70 },
    { day: 'Thu', priorities: 85, habits: 80, tasks: 85 },
    { day: 'Fri', priorities: 95, habits: 75, tasks: 90 },
    { day: 'Sat', priorities: 60, habits: 85, tasks: 65 },
    { day: 'Sun', priorities: 70, habits: 90, tasks: 60 }
  ]

  const StatCard = ({
    title,
    value,
    total,
    percentage,
    icon: Icon,
    color = 'blue',
    subtitle,
    trend
  }: {
    title: string
    value: number
    total?: number
    percentage: number
    icon: any
    color?: ColorType
    subtitle?: string
    trend?: string
  }) => {
    const colorClasses: Record<ColorType, string> = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      purple: 'bg-purple-600',
      orange: 'bg-orange-600',
      red: 'bg-red-600',
      yellow: 'bg-yellow-600'
    }

    const bgColorClasses: Record<ColorType, string> = {
      blue: 'bg-blue-600/20',
      green: 'bg-green-600/20',
      purple: 'bg-purple-600/20',
      orange: 'bg-orange-600/20',
      red: 'bg-red-600/20',
      yellow: 'bg-yellow-600/20'
    }

    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon size={24} className="text-white" />
          </div>
          <div className={`px-3 py-1 ${bgColorClasses[color]} rounded-full`}>
            <span className="text-sm font-medium text-white">{Math.round(percentage)}%</span>
          </div>
        </div>

        <h3 className="text-white font-semibold mb-1">{title}</h3>
        {subtitle && <p className="text-gray-400 text-xs mb-3">{subtitle}</p>}

        <div className="flex items-baseline space-x-2 mb-3">
          <span className="text-3xl font-bold text-white">{value}</span>
          {total && <span className="text-gray-400 text-lg">/ {total}</span>}
          {trend && <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{trend}</span>}
        </div>

        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`${colorClasses[color]} h-3 rounded-full transition-all duration-700 shadow-sm`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  const MiniChart = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data)
    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((value, index) => (
          <div
            key={index}
            className="rounded-sm transition-all duration-300"
            style={{
              width: '8px',
              height: `${(value / max) * 100}%`,
              minHeight: '4px',
              backgroundColor: color === 'blue' ? '#3b82f6' :
                color === 'green' ? '#10b981' :
                  color === 'purple' ? '#8b5cf6' : '#3b82f6'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
            <p className="text-gray-400 text-sm">Deep insights into your productivity patterns</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-primary text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <button
            onClick={generatePDFReport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800/50 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'streaks', label: 'Streaks', icon: Flame },
          { id: 'productivity', label: 'Productivity', icon: Brain },
          { id: 'trends', label: 'Trends', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Weekly Priorities"
              subtitle="Goal completion rate"
              value={stats.prioritiesCompleted}
              total={stats.totalPriorities}
              percentage={stats.prioritiesCompletionRate}
              icon={Target}
              color="blue"
              trend="+5%"
            />

            <StatCard
              title="Habit Consistency"
              subtitle="Daily habit execution"
              value={Math.round(stats.habitConsistency)}
              percentage={stats.habitConsistency}
              icon={Zap}
              color="green"
              trend="+8%"
            />

            <StatCard
              title="Task Completion"
              subtitle="Daily task success"
              value={stats.tasksCompleted}
              total={stats.totalTasks}
              percentage={stats.tasksCompletionRate}
              icon={CheckSquare}
              color="purple"
              trend="+3%"
            />

            <StatCard
              title="Productivity Score"
              subtitle="Overall performance"
              value={productivityScore.current}
              percentage={productivityScore.current}
              icon={Star}
              color="orange"
              trend={productivityScore.trend}
            />
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Performance */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 lg:col-span-2">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Activity size={20} className="mr-2" />
                Weekly Performance
              </h3>

              <div className="space-y-4">
                {weeklyTrends.map((day, index) => (
                  <div key={day.day} className="flex items-center space-x-4">
                    <span className="text-gray-400 font-medium w-12 text-sm">{day.day}</span>

                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${day.priorities}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{day.priorities}%</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${day.habits}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{day.habits}%</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${day.tasks}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{day.tasks}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Priorities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Habits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Tasks</span>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Brain size={20} className="mr-2" />
                AI Insights
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-400 text-sm font-medium mb-1">Peak Performance</p>
                  <p className="text-gray-300 text-xs">You're most productive on Fridays. Consider scheduling important tasks then.</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm font-medium mb-1">Habit Strength</p>
                  <p className="text-gray-300 text-xs">Your morning routine is 95% consistent. This is excellent for building momentum.</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg">
                  <p className="text-orange-400 text-sm font-medium mb-1">Improvement Area</p>
                  <p className="text-gray-300 text-xs">Weekend task completion drops 25%. Try lighter weekend goals.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'streaks' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Streaks */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-6 flex items-center">
              <Flame size={20} className="mr-2" />
              Current Streaks
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Daily Streak</p>
                  <p className="text-gray-400 text-sm">Consecutive active days</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-orange-400">{streakData.currentStreak}</p>
                  <p className="text-sm text-gray-400">days</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Best Streak</p>
                  <p className="text-gray-400 text-sm">Personal record</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-yellow-400">{streakData.longestStreak}</p>
                  <p className="text-sm text-gray-400">days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Streak History */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-6 flex items-center">
              <Trophy size={20} className="mr-2" />
              Streak History
            </h3>

            <div className="space-y-3">
              {streakData.weeklyStreaks.map((streak, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-gray-400 text-sm w-16">Week {7 - index}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(streak / 7) * 100}%` }}
                    />
                  </div>
                  <span className="text-white text-sm font-medium w-8">{streak}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'productivity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productivity Breakdown */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-6 flex items-center">
              <Brain size={20} className="mr-2" />
              Productivity Breakdown
            </h3>

            <div className="space-y-4">
              {Object.entries(productivityScore.breakdown).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 capitalize">{key}</span>
                    <span className="text-white font-medium">{value}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${key === 'consistency' ? 'bg-green-500' :
                        key === 'efficiency' ? 'bg-blue-500' :
                          key === 'focus' ? 'bg-purple-500' : 'bg-orange-500'
                        }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Analysis */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-6 flex items-center">
              <Clock size={20} className="mr-2" />
              Time Analysis
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Most Productive Hour</p>
                <p className="text-2xl font-bold text-white">10:00 AM</p>
                <p className="text-green-400 text-sm">92% task completion rate</p>
              </div>

              <div className="p-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Average Session</p>
                <p className="text-2xl font-bold text-white">47 min</p>
                <p className="text-blue-400 text-sm">+12% vs last week</p>
              </div>

              <div className="p-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Focus Score</p>
                <p className="text-2xl font-bold text-white">8.3/10</p>
                <p className="text-purple-400 text-sm">Above average</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-white font-semibold mb-6 flex items-center">
            <TrendingUp size={20} className="mr-2" />
            Performance Trends
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Priorities Trend</p>
              <MiniChart data={[60, 70, 65, 80, 75, 85, 90]} color="blue" />
              <p className="text-white font-bold text-lg mt-2">+30%</p>
              <p className="text-green-400 text-xs">vs last month</p>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Habits Trend</p>
              <MiniChart data={[80, 85, 75, 90, 95, 88, 92]} color="green" />
              <p className="text-white font-bold text-lg mt-2">+15%</p>
              <p className="text-green-400 text-xs">vs last month</p>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Tasks Trend</p>
              <MiniChart data={[50, 60, 70, 65, 75, 80, 85]} color="purple" />
              <p className="text-white font-bold text-lg mt-2">+70%</p>
              <p className="text-green-400 text-xs">vs last month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}