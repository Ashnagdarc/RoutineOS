import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { google } from 'googleapis'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, sheetId } = await request.json()

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    auth.setCredentials({
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
    })

    const sheets = google.sheets({ version: 'v4', auth })

    // Clear existing data
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: 'Dashboard!A1:Z1000',
    })

    // Prepare data for sheets
    const values = [
      ['Type', 'Name', 'Status', 'Day/Date', 'Created'],
      ...data.priorities.map((p: any) => [
        'Priority',
        p.text,
        p.completed ? 'Completed' : 'Pending',
        new Date(p.createdAt).toLocaleDateString(),
        new Date(p.createdAt).toLocaleDateString(),
      ]),
      ...data.habits.map((h: any) => [
        'Habit',
        h.name,
        Object.values(h.completedDays).filter(Boolean).length + '/7',
        'Weekly',
        'N/A',
      ]),
      ...data.dailyTasks.map((t: any) => [
        'Daily Task',
        t.text,
        t.completed ? 'Completed' : 'Pending',
        t.day,
        new Date(t.createdAt).toLocaleDateString(),
      ]),
    ]

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Dashboard!A1',
      valueInputOption: 'RAW',
      requestBody: { values },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sheets sync error:', error)
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sheetId = searchParams.get('sheetId')

    if (!sheetId) {
      return NextResponse.json({ error: 'Sheet ID required' }, { status: 400 })
    }

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    auth.setCredentials({
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Dashboard!A1:E1000',
    })

    return NextResponse.json({ data: response.data.values || [] })
  } catch (error) {
    console.error('Sheets fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}