'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Calendar, Download, Target, Zap, CheckSquare } from 'lucide-react'
import { WeeklyStats } from '@/types'

interface ProgressReportProps {
  stats: WeeklyStats
}

export function ProgressReport({ stats }: ProgressReportProps) {
  const [timeRange, setTimeRange] = useState('week')

  const generatePDFReport = () => {
    // This would implement PDF generation with jspdf
    console.log('Generating PDF report...')
  }

  const StatCard = ({ 
    title, 
    value, 
    total, 
    percentage, 
    icon: Icon, 
    color = 'blue' 
  }: {
    title: string
    value: number
    total?: number
    percentage: number
    icon: any
    color?: string
  }) => {
    const colorClasses = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      purple: 'bg-purple-600',
      orange: 'bg-orange-600'
    }

    const bgColorClasses = {
      blue: 'bg-blue-600/20',
      green: 'bg-green-600/20',
      purple: 'bg-purple-600/20',
      orange: 'bg-orange-600/20'
    }

    return (
      <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
            <Icon size={20} className="text-white" />
          </div>
          <div className={`px-3 py-1 ${bgColorClasses[color]} rounded-full`}>
            <span className="text-sm font-medium text-white">{Math.round(percentage)}%</span>
          </div>
        </div>
        
        <h3 className="text-white font-medium mb-2">{title}</h3>
        <div className="flex items-baseline space-x-2 mb-3">
          <span className="text-2xl font-bold text-white">{value}</span>
          {total && <span className="text-gray-400">/ {total}</span>}
        </div>
        
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className={`${colorClasses[color]} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Progress Report</h2>
            <p className="text-gray-400 text-sm">Weekly performance overview</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-primary"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          
          <button
            onClick={generatePDFReport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Weekly Priorities"
          value={stats.prioritiesCompleted}
          total={stats.totalPriorities}
          percentage={stats.prioritiesCompletionRate}
          icon={Target}
          color="blue"
        />
        
        <StatCard
          title="Habit Consistency"
          value={Math.round(stats.habitConsistency)}
          percentage={stats.habitConsistency}
          icon={Zap}
          color="green"
        />
        
        <StatCard
          title="Daily Tasks"
          value={stats.tasksCompleted}
          total={stats.totalTasks}
          percentage={stats.tasksCompletionRate}
          icon={CheckSquare}
          color="purple"
        />
        
        <StatCard
          title="Overall Score"
          value={Math.round(stats.overallScore)}
          percentage={stats.overallScore}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <TrendingUp size={18} className="mr-2" />
            Weekly Trends
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Priorities Completion</span>
                <span className="text-white">{Math.round(stats.prioritiesCompletionRate)}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.prioritiesCompletionRate}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Habit Consistency</span>
                <span className="text-white">{Math.round(stats.habitConsistency)}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.habitConsistency}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Task Completion</span>
                <span className="text-white">{Math.round(stats.tasksCompletionRate)}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.tasksCompletionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <Calendar size={18} className="mr-2" />
            Insights & Tips
          </h3>
          
          <div className="space-y-3">
            {stats.prioritiesCompletionRate < 50 && (
              <div className="p-3 bg-yellow-600/20 border border-yellow-600/30 rounded">
                <p className="text-yellow-400 text-sm">
                  📝 Consider reducing your weekly priorities to focus on quality over quantity.
                </p>
              </div>
            )}
            
            {stats.habitConsistency > 80 && (
              <div className="p-3 bg-green-600/20 border border-green-600/30 rounded">
                <p className="text-green-400 text-sm">
                  🔥 Excellent habit consistency! You're building strong routines.
                </p>
              </div>
            )}
            
            {stats.tasksCompletionRate < 70 && (
              <div className="p-3 bg-blue-600/20 border border-blue-600/30 rounded">
                <p className="text-blue-400 text-sm">
                  ⚡ Try breaking down larger tasks into smaller, more manageable pieces.
                </p>
              </div>
            )}
            
            {stats.overallScore > 75 && (
              <div className="p-3 bg-purple-600/20 border border-purple-600/30 rounded">
                <p className="text-purple-400 text-sm">
                  🎉 Outstanding week! Keep up the momentum and consider setting stretch goals.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}