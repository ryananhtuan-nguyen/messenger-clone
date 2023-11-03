import { getServerSession } from 'next-auth'

import { authOptions } from '../api/auth/[...nextauth]/route'
/* ---------------------Get current Session------------------------ */
export default async function getSession() {
  return await getServerSession(authOptions)
}
