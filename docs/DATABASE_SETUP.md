# 🗄️ Neon Database Setup for RoutineOS

## **Step 1: Create Neon Account & Database**

1. Go to [Neon Console](https://console.neon.tech) and sign up/sign in
2. Create a new project called `routineos`
3. Copy your database connection string from the dashboard
   - It looks like: `postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

## **Step 2: Configure Environment Variables**

Create a `.env.local` file in your project root:

```bash
# Neon Database
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth.js (required for authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Google OAuth (existing)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## **Step 3: Push Database Schema**

Run the following commands to set up your database:

```bash
# Generate migration files
npm run db:generate

# Push schema to Neon database
npm run db:push
```

## **Step 4: Verify Database Connection**

Test your database connection:

```bash
# Open Drizzle Studio (database GUI)
npm run db:studio
```

This will open a web interface at `http://localhost:4983` where you can view your tables.

## **Step 5: Development Workflow**

### **Common Commands:**

```bash
# Generate new migrations after schema changes
npm run db:generate

# Push changes to database
npm run db:push

# Open database GUI
npm run db:studio
```

### **Making Schema Changes:**

1. Edit `src/lib/db/schema.ts`
2. Run `npm run db:generate`
3. Run `npm run db:push`

## **Database Features**

### **Tables Created:**

- `users` - User accounts with Google OAuth
- `habits` - User habits with completion tracking
- `priorities` - User priorities/goals with due dates
- `daily_tasks` - Daily task management
- `smart_insights` - AI-generated insights
- `sessions` - NextAuth session management
- `accounts` - OAuth provider accounts

### **Key Features:**

- ✅ **Multi-user support** - Each user's data is isolated
- ✅ **Real-time sync** - Changes sync across devices
- ✅ **Data persistence** - No more localStorage limitations
- ✅ **Scalable** - Neon's serverless PostgreSQL scales automatically
- ✅ **Backup & Recovery** - Built-in with Neon
- ✅ **Type Safety** - Full TypeScript support with Drizzle ORM

## **Data Migration from localStorage**

If you have existing data in localStorage, you can manually create it through the app interface, or contact support for a migration script.

## **Troubleshooting**

### **Connection Issues:**

- Verify your `DATABASE_URL` is correct
- Check that your Neon database is active
- Ensure your IP is allowlisted (Neon allows all by default)

### **Schema Issues:**

- Run `npm run db:generate` after schema changes
- Check Drizzle Studio for table structure
- Verify environment variables are loaded

### **Authentication Issues:**

- Ensure `NEXTAUTH_SECRET` is set
- Check Google OAuth credentials
- Verify session handling in NextAuth config

## **Production Deployment**

For production, make sure to:

1. Use production Neon database URL
2. Set proper `NEXTAUTH_URL` for your domain
3. Configure environment variables in your hosting platform
4. Run migrations before deploying

## **Support**

If you encounter issues:

1. Check the [Neon Documentation](https://neon.tech/docs)
2. Review [Drizzle ORM Docs](https://orm.drizzle.team/)
3. Open an issue in the RoutineOS repository
