import { pgTable, serial, text, boolean, timestamp, integer, jsonb, uuid, varchar } from 'drizzle-orm/pg-core'

// Users table (for multi-user support)
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Habits table
export const habits = pgTable('habits', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 50 }),
    difficulty: varchar('difficulty', { length: 20 }).default('medium'),
    estimatedTime: integer('estimated_time').default(15), // minutes
    completedDays: jsonb('completed_days').notNull().default({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    }),
    streak: integer('streak').default(0),
    longestStreak: integer('longest_streak').default(0),
    chainedHabits: jsonb('chained_habits').default([]), // array of habit IDs
    prerequisiteHabits: jsonb('prerequisite_habits').default([]), // array of habit IDs
    optimalTimes: jsonb('optimal_times').default([]), // array of strings
    aiInsights: jsonb('ai_insights'), // AI insights object
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Priorities table
export const priorities = pgTable('priorities', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    text: text('text').notNull(),
    completed: boolean('completed').default(false).notNull(),
    priority: varchar('priority', { length: 20 }).default('medium'),
    estimatedTime: integer('estimated_time'), // minutes
    category: varchar('category', { length: 50 }),
    dueDate: timestamp('due_date'),
    tags: jsonb('tags').default([]), // array of strings
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Daily tasks table
export const dailyTasks = pgTable('daily_tasks', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    text: text('text').notNull(),
    day: varchar('day', { length: 20 }).notNull(), // 'Today', 'Tomorrow', etc.
    completed: boolean('completed').default(false).notNull(),
    priority: varchar('priority', { length: 20 }).default('medium'),
    estimatedTime: integer('estimated_time'), // minutes
    category: varchar('category', { length: 50 }),
    aiGenerated: boolean('ai_generated').default(false),
    suggestedTime: varchar('suggested_time', { length: 20 }), // '9:00 AM'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Smart insights table
export const smartInsights = pgTable('smart_insights', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    type: varchar('type', { length: 50 }).notNull(), // 'habit', 'priority', 'task', 'goal', 'general'
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    actionable: boolean('actionable').default(false),
    action: text('action'),
    confidence: integer('confidence').notNull(), // 0-100
    category: varchar('category', { length: 50 }).notNull(), // 'performance', 'timing', 'streak', etc.
    dismissed: boolean('dismissed').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// User sessions table (for NextAuth)
export const sessions = pgTable('sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    sessionToken: varchar('session_token', { length: 255 }).unique().notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expires: timestamp('expires').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// User accounts table (for NextAuth providers)
export const accounts = pgTable('accounts', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    provider: varchar('provider', { length: 50 }).notNull(),
    providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    scope: text('scope'),
    idToken: text('id_token'),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: integer('expires_at'),
    tokenType: varchar('token_type', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Export types for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Habit = typeof habits.$inferSelect
export type NewHabit = typeof habits.$inferInsert

export type Priority = typeof priorities.$inferSelect
export type NewPriority = typeof priorities.$inferInsert

export type DailyTask = typeof dailyTasks.$inferSelect
export type NewDailyTask = typeof dailyTasks.$inferInsert

export type SmartInsight = typeof smartInsights.$inferSelect
export type NewSmartInsight = typeof smartInsights.$inferInsert 