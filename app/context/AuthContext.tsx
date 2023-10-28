'use client'
import { SessionProvider } from 'next-auth/react'

interface AuthContextProps {
  children: React.ReactNode
}

import React from 'react'
/*
---------------------------------Wrapping all pages with SessionProvider--------------------------------
 */
const AuthContext = ({ children }: AuthContextProps) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthContext
