import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import ConversationList from './components/ConversationList'

const ConversationsLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList initialItems={[]} />
        {children}
      </div>
    </Sidebar>
  )
}

export default ConversationsLayout
