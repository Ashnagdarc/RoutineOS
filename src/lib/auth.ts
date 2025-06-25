import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'

// Debug environment variables
console.log('NextAuth Environment Check:', {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
})

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID environment variable is not set')
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_SECRET environment variable is not set')
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'openid email profile https://www.googleapis.com/auth/spreadsheets',
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
            }
            // Preserve user data in token
            if (user) {
                token.name = user.name
                token.email = user.email
                token.picture = user.image
            }
            // Debug token data
            console.log('JWT Callback - Token:', token)
            console.log('JWT Callback - Account:', account)
            console.log('JWT Callback - User:', user)
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string
            session.refreshToken = token.refreshToken as string
            // Restore user data from token
            if (session.user) {
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture as string
            }
            // Debug session data
            console.log('Session Callback - Session:', session)
            console.log('Session Callback - Token:', token)
            return session
        },
    },
    pages: {
        signIn: '/',
    },
} 