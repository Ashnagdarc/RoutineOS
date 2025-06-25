'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback
                return <FallbackComponent error={this.state.error} resetError={this.resetError} />
            }

            return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
        }

        return this.props.children
    }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
    return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} className="text-red-400" />
                </div>

                <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                <p className="text-gray-400 mb-4">
                    {error?.message || 'An unexpected error occurred while rendering this component.'}
                </p>

                <button
                    onClick={resetError}
                    className="btn-primary flex items-center space-x-2 mx-auto"
                >
                    <RefreshCw size={16} />
                    <span>Try Again</span>
                </button>

                {process.env.NODE_ENV === 'development' && error && (
                    <details className="mt-4 text-left">
                        <summary className="text-sm text-gray-500 cursor-pointer">Error Details</summary>
                        <pre className="mt-2 text-xs text-gray-600 bg-gray-800 p-2 rounded overflow-auto">
                            {error.stack}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    )
} 