'use client'

import { useState } from 'react'
import { Plus, X, CheckSquare, Calendar } from 'lucide-react'
import { DailyTask } from '@/types'

interface DailyTasksProps {
  tasks: DailyTask[]
  onAdd: (day: string, text: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
]

export function DailyTasks({ tasks, onAdd, onToggle, onDelete }: DailyTasksProps) {
  const [newTask, setNewTask] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.trim() && selectedDay) {
      onAdd(selectedDay, newTask.trim())
      setNewTask('')
      setSelectedDay('')
      setIsAdding(false)
    }
  }

  const getTasksByDay = (day: string) => {
    return tasks.filter(task => task.day === day)
  }

  const getTotalStats = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 }
  }

  const stats = getTotalStats()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <CheckSquare size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Daily Tasks</h2>
            <p className="text-gray-400 text-sm">
              {stats.completed} of {stats.total} completed ({Math.round(stats.percentage)}%)
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 animate-slide-up">
          <div className="space-y-3">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="input-primary w-full"
              required
            >
              <option value="">Select a day...</option>
              {DAYS.map(day => (
                <option key={day.key} value={day.key}>
                  {day.label}
                </option>
              ))}
            </select>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="input-primary flex-1"
                required
              />
              <button type="submit" className="btn-primary">
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setNewTask('')
                  setSelectedDay('')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tasks by Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {DAYS.map(day => {
          const dayTasks = getTasksByDay(day.key)
          const completedTasks = dayTasks.filter(task => task.completed).length
          const completionRate = dayTasks.length > 0 ? (completedTasks / dayTasks.length) * 100 : 0
          
          return (
            <div key={day.key} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">{day.label}</h3>
                <span className="text-xs text-gray-400">
                  {completedTasks}/{dayTasks.length}
                </span>
              </div>
              
              {dayTasks.length > 0 && (
                <div className="mb-3">
                  <div className="w-full bg-gray-600 rounded-full h-1.5">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center space-x-2 p-2 rounded transition-all duration-200 ${
                      task.completed
                        ? 'bg-green-900/20 border border-green-700/30'
                        : 'bg-gray-600/30 hover:bg-gray-600/50'
                    }`}
                  >
                    <button
                      onClick={() => onToggle(task.id)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        task.completed
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-500 hover:border-purple-500'
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        task.completed
                          ? 'text-gray-400 line-through'
                          : 'text-white'
                      }`}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {dayTasks.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No tasks for {day.label.toLowerCase()}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}