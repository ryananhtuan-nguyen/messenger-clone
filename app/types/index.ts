import { Conversation, Message, User } from '@prisma/client'

/*
------------------------------------------------------------------------
Create type to use in across components
------------------------------------------------------------------------
*/
export type FullMessageType = Message & {
  sender: User
  seen: User[]
}

export type FullConversationType = Conversation & {
  users: User[]
  messages: FullMessageType[]
}
