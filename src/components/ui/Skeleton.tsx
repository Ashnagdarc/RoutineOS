interface SkeletonProps {
    className?: string
    variant?: 'text' | 'rectangular' | 'circular'
    width?: string | number
    height?: string | number
    lines?: number
}

export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
    lines = 1
}: SkeletonProps) {
    if (variant === 'text' && lines > 1) {
        return (
            <div className={`space-y-2 ${className}`}>
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse bg-gray-700 rounded h-4"
                        style={{
                            width: index === lines - 1 ? '70%' : '100%',
                            height: height || '1rem'
                        }}
                    />
                ))}
            </div>
        )
    }

    const baseClasses = 'animate-pulse bg-gray-700'

    const variantClasses = {
        text: 'rounded h-4',
        rectangular: 'rounded-lg',
        circular: 'rounded-full'
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{ width, height }}
        />
    )
}

// Pre-built skeleton components for common use cases
export function SkeletonCard() {
    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-4">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1">
                    <Skeleton variant="text" width="60%" height={16} />
                    <Skeleton variant="text" width="40%" height={12} className="mt-2" />
                </div>
            </div>
            <Skeleton variant="text" lines={3} />
        </div>
    )
}

export function SkeletonStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton variant="circular" width={48} height={48} />
                        <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
                    </div>
                    <Skeleton variant="text" width="80%" height={16} />
                    <Skeleton variant="text" width="60%" height={32} className="mt-2" />
                    <Skeleton variant="rectangular" width="100%" height={12} className="mt-4 rounded-full" />
                </div>
            ))}
        </div>
    )
}

export function SkeletonTable() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg">
                    <Skeleton variant="circular" width={32} height={32} />
                    <div className="flex-1">
                        <Skeleton variant="text" width="70%" height={16} />
                        <Skeleton variant="text" width="50%" height={12} className="mt-1" />
                    </div>
                    <Skeleton variant="rectangular" width={80} height={32} className="rounded" />
                </div>
            ))}
        </div>
    )
} 