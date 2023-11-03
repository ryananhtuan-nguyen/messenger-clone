import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { FullConversationType } from '../types'
import { User } from '@prisma/client'

const useOtherUser = (
  conversation:
    | FullConversationType
    | {
        users: User[]
      }
) => {
  //get current session
  const session = useSession()

  //get other users, to exclude current users
  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email

    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    )
    //return the other user []
    return otherUser
  }, [session?.data?.user?.email, conversation.users])

  //since this is a 1 on 1 convo, return the first item in the array
  return otherUser[0]
}

export default useOtherUser
