'use client'

import { useState, useRef, useEffect } from 'react'
import { Trash2, Check, Edit, Archive } from 'lucide-react'

interface SwipeAction {
    id: string
    label: string
    icon: any
    color: string
    bgColor: string
    action: () => void
}

interface SwipeableCardProps {
    children: React.ReactNode
    leftActions?: SwipeAction[]
    rightActions?: SwipeAction[]
    disabled?: boolean
    className?: string
}

export function SwipeableCard({
    children,
    leftActions = [],
    rightActions = [],
    disabled = false,
    className = ''
}: SwipeableCardProps) {
    const [translateX, setTranslateX] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [actionTriggered, setActionTriggered] = useState<string | null>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const startX = useRef(0)
    const currentX = useRef(0)

    const SWIPE_THRESHOLD = 80
    const ACTION_THRESHOLD = 120

    const handleTouchStart = (e: React.TouchEvent) => {
        if (disabled) return

        setIsDragging(true)
        startX.current = e.touches[0].clientX
        currentX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || disabled) return

        currentX.current = e.touches[0].clientX
        const deltaX = currentX.current - startX.current

        // Limit swipe distance
        const maxSwipe = 150
        const clampedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX))

        setTranslateX(clampedDelta)

        // Check for action triggers
        if (Math.abs(clampedDelta) > ACTION_THRESHOLD) {
            const actions = clampedDelta > 0 ? leftActions : rightActions
            if (actions.length > 0) {
                const actionIndex = Math.min(Math.floor(Math.abs(clampedDelta) / ACTION_THRESHOLD) - 1, actions.length - 1)
                setActionTriggered(actions[actionIndex]?.id || null)
            }
        } else {
            setActionTriggered(null)
        }
    }

    const handleTouchEnd = () => {
        if (!isDragging || disabled) return

        setIsDragging(false)

        // Trigger action if threshold is met
        if (Math.abs(translateX) > ACTION_THRESHOLD) {
            const actions = translateX > 0 ? leftActions : rightActions
            if (actions.length > 0 && actionTriggered) {
                const action = actions.find(a => a.id === actionTriggered)
                if (action) {
                    action.action()
                }
            }
        }

        // Reset position
        setTranslateX(0)
        setActionTriggered(null)
    }

    // Mouse events for desktop testing
    const handleMouseDown = (e: React.MouseEvent) => {
        if (disabled) return

        setIsDragging(true)
        startX.current = e.clientX
        currentX.current = e.clientX
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || disabled) return

        currentX.current = e.clientX
        const deltaX = currentX.current - startX.current

        const maxSwipe = 150
        const clampedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX))

        setTranslateX(clampedDelta)
    }

    const handleMouseUp = () => {
        if (!isDragging || disabled) return

        setIsDragging(false)
        setTranslateX(0)
        setActionTriggered(null)
    }

    const renderActions = (actions: SwipeAction[], side: 'left' | 'right') => {
        if (actions.length === 0) return null

        const isVisible = side === 'left' ? translateX > SWIPE_THRESHOLD : translateX < -SWIPE_THRESHOLD

        return (
            <div
                className={`absolute top-0 ${side === 'left' ? 'left-0' : 'right-0'} h-full flex items-center transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {actions.map((action) => {
                    const Icon = action.icon
                    const isActive = actionTriggered === action.id

                    return (
                        <div
                            key={action.id}
                            className={`h-full flex items-center justify-center px-4 ${action.bgColor} ${isActive ? 'scale-110' : ''
                                } transition-transform duration-200`}
                        >
                            <div className="flex flex-col items-center space-y-1">
                                <Icon size={20} className={action.color} />
                                <span className={`text-xs ${action.color} font-medium`}>
                                    {action.label}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className={`relative overflow-hidden rounded-lg ${className}`}>
            {/* Left actions */}
            {renderActions(leftActions, 'left')}

            {/* Right actions */}
            {renderActions(rightActions, 'right')}

            {/* Main content */}
            <div
                ref={cardRef}
                className={`relative z-10 transition-transform duration-200 ${isDragging ? 'transition-none' : ''
                    } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing'}`}
                style={{
                    transform: `translateX(${translateX}px)`,
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {children}
            </div>

            {/* Swipe hint indicator */}
            {!disabled && (leftActions.length > 0 || rightActions.length > 0) && (
                <div className="absolute top-2 right-2 text-gray-500 opacity-30">
                    <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Pre-configured swipeable cards for common use cases
interface SwipeableHabitCardProps {
    children: React.ReactNode
    onComplete?: () => void
    onEdit?: () => void
    onDelete?: () => void
    completed?: boolean
    className?: string
}

export function SwipeableHabitCard({
    children,
    onComplete,
    onEdit,
    onDelete,
    completed = false,
    className = ''
}: SwipeableHabitCardProps) {
    const leftActions: SwipeAction[] = onComplete ? [
        {
            id: 'complete',
            label: completed ? 'Undo' : 'Complete',
            icon: Check,
            color: 'text-white',
            bgColor: completed ? 'bg-orange-500' : 'bg-green-500',
            action: onComplete
        }
    ] : []

    const rightActions: SwipeAction[] = [
        ...(onEdit ? [{
            id: 'edit',
            label: 'Edit',
            icon: Edit,
            color: 'text-white',
            bgColor: 'bg-blue-500',
            action: onEdit
        }] : []),
        ...(onDelete ? [{
            id: 'delete',
            label: 'Delete',
            icon: Trash2,
            color: 'text-white',
            bgColor: 'bg-red-500',
            action: onDelete
        }] : [])
    ]

    return (
        <SwipeableCard
            leftActions={leftActions}
            rightActions={rightActions}
            className={className}
        >
            {children}
        </SwipeableCard>
    )
}

interface SwipeableTaskCardProps {
    children: React.ReactNode
    onComplete?: () => void
    onArchive?: () => void
    onDelete?: () => void
    completed?: boolean
    className?: string
}

export function SwipeableTaskCard({
    children,
    onComplete,
    onArchive,
    onDelete,
    completed = false,
    className = ''
}: SwipeableTaskCardProps) {
    const leftActions: SwipeAction[] = onComplete ? [
        {
            id: 'complete',
            label: completed ? 'Undo' : 'Done',
            icon: Check,
            color: 'text-white',
            bgColor: completed ? 'bg-orange-500' : 'bg-green-500',
            action: onComplete
        }
    ] : []

    const rightActions: SwipeAction[] = [
        ...(onArchive ? [{
            id: 'archive',
            label: 'Archive',
            icon: Archive,
            color: 'text-white',
            bgColor: 'bg-gray-500',
            action: onArchive
        }] : []),
        ...(onDelete ? [{
            id: 'delete',
            label: 'Delete',
            icon: Trash2,
            color: 'text-white',
            bgColor: 'bg-red-500',
            action: onDelete
        }] : [])
    ]

    return (
        <SwipeableCard
            leftActions={leftActions}
            rightActions={rightActions}
            className={className}
        >
            {children}
        </SwipeableCard>
    )
} 