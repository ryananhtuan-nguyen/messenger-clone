import prisma from '@/app/libs/prismadb'

import getSession from './getSession'

const getCurrentUser = async () => {
  try {
    //get current seesion
    const session = await getSession()
    //if current user does not exist in database
    if (!session?.user?.email) {
      return null
    }

    //find unique current user
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    })
    //if theres no current user found return null
    if (!currentUser) {
      return null
    }
    //otherwise return current user
    return currentUser
  } catch (error: any) {
    return null
  }
}
export default getCurrentUser
