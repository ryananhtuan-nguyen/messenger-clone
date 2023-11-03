'use client'

import { FullConversationType } from '@/app/types'
import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Conversation, Message, User } from '@prisma/client'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'
import useOtherUser from '@/app/hooks/useOtherUser'
import Avatar from '@/app/components/Avatar'

interface ConversationBoxProps {
  data: FullConversationType
  selected?: boolean
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  //grab other user so that we can exclude the current user when displaying
  //conversation name
  const otherUser = useOtherUser(data)
  //get current seesion
  const session = useSession()
  //make router to redirect
  const router = useRouter()

  //handleClick function to redirect to corressponding conversation
  //use Callback since we want to memorize this function until
  //the user data changed (login with different account/user)
  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`)
  }, [data.id, router])

  //get last message to display in the conversation box
  const lastMessage = useMemo(() => {
    //check if messages in the conversation get passed down as props
    //if not make it an empty array
    const messages = data.messages || []

    //get the last message in the messages array and return it
    return messages[messages.length - 1]
    //this will get updated when new convo is loaded
  }, [data.messages])

  //useMemo for userEmail so it wont get rerendered
  //as long as the user has not logged out
  const userEmail = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email])

  //Check if the last message in the convo has been seen
  const hasSeen = useMemo(() => {
    //If there is no last message return false
    if (!lastMessage) return false

    //get the seen messages
    //if there no messages, empty array
    const seenArray = lastMessage.seen || []

    //if theres no user email, ie: user not logged in || no session
    //return false
    if (!userEmail) return false

    //if all checks passed, return true/false accordingly
    //if seenArray .length !== 0 there are unseen messages
    return seenArray.filter((user) => user.email === userEmail).length !== 0
  }, [userEmail, lastMessage])

  //Display last message text in the Conversation box
  const lastMessageText = useMemo(() => {
    //if the last message is an image,
    //display "Sent an image"
    if (lastMessage?.image) {
      return 'Sent an image'
    }

    //If the last message is not empty && not an image
    //Display that message
    if (lastMessage?.body) {
      return lastMessage.body
    }

    //Otherwise display Started a conversation
    //To indicate a convo has been created but no one has sent a message yet
    return 'Started a conversation'
  }, [lastMessage])

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full
        relative
        flex
        item-center
        space-x-3
        hover:bg-neutral-100rounded-lg
        transition
        cursor-pointer
        p-3
    `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      <Avatar user={otherUser} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
            truncate
            text-sm
          `,
              hasSeen ? 'text-gray-500' : 'text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConversationBox
