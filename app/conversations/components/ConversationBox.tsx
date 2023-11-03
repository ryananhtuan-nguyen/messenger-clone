'use client'

import { FullConversationType } from '@/app/types'
import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Conversation, Message, User } from '@prisma/client'
interface ConversationBoxProps {
  data: FullConversationType[]
  selected: boolean
}
const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  return <div>ConversationBox</div>
}

export default ConversationBox
