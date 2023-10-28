import bcrypt from 'bcrypt'
import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    //grabbing data from POST request
    const body = await request.json()
    //deconstructing email, name, password from the form
    const { email, name, password } = body
    //Return 400 if something is missing
    if (!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 })
    }
    //encrypting the password
    const hashedPassword = await bcrypt.hash(password, 12)
    //creating new user in mongodb with prisma
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    })

    //return newly created user
    return NextResponse.json(user)
  } catch (error) {
    console.log(error, 'REGISTRATION_ERROR')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
