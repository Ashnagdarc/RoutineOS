'use client'

import { useState, useEffect } from 'react'
import { Home, BarChart3, Brain, Settings, Plus, Zap } from 'lucide-react'

interface MobileNavigationProps {
    activeTab: string
    onTabChange: (tab: string) => void
    onQuickAdd?: () => void
}

export function MobileNavigation({ activeTab, onTabChange, onQuickAdd }: MobileNavigationProps) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    if (!isMobile) return null

    const navItems = [
        {
            id: 'home',
            label: 'Home',
            icon: Home,
            color: 'text-blue-400'
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart3,
            color: 'text-orange-400'
        },
        {
            id: 'add',
            label: 'Add',
            icon: Plus,
            color: 'text-green-400',
            isAction: true
        },
        {
            id: 'smart',
            label: 'AI',
            icon: Brain,
            color: 'text-purple-400'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            color: 'text-gray-400'
        }
    ]

    const handleItemPress = (item: typeof navItems[0]) => {
        if (item.isAction && onQuickAdd) {
            onQuickAdd()
        } else {
            onTabChange(item.id)
        }
    }

    return (
        <nav className="mobile-nav">
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                    <button
                        key={item.id}
                        onClick={() => handleItemPress(item)}
                        className={`mobile-nav-item touch-feedback ${isActive ? 'active' : ''
                            } ${item.isAction ? 'scale-110' : ''}`}
                        aria-label={item.label}
                    >
                        <div className={`relative ${item.isAction ? 'bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full shadow-lg' : ''}`}>
                            <Icon
                                size={item.isAction ? 20 : 18}
                                className={`${isActive && !item.isAction ? item.color :
                                    item.isAction ? 'text-white' :
                                        'text-gray-400'
                                    }`}
                            />
                            {item.isAction && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            )}
                        </div>
                        <span className={`text-xs mt-1 ${isActive && !item.isAction ? item.color :
                            item.isAction ? 'text-green-400' :
                                'text-gray-500'
                            }`}>
                            {item.label}
                        </span>
                    </button>
                )
            })}
        </nav>
    )
}

// Quick Add Fab for mobile
interface QuickAddFabProps {
    onAddHabit: () => void
    onAddPriority: () => void
    onAddTask: () => void
}

export function QuickAddFab({ onAddHabit, onAddPriority, onAddTask }: QuickAddFabProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    if (!isMobile) return null

    const options = [
        {
            label: 'Add Habit',
            icon: Zap,
            color: 'bg-green-500',
            action: onAddHabit
        },
        {
            label: 'Add Priority',
            icon: BarChart3,
            color: 'bg-blue-500',
            action: onAddPriority
        },
        {
            label: 'Add Task',
            icon: Plus,
            color: 'bg-purple-500',
            action: onAddTask
        }
    ]

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Main FAB */}
            <div className="fixed bottom-20 right-4 z-50 md:hidden">
                {/* Quick options */}
                {isOpen && (
                    <div className="absolute bottom-16 right-0 space-y-3 animate-slide-up-mobile">
                        {options.map((option, index) => {
                            const Icon = option.icon
                            return (
                                <button
                                    key={option.label}
                                    onClick={() => {
                                        option.action()
                                        setIsOpen(false)
                                    }}
                                    className={`flex items-center space-x-3 ${option.color} text-white px-4 py-3 rounded-full shadow-lg touch-feedback min-w-max`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm font-medium">{option.label}</span>
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Main button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl touch-feedback flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-45' : ''
                        }`}
                >
                    <Plus size={24} className={isOpen ? 'transform rotate-45' : ''} />
                </button>
            </div>
        </>
    )
} 