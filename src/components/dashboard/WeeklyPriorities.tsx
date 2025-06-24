'use client'

import { useState } from 'react'
import { Plus, X, Target } from 'lucide-react'
import { Priority } from '@/types'

interface WeeklyPrioritiesProps {
  priorities: Priority[]
  onAdd: (text: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function WeeklyPriorities({ priorities, onAdd, onToggle, onDelete }: WeeklyPrioritiesProps) {
  const [newPriority, setNewPriority] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPriority.trim()) {
      onAdd(newPriority.trim())
      setNewPriority('')
      setIsAdding(false)
    }
  }

  const completedCount = priorities.filter(p => p.completed).length
  const completionRate = priorities.length > 0 ? (completedCount / priorities.length) * 100 : 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Weekly Priorities</h2>
            <p className="text-gray-400 text-sm">
              {completedCount} of {priorities.length} completed ({Math.round(completionRate)}%)
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Priority</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Add Priority Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 animate-slide-up">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              placeholder="Add a new priority..."
              className="input-primary flex-1"
              autoFocus
            />
            <button type="submit" className="btn-primary">
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setNewPriority('')
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Priorities List */}
      <div className="space-y-3">
        {priorities.map((priority) => (
          <div
            key={priority.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
              priority.completed
                ? 'bg-green-900/20 border-green-700/30'
                : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
            }`}
          >
            <button
              onClick={() => onToggle(priority.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                priority.completed
                  ? 'bg-green-600 border-green-600'
                  : 'border-gray-500 hover:border-blue-500'
              }`}
            >
              {priority.completed && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <span
              className={`flex-1 ${
                priority.completed
                  ? 'text-gray-400 line-through'
                  : 'text-white'
              }`}
            >
              {priority.text}
            </span>
            <button
              onClick={() => onDelete(priority.id)}
              className="text-gray-500 hover:text-red-400 transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        
        {priorities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Target size={48} className="mx-auto mb-4 opacity-50" />
            <p>No priorities yet. Add your first priority to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}