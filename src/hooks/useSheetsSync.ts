import { useState } from 'react'
import { useToast } from '@/components/providers/ToastProvider'

export function useSheetsSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const { showToast } = useToast()

  const syncToSheets = async (data: any, sheetId: string) => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, sheetId }),
      })

      if (!response.ok) {
        throw new Error('Failed to sync to Google Sheets')
      }

      showToast('Successfully synced to Google Sheets!', 'success')
    } catch (error) {
      console.error('Sync error:', error)
      showToast('Failed to sync to Google Sheets', 'error')
    } finally {
      setIsSyncing(false)
    }
  }

  const fetchFromSheets = async (sheetId: string) => {
    try {
      const response = await fetch(`/api/sheets/sync?sheetId=${sheetId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch from Google Sheets')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Fetch error:', error)
      showToast('Failed to fetch from Google Sheets', 'error')
      return null
    }
  }

  return {
    syncToSheets,
    fetchFromSheets,
    isSyncing,
  }
}