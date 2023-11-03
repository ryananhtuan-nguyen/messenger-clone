import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import ConversationList from './components/ConversationList'
import getConversations from '../actions/getConversations'

const ConversationsLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  //This is the layout for /conversations
  //get data and pass down as props
  const conversations = await getConversations()

  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList initialItems={conversations} />
        {children}
      </div>
    </Sidebar>
  )
}

export default ConversationsLayout
