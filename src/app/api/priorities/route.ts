import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPriorities, createPriority, getUserByEmail } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user
        const userResult = await getUserByEmail(session.user.email)
        if (!userResult.success || !userResult.data) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const prioritiesResult = await getPriorities(userResult.data.id)

        if (!prioritiesResult.success) {
            return NextResponse.json({ error: 'Failed to fetch priorities' }, { status: 500 })
        }

        return NextResponse.json({ priorities: prioritiesResult.data || [] })
    } catch (error) {
        console.error('Error in GET /api/priorities:', error)
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
        const { text, priority, estimatedTime, category, dueDate, tags } = body

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 })
        }

        // Get user
        const userResult = await getUserByEmail(session.user.email)
        if (!userResult.success || !userResult.data) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const priorityResult = await createPriority(userResult.data.id, {
            text,
            priority: priority || 'medium',
            estimatedTime,
            category,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            tags: tags || [],
        })

        if (!priorityResult.success) {
            return NextResponse.json({ error: 'Failed to create priority' }, { status: 500 })
        }

        return NextResponse.json({ priority: priorityResult.data }, { status: 201 })
    } catch (error) {
        console.error('Error in POST /api/priorities:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 