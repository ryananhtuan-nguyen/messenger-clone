import { pusherServer } from '@/app/libs/pusher'
import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()
    const { message, image, conversationId } = body

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('UNAUTHORIZED', { status: 401 })
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    })

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    })
    //trigger pusher
    await pusherServer.trigger(conversationId, 'messages:new', newMessage)

    //find last message
    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1]
    //trigger pusher to all users in the conversation
    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        message: [lastMessage],
      })
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    console.log(error, 'ERROR MESSAGES')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
