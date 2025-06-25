/**
 * Domain Configuration Utility
 * Manages different environments and custom domain settings
 */

export interface DomainConfig {
    domain: string
    protocol: 'http' | 'https'
    port?: number
    environment: 'development' | 'staging' | 'production'
}

// Environment-based domain configuration
export const getDomainConfig = (): DomainConfig => {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isStaging = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'staging'

    // Custom domain from environment variable
    const customDomain = process.env.NEXT_PUBLIC_DOMAIN

    if (isDevelopment) {
        return {
            domain: 'localhost',
            protocol: 'http',
            port: 3000,
            environment: 'development'
        }
    }

    if (isStaging) {
        return {
            domain: process.env.VERCEL_URL || 'staging.routineos.vercel.app',
            protocol: 'https',
            environment: 'staging'
        }
    }

    // Production
    return {
        domain: customDomain || 'routineos.vercel.app',
        protocol: 'https',
        environment: 'production'
    }
}

// Get the full base URL
export const getBaseUrl = (): string => {
    const config = getDomainConfig()
    const port = config.port ? `:${config.port}` : ''
    return `${config.protocol}://${config.domain}${port}`
}

// Get the API base URL
export const getApiUrl = (path: string = ''): string => {
    const baseUrl = getBaseUrl()
    return `${baseUrl}/api${path}`
}

// Domain validation for custom domains
export const isValidDomain = (domain: string): boolean => {
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
    return domainRegex.test(domain)
}

// Get NextAuth URL with proper domain
export const getNextAuthUrl = (): string => {
    // Use NEXTAUTH_URL if explicitly set
    if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL
    }

    // Otherwise use our domain configuration
    return getBaseUrl()
}

// Canonical URL for SEO
export const getCanonicalUrl = (path: string = ''): string => {
    const baseUrl = getBaseUrl()
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${cleanPath}`
}

// Check if we're on a custom domain
export const isCustomDomain = (): boolean => {
    const config = getDomainConfig()
    return config.environment === 'production' &&
        !config.domain.includes('vercel.app') &&
        !config.domain.includes('localhost')
}

// Domain-specific meta tags
export const getDomainMetaTags = () => {
    const config = getDomainConfig()
    const baseUrl = getBaseUrl()

    return {
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: baseUrl,
        },
        robots: config.environment === 'production' ? 'index,follow' : 'noindex,nofollow',
        verification: {
            // Add your domain verification codes here when you get custom domains
            google: process.env.GOOGLE_SITE_VERIFICATION,
            yandex: process.env.YANDEX_VERIFICATION,
            yahoo: process.env.YAHOO_VERIFICATION,
        }
    }
} 