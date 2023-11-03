import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser'

const getConversations = async () => {
  //find current user
  const currentUser = await getCurrentUser()
  //If theres no current user, return []
  //so the app wont break, as the current user is not logged in
  if (!currentUser?.id) {
    return []
  }

  try {
    //find all conversations of the current user
    const conversations = await prisma.conversation.findMany({
      //order the conversations by last message time
      orderBy: {
        lastMessageAt: 'desc',
      },
      //find all conversations that involve curren user
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      //return users, all messages inside, also include sender and seen status of the messages
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    })
    return conversations
  } catch (error: any) {
    return []
  }
}

export default getConversations
