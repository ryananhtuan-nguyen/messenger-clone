interface IParams {
  conversationId: string
}

const ConversationId = async ({ params }: { params: IParams }) => {
  return <div>ConversationId</div>
}

export default ConversationId
