import bcrypt from 'bcrypt'
import nextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import prisma from '@/app/libs/prismadb'
import NextAuth from 'next-auth/next'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        //check if email or password is empty
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid Credentials')
        }
        //if email and password is entered, find the user
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        //check if user or hasedpassword does not exist
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid Credentials')
        }

        //compare the encrypted password
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        //if password does not match throw error
        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }
        //if everything is ok return the user
        return user
      },
    }),
  ],
  //this part is only for debugging in development mode
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
