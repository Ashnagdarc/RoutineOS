import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getHabits, createHabit, getUserByEmail, createUser } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get or create user
        let userResult = await getUserByEmail(session.user.email)
        if (!userResult.success || !userResult.data) {
            // Create user if doesn't exist
            const createResult = await createUser({
                email: session.user.email,
                name: session.user.name || undefined,
                image: session.user.image || undefined,
            })
            if (!createResult.success || !createResult.data) {
                return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
            }
            userResult = { success: true, data: createResult.data }
        }

        const habitsResult = await getHabits(userResult.data.id)

        if (!habitsResult.success) {
            return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 })
        }

        return NextResponse.json({ habits: habitsResult.data || [] })
    } catch (error) {
        console.error('Error in GET /api/habits:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, category, difficulty, estimatedTime, completedDays } = body

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        // Get user
        const userResult = await getUserByEmail(session.user.email)
        if (!userResult.success || !userResult.data) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const habitResult = await createHabit(userResult.data.id, {
            name,
            category,
            difficulty: difficulty || 'medium',
            estimatedTime: estimatedTime || 15,
            completedDays: completedDays || {
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
            },
        })

        if (!habitResult.success) {
            return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 })
        }

        return NextResponse.json({ habit: habitResult.data }, { status: 201 })
    } catch (error) {
        console.error('Error in POST /api/habits:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 