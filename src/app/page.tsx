'use client'

import { useSession } from 'next-auth/react'
import { Dashboard } from '@/components/Dashboard'
import { LoginPage } from '@/components/auth/LoginPage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session) {
    return <LoginPage />
  }

  return <Dashboard />
}