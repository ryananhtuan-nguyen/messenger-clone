import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function POST(request: Request) {
  try {
    //get current user
    const currentUser = await getCurrentUser()
    //get current body of the post request
    const body = await request.json()
    //deconstructing variables
    const { userId, isGroup, members, name } = body
    //if no current user id || email
    //current user does not exist in local database => return 401

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    /*
    --------------------------------------------------------------------------------
    If the conversation is a group chat
    --------------------------------------------------------------------------------
    */

    //but theres no members, or less than 2 members, or no user names provider
    //return 400 invalid

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 })
    }

    //For a valid data to create a group chat
    //Note: If it is a group chat, an user can create as many group chat
    //as they want, with the exact same members

    if (isGroup) {
      //create a new conversation in the database
      // with the name provided
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            //connect all users included in the request body
            connect: [
              ...members.map((member: { value: string }) => ({
                id: members.value,
              })),
              //with the current user created the convo
              {
                id: currentUser,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      })

      //return the newly created convo
      return NextResponse.json(newConversation)
    }
    /*
    --------------------------------------------------------------------------------
    Else if its not a group conversation, but a conversation between 2 users only
    --------------------------------------------------------------------------------
    */

    //find existing conversations between 2 users
    //since it is a 2-way conversation, there can be only one conversation
    //created between them
    //findMany instead of find so the condition OR can be used
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    })

    //since findMany returns an array, so grab the first element in the array
    const singleConversation = existingConversations[0]

    //if there is an existing conversation, return that conversation
    //instead of creating new one
    if (singleConversation) {
      return NextResponse.json(singleConversation)
    }
    //if theres no existing convo, create a new one
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    })
    //return the newly created convo
    return NextResponse.json(newConversation)
  } catch (error: any) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
