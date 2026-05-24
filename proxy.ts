import { withAuth } from 'next-auth/middleware'

export const proxy = withAuth({
    pages: {
        signIn: '/login',
    },
})

export const config = {
    matcher: ['/activos/:path*', '/usuarios/:path*'],
}