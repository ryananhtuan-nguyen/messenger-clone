import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import getUsers from '../actions/getUsers'

const layout = async ({ children }: { children: React.ReactNode }) => {
  const users = await getUsers()

  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={user} />
        {children}
      </div>
    </Sidebar>
  )
}

export default layout
