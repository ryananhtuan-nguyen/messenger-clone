'use client'

import { FullMessageType } from '@/app/types'

interface MessageBoxProps {
  isLast: boolean
  data: FullMessageType
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, data }) => {
  return <div>MessageBox</div>
}

export default MessageBox
