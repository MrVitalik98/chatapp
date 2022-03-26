import React, { useRef, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNumber } from '../app/features/chatrooms/chatroomsSlice'
import { loadMoreChatrooms, setChatroomMessages, setChatroomReadMessages } from '../services/chatrooms'
import SocketContext from '../contexts/SocketContext'
import ChatItem from './ChatItem'


const ChatList = () => {
  const dispatch = useDispatch()
  const chatListRef = useRef('')
  const { socket } = useContext(SocketContext)
  const { user: { _id } } = useSelector(state => state.user)
  const { chatrooms, loading, total, number } = useSelector(state => state.chatrooms)


  useEffect(() => {
    dispatch(loadMoreChatrooms(true))
  }, [dispatch, number])


  useEffect(() => {
    const getMessage = ({ msg, chatId }) => {
      dispatch(setChatroomMessages(chatId, msg))
    }

    const getReadMessage = ({ messageId, chatId }) => {
      dispatch(setChatroomReadMessages(chatId, [messageId]))
    }

    const getReadMessages = ({ readMessages, chatId }) => {
      dispatch(setChatroomReadMessages(chatId, readMessages))
    }

    const getDeletedMessages = ({ messageIDS, chatId }) => {
      const chatroom = chatrooms.find(chatroom => chatroom._id === chatId)
      const messages = chatroom?.messages?.filter(msg => !messageIDS.includes(msg?._id?.toString()))
      dispatch(setChatroomMessages(chatId, messages))
    }
    
    socket.on('get message', getMessage)
    socket.on('get read message', getReadMessage)
    socket.on('get read messages', getReadMessages)
    socket.on('get deleted messages', getDeletedMessages)

    return () => {
      socket.off('get message', getMessage)
      socket.off('get read message', getReadMessage)
      socket.off('get read messages', getReadMessages)
      socket.off('get deleted messages', getDeletedMessages)
    }
  }, [socket, dispatch, chatrooms])


  useEffect(() => {
    const clearChat = ({ chatId }) => {
      dispatch(setChatroomMessages(chatId, []))
    }

    socket.on('clear chat', clearChat)

    return () => {
      socket.off('clear chat', clearChat)
    }
  }, [socket, dispatch])


  useEffect(() => {
    const fetchChats = () => {
      dispatch(loadMoreChatrooms(false))
    }

    socket.on('fetch chats', fetchChats)

    return () => {
      socket.off('fetch chats', fetchChats)
    }
  }, [socket, dispatch])


  const handleScroll = () => {
    const scrollHeight = chatListRef.current.scrollHeight
    const offsetHeight = chatListRef.current.offsetHeight
    const scrollTop = chatListRef.current.scrollTop
    
    if(scrollTop >= scrollHeight - offsetHeight && total > number) {
      dispatch(setNumber())
    }
  }


  return (
    <div 
      ref={chatListRef}
      className="chat-list"
      onScroll={handleScroll}
    >
      {
        chatrooms?.length 
        ? (
          [...chatrooms]
            .sort((a, b) => a?.messages?.filter(msg => !msg?.read && msg?.senderId?.toString() !== _id?.toString())?.length <= b?.messages?.filter(msg => !msg?.read && msg?.senderId?.toString() !== _id?.toString())?.length ? 1 : -1)
            .map(chat => {
              return <ChatItem 
                key={chat._id} 
                chat={chat}
              />
            })
        ) 
        : !loading && <h5 className="noData text-danger">No chatrooms</h5>
      }

      <div className={loading ? 'loader my-2' : 'd-none'}>
        <div className="spinner spinner-border text-info"></div>
      </div>
    </div>
  )
}


export default ChatList