import { db } from './index'
import { habits, priorities, dailyTasks, smartInsights, users } from './schema'
import { eq, and, desc, asc } from 'drizzle-orm'
import type { Habit, Priority, DailyTask, SmartInsight, NewHabit, NewPriority, NewDailyTask, NewSmartInsight } from './schema'

// User operations
export async function createUser(userData: { email: string; name?: string; image?: string }) {
    try {
        const [user] = await db.insert(users).values(userData).returning()
        return { success: true, data: user }
    } catch (error) {
        console.error('Error creating user:', error)
        return { success: false, error }
    }
}

export async function getUserByEmail(email: string) {
    try {
        const [user] = await db.select().from(users).where(eq(users.email, email))
        return { success: true, data: user }
    } catch (error) {
        console.error('Error getting user by email:', error)
        return { success: false, error }
    }
}

// Habit operations
export async function getHabits(userId: string): Promise<{ success: boolean; data?: Habit[]; error?: any }> {
    try {
        const userHabits = await db
            .select()
            .from(habits)
            .where(eq(habits.userId, userId))
            .orderBy(desc(habits.createdAt))

        return { success: true, data: userHabits }
    } catch (error) {
        console.error('Error fetching habits:', error)
        return { success: false, error }
    }
}

export async function createHabit(userId: string, habitData: Omit<NewHabit, 'userId'>): Promise<{ success: boolean; data?: Habit; error?: any }> {
    try {
        const [newHabit] = await db
            .insert(habits)
            .values({ ...habitData, userId })
            .returning()

        return { success: true, data: newHabit }
    } catch (error) {
        console.error('Error creating habit:', error)
        return { success: false, error }
    }
}

export async function updateHabit(habitId: string, userId: string, updates: Partial<Omit<Habit, 'id' | 'userId' | 'createdAt'>>): Promise<{ success: boolean; data?: Habit; error?: any }> {
    try {
        const [updatedHabit] = await db
            .update(habits)
            .set({ ...updates, updatedAt: new Date() })
            .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
            .returning()

        return { success: true, data: updatedHabit }
    } catch (error) {
        console.error('Error updating habit:', error)
        return { success: false, error }
    }
}

export async function deleteHabit(habitId: string, userId: string): Promise<{ success: boolean; error?: any }> {
    try {
        await db
            .delete(habits)
            .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))

        return { success: true }
    } catch (error) {
        console.error('Error deleting habit:', error)
        return { success: false, error }
    }
}

// Priority operations
export async function getPriorities(userId: string): Promise<{ success: boolean; data?: Priority[]; error?: any }> {
    try {
        const userPriorities = await db
            .select()
            .from(priorities)
            .where(eq(priorities.userId, userId))
            .orderBy(desc(priorities.createdAt))

        return { success: true, data: userPriorities }
    } catch (error) {
        console.error('Error fetching priorities:', error)
        return { success: false, error }
    }
}

export async function createPriority(userId: string, priorityData: Omit<NewPriority, 'userId'>): Promise<{ success: boolean; data?: Priority; error?: any }> {
    try {
        const [newPriority] = await db
            .insert(priorities)
            .values({ ...priorityData, userId })
            .returning()

        return { success: true, data: newPriority }
    } catch (error) {
        console.error('Error creating priority:', error)
        return { success: false, error }
    }
}

export async function updatePriority(priorityId: string, userId: string, updates: Partial<Omit<Priority, 'id' | 'userId' | 'createdAt'>>): Promise<{ success: boolean; data?: Priority; error?: any }> {
    try {
        const [updatedPriority] = await db
            .update(priorities)
            .set({ ...updates, updatedAt: new Date() })
            .where(and(eq(priorities.id, priorityId), eq(priorities.userId, userId)))
            .returning()

        return { success: true, data: updatedPriority }
    } catch (error) {
        console.error('Error updating priority:', error)
        return { success: false, error }
    }
}

export async function deletePriority(priorityId: string, userId: string): Promise<{ success: boolean; error?: any }> {
    try {
        await db
            .delete(priorities)
            .where(and(eq(priorities.id, priorityId), eq(priorities.userId, userId)))

        return { success: true }
    } catch (error) {
        console.error('Error deleting priority:', error)
        return { success: false, error }
    }
}

// Daily task operations
export async function getDailyTasks(userId: string): Promise<{ success: boolean; data?: DailyTask[]; error?: any }> {
    try {
        const userTasks = await db
            .select()
            .from(dailyTasks)
            .where(eq(dailyTasks.userId, userId))
            .orderBy(desc(dailyTasks.createdAt))

        return { success: true, data: userTasks }
    } catch (error) {
        console.error('Error fetching daily tasks:', error)
        return { success: false, error }
    }
}

export async function createDailyTask(userId: string, taskData: Omit<NewDailyTask, 'userId'>): Promise<{ success: boolean; data?: DailyTask; error?: any }> {
    try {
        const [newTask] = await db
            .insert(dailyTasks)
            .values({ ...taskData, userId })
            .returning()

        return { success: true, data: newTask }
    } catch (error) {
        console.error('Error creating daily task:', error)
        return { success: false, error }
    }
}

export async function updateDailyTask(taskId: string, userId: string, updates: Partial<Omit<DailyTask, 'id' | 'userId' | 'createdAt'>>): Promise<{ success: boolean; data?: DailyTask; error?: any }> {
    try {
        const [updatedTask] = await db
            .update(dailyTasks)
            .set({ ...updates, updatedAt: new Date() })
            .where(and(eq(dailyTasks.id, taskId), eq(dailyTasks.userId, userId)))
            .returning()

        return { success: true, data: updatedTask }
    } catch (error) {
        console.error('Error updating daily task:', error)
        return { success: false, error }
    }
}

export async function deleteDailyTask(taskId: string, userId: string): Promise<{ success: boolean; error?: any }> {
    try {
        await db
            .delete(dailyTasks)
            .where(and(eq(dailyTasks.id, taskId), eq(dailyTasks.userId, userId)))

        return { success: true }
    } catch (error) {
        console.error('Error deleting daily task:', error)
        return { success: false, error }
    }
}

// Smart insights operations
export async function getSmartInsights(userId: string): Promise<{ success: boolean; data?: SmartInsight[]; error?: any }> {
    try {
        const userInsights = await db
            .select()
            .from(smartInsights)
            .where(and(eq(smartInsights.userId, userId), eq(smartInsights.dismissed, false)))
            .orderBy(desc(smartInsights.confidence), desc(smartInsights.createdAt))

        return { success: true, data: userInsights }
    } catch (error) {
        console.error('Error fetching smart insights:', error)
        return { success: false, error }
    }
}

export async function createSmartInsight(userId: string, insightData: Omit<NewSmartInsight, 'userId'>): Promise<{ success: boolean; data?: SmartInsight; error?: any }> {
    try {
        const [newInsight] = await db
            .insert(smartInsights)
            .values({ ...insightData, userId })
            .returning()

        return { success: true, data: newInsight }
    } catch (error) {
        console.error('Error creating smart insight:', error)
        return { success: false, error }
    }
}

export async function dismissSmartInsight(insightId: string, userId: string): Promise<{ success: boolean; error?: any }> {
    try {
        await db
            .update(smartInsights)
            .set({ dismissed: true, updatedAt: new Date() })
            .where(and(eq(smartInsights.id, insightId), eq(smartInsights.userId, userId)))

        return { success: true }
    } catch (error) {
        console.error('Error dismissing smart insight:', error)
        return { success: false, error }
    }
} 