import { useEffect, useState } from 'react'
import useActiveList from './useActiveList'
import { Channel, Members } from 'pusher-js'
import { pusherClient } from '../libs/pusher'

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList()
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)

  useEffect(() => {
    let channel = activeChannel
    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger')
      setActiveChannel(channel)
    }

    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const initialMembers: string[] = []
      //Members is a special type from pusher, each instead of forEach
      //id now is email (mapped from id to email in pages/api)
      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      )
      set(initialMembers)
    })

    channel.bind('pusher:member_added', (member: Record<string, any>) => {
      add(member.id)
    })

    channel.bind('pusher:member_removed', (member: Record<string, any>) => {
      remove(member.id)
    })

    //unmount
    return () => {
      //if activeChannel exist
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger')
        setActiveChannel(null)
      }
    }
  }, [activeChannel, set, add, remove])
}

export default useActiveChannel
