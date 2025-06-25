import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle> | null = null

function getDatabase() {
    if (!_db) {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable is required')
        }

        // Create Neon connection
        const sql = neon(process.env.DATABASE_URL)

        // Create Drizzle instance with schema
        _db = drizzle(sql, { schema })
    }

    return _db
}

// Export getter function instead of instance
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
    get(target, prop) {
        return getDatabase()[prop as keyof ReturnType<typeof drizzle>]
    }
})

// Export schema for use in other files
export * from './schema'

// Database health check
export async function checkDatabaseConnection() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable is required')
        }

        const sql = neon(process.env.DATABASE_URL)
        const result = await sql`SELECT 1 as test`
        return { success: true, message: 'Database connection successful' }
    } catch (error) {
        console.error('Database connection failed:', error)
        return { success: false, message: 'Database connection failed', error }
    }
} 