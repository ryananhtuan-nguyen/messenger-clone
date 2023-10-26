'use client'
import { signOut } from 'next-auth/react'
import React from 'react'

const Users = () => {
  return <button onClick={() => signOut()}>Logout</button>
}

export default Users
