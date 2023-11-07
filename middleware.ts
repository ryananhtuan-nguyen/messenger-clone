import { withAuth } from 'next-auth/middleware'
// add signin redirect
export default withAuth({
  pages: {
    signIn: '/',
  },
})

export const config = {
  matcher: ['/users/:path*', '/conversations/:path*'],
}
