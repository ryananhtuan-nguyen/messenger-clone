import prisma from '@/app/libs/prismadb'

import getSession from './getSession'

const getUsers = async () => {
  //get current session
  const session = await getSession()
  //if no session return [] as empty user []
  if (!session?.user?.email) {
    return []
  }

  try {
    //find users to display in conversations
    //exclude the current user, as current user's name
    //does not need to be shown in the Convo box
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    })
    //return users[]
    return users
  } catch (error: any) {
    return []
  }
}

export default getUsers
