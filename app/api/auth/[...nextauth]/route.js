import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) return null

                const passwordOk = await bcrypt.compare(credentials.password, user.password)
                if (!passwordOk) return null

                return {
                    id: user.id,
                    email: user.email,
                    nombre: user.nombre,
                    rol: user.rol
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.nombre = user.nombre
                token.rol = user.rol
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id
            session.user.nombre = token.nombre
            session.user.rol = token.rol
            return session
        }
    },
    pages: {
        signIn: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }