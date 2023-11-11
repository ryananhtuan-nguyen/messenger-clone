'use client'

import Avatar from '@/app/components/Avatar'
import LoadingModal from '@/app/components/LoadingModal'
import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

interface UserBoxProps {
  data: User
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  //Handle clicking on an user's name
  const handleClick = useCallback(() => {
    //notify loading state
    setIsLoading(true)
    //post the request with the other user's id
    axios
      .post('/api/conversations', {
        userId: data.id,
      })
      //redirect ( open the convo box) with the clicked user
      .then((data) => {
        router.push(`/conversations/${data.data.id}`)
      })
      //remove loading state
      .finally(() => setIsLoading(false))
  }, [data, router])

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserBox
