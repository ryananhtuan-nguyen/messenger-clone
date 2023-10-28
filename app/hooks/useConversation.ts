import { useParams } from 'next/navigation'
import { useMemo } from 'react'

const useConversation = () => {
  //Get params conversationId from URL
  const params = useParams()

  //using useMemo to prevent rerendering as long as conversationId remains unchanged
  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return ''
    }
  }, [params?.conversationId])
  //variable to control the opening conversation
  const isOpen = useMemo(() => !!conversationId, [conversationId])

  //return custom hook with useMemo
  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId]
  )
}

export default useConversation
