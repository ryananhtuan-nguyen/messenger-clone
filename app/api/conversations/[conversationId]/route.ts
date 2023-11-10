import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
interface IParams {
  conversationId?: string
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params
    const currentUser = await getCurrentUser()

    if (!currentUser?.id) {
      return new NextResponse('Unauthorize', { status: 401 })
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    })

    if (!existingConversation) {
      return new NextResponse('Invalid Id', { status: 400 })
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    })

    return NextResponse.json(deletedConversation)
  } catch (error) {
    console.log(error, 'ERROR_CONVERSATION_DELETE_ROUTE_HEHE')
    return new NextResponse('Internal error', { status: 500 })
  }
}
