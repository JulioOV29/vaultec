export { default } from 'next-auth/middleware'

export const config = {
    matcher: ['/activos/:path*', '/usuarios/:path*']
}