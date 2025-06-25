import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { updatePriority, deletePriority, getUserByEmail } from '@/lib/db/queries'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Convert dueDate string to Date if provided
        if (body.dueDate) {
            body.dueDate = new Date(body.dueDate)
        }

        // Get user
        const userResult = await getUserByEmail(session.user.email)
        if (!userResult.success || !userResult.data) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const priorityResult = await updatePriority(params.id, userResult.data.id, body)

        if (!priorityResult.success) {
            return NextResponse.json({ error: 'Failed to update priority' }, { status: 500 })
        }

        return NextResponse.json({ priority: priorityResult.data })
    } catch (error) {
        console.error('Error in PUT /api/priorities/[id]:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

        const deleteResult = await deletePriority(params.id, userResult.data.id)

        if (!deleteResult.success) {
            return NextResponse.json({ error: 'Failed to delete priority' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in DELETE /api/priorities/[id]:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 