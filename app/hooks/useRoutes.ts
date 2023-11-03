import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { HiChat } from 'react-icons/hi'
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2'
import { signOut } from 'next-auth/react'
import useConversation from './useConversation'

const useRoutes = () => {
  //grabbing pathname from URL
  const pathname = usePathname()
  //deconstruct and get conversationId from custom hook
  const { conversationId } = useConversation()

  //constructing different routes for the navigation icons
  const routes = useMemo(
    () => [
      {
        label: 'Chat',
        href: '/conversations',
        icon: HiChat,
        active: pathname === '/conversations' || !!conversationId,
      },
      {
        label: 'Users',
        href: '/users',
        icon: HiUsers,
        active: pathname === '/users',
      },
      {
        label: 'Logout',
        href: '#',
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conversationId]
  )

  //returning routes as an array for later use
  return routes
}

export default useRoutes
