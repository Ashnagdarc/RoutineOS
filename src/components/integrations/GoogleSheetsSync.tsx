'use client'

import { useState } from 'react'
import { Download, Upload, ExternalLink, X, Loader2, CheckCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface GoogleSheetsSyncProps {
  onSync: (sheetId: string) => Promise<void>
  isLoading: boolean
  onClose: () => void
}

export function GoogleSheetsSync({ onSync, isLoading, onClose }: GoogleSheetsSyncProps) {
  const [sheetId, setSheetId] = useState('')
  const [mode, setMode] = useState<'sync' | 'import'>('sync')
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  const handleSync = async () => {
    if (sheetId.trim()) {
      await onSync(sheetId.trim())
      setLastSyncTime(new Date())
    }
  }

  const extractSheetId = (url: string) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    return match ? match[1] : url
  }

  const handleSheetIdChange = (value: string) => {
    const id = extractSheetId(value)
    setSheetId(id)
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Download size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Google Sheets Integration</h2>
            <p className="text-gray-400 text-sm">Sync your data with Google Sheets</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Mode Selection */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setMode('sync')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === 'sync'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Export to Sheets
        </button>
        <button
          onClick={() => setMode('import')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === 'import'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Import from Sheets
        </button>
      </div>

      {/* Setup Instructions */}
      <div className="bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600">
        <h3 className="text-white font-medium mb-3">Setup Instructions:</h3>
        <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
          <li>Create a new Google Sheet or use an existing one</li>
          <li>Make sure the sheet has a tab named "Dashboard"</li>
          <li>Copy the Sheet ID from the URL or paste the full URL below</li>
          <li>Ensure the sheet is accessible by your Google account</li>
        </ol>
      </div>

      {/* Sheet ID Input */}
      <div className="mb-6">
        <label className="block text-white text-sm font-medium mb-2">
          Google Sheet URL or ID
        </label>
        <div className="space-y-2">
          <input
            type="text"
            value={sheetId}
            onChange={(e) => handleSheetIdChange(e.target.value)}
            placeholder="Paste your Google Sheets URL or ID here..."
            className="input-primary w-full"
          />
          <p className="text-gray-400 text-xs">
            Example: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={handleSync}
          disabled={!sheetId.trim() || isLoading}
          className="btn-primary flex-1 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Syncing...</span>
            </>
          ) : mode === 'sync' ? (
            <>
              <Upload size={16} />
              <span>Export to Sheet</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Import from Sheet</span>
            </>
          )}
        </button>
        
        {sheetId && (
          <a
            href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center space-x-2"
          >
            <ExternalLink size={16} />
            <span>Open Sheet</span>
          </a>
        )}
      </div>

      {/* Last Sync Status */}
      {lastSyncTime && (
        <div className="flex items-center space-x-2 text-green-400 text-sm">
          <CheckCircle size={16} />
          <span>Last synced: {lastSyncTime.toLocaleString()}</span>
        </div>
      )}

      {/* Data Format Preview */}
      <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
        <h3 className="text-white font-medium mb-3">Data Format Preview:</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-600">
                <th className="text-left py-2 px-3">Type</th>
                <th className="text-left py-2 px-3">Name</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Day/Date</th>
                <th className="text-left py-2 px-3">Created</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3">Priority</td>
                <td className="py-2 px-3">Complete project proposal</td>
                <td className="py-2 px-3">Completed</td>
                <td className="py-2 px-3">5/22/2024</td>
                <td className="py-2 px-3">5/20/2024</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3">Habit</td>
                <td className="py-2 px-3">Morning exercise</td>
                <td className="py-2 px-3">5/7</td>
                <td className="py-2 px-3">Weekly</td>
                <td className="py-2 px-3">N/A</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Daily Task</td>
                <td className="py-2 px-3">Review emails</td>
                <td className="py-2 px-3">Pending</td>
                <td className="py-2 px-3">Monday</td>
                <td className="py-2 px-3">5/20/2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}