import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { updateHabit, deleteHabit, getUserByEmail } from '@/lib/db/queries'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Get user
        const userResult = await getUserByEmail(session.user.email)
        if (!userResult.success || !userResult.data) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const habitResult = await updateHabit(params.id, userResult.data.id, body)

        if (!habitResult.success) {
            return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 })
        }

        return NextResponse.json({ habit: habitResult.data })
    } catch (error) {
        console.error('Error in PUT /api/habits/[id]:', error)
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

        const deleteResult = await deleteHabit(params.id, userResult.data.id)

        if (!deleteResult.success) {
            return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in DELETE /api/habits/[id]:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 