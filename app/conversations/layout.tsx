import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import ConversationList from './components/ConversationList'
import getConversations from '../actions/getConversations'
import getUsers from '../actions/getUsers'

const ConversationsLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const users = await getUsers()

  //This is the layout for /conversations
  //get data and pass down as props
  const conversations = await getConversations()

  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList users={users} initialItems={conversations} />
        {children}
      </div>
    </Sidebar>
  )
}

export default ConversationsLayout
