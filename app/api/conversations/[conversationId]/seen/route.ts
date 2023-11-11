import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/pusher'
import { last } from 'lodash'
interface IParams {
  conversationId?: string
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser()
    const { conversationId } = params
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('UNAUTHORIZED', { status: 401 })
    }

    //Find existing conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    })

    if (!conversation) {
      return new NextResponse('Invalid Id', { status: 400 })
    }

    //Find the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1]

    if (!lastMessage) {
      return NextResponse.json(conversation)
    }

    //update seen of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    })

    //make pusher server channel
    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage],
    })

    //current user should be excluded/ have seen the message
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation)
    }

    //trigger channel
    await pusherServer.trigger(
      conversationId!,
      'messages:update',
      updatedMessage
    )

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.log(error, 'ERROR MESSAGES SEEN')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
