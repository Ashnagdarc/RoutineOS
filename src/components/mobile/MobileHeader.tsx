'use client'

import { useState, useEffect } from 'react'
import { Menu, X, User, Bell, Search } from 'lucide-react'
import Image from 'next/image'

interface MobileHeaderProps {
    title: string
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
    onMenuToggle?: () => void
    onProfilePress?: () => void
    showNotifications?: boolean
    notificationCount?: number
}

export function MobileHeader({
    title,
    user,
    onMenuToggle,
    onProfilePress,
    showNotifications = true,
    notificationCount = 0
}: MobileHeaderProps) {
    const [isMobile, setIsMobile] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen)
        onMenuToggle?.()
    }

    if (!isMobile) return null

    return (
        <>
            <header className="safe-top bg-gray-800/95 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-40">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Left side - Menu */}
                    <button
                        onClick={handleMenuToggle}
                        className="mobile-nav-item p-2 -ml-2"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {/* Center - Title */}
                    <div className="flex-1 text-center">
                        <h1 className="text-lg font-bold text-white truncate px-4">
                            {title}
                        </h1>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center space-x-2">
                        {/* Notifications */}
                        {showNotifications && (
                            <button
                                className="mobile-nav-item p-2 relative"
                                aria-label="Notifications"
                            >
                                <Bell size={18} />
                                {notificationCount > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                        {notificationCount > 9 ? '9+' : notificationCount}
                                    </div>
                                )}
                            </button>
                        )}

                        {/* Profile */}
                        <button
                            onClick={onProfilePress}
                            className="mobile-nav-item p-1"
                            aria-label="Profile"
                        >
                            {user?.image ? (
                                <Image
                                    src={user.image}
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full border-2 border-gray-600"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center border-2 border-gray-500">
                                    <User size={16} className="text-gray-300" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search bar (appears when menu is open) */}
                {isMenuOpen && (
                    <div className="px-4 pb-3 animate-slide-down-mobile">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search habits, tasks, priorities..."
                                className="input-primary w-full pl-10 pr-4 py-3"
                            />
                        </div>
                    </div>
                )}
            </header>

            {/* Overlay for menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </>
    )
}

// Mobile Quick Stats Bar
interface MobileStatsBarProps {
    stats: {
        habits: number
        priorities: number
        tasks: number
        streak: number
    }
}

export function MobileStatsBar({ stats }: MobileStatsBarProps) {
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

    const statItems = [
        {
            label: 'Habits',
            value: stats.habits,
            color: 'text-green-400',
            bgColor: 'bg-green-600/20'
        },
        {
            label: 'Goals',
            value: stats.priorities,
            color: 'text-blue-400',
            bgColor: 'bg-blue-600/20'
        },
        {
            label: 'Tasks',
            value: stats.tasks,
            color: 'text-purple-400',
            bgColor: 'bg-purple-600/20'
        },
        {
            label: 'Streak',
            value: stats.streak,
            color: 'text-orange-400',
            bgColor: 'bg-orange-600/20'
        }
    ]

    return (
        <div className="px-4 py-3 bg-gray-800/30 border-b border-gray-700/50">
            <div className="grid grid-cols-4 gap-2">
                {statItems.map((item) => (
                    <div key={item.label} className={`text-center p-3 rounded-lg ${item.bgColor}`}>
                        <div className={`text-lg font-bold ${item.color}`}>
                            {item.value}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 