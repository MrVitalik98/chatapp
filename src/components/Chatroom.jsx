import React, { useEffect, useCallback, useState, useContext, useRef, useMemo } from 'react'
import { FaEllipsisV, FaEye, FaCheck, FaTimes, FaTrashAlt, FaPaperPlane } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap'
import { date } from '../services/date'
import { setMessages, setUsers } from '../app/features/chatroom/chatroomSlice'
import { openClearChatModal } from '../app/features/modals/clearChat/clearChatSlice'
import { openDeleteMessageModal } from '../app/features/modals/deleteMessage/deleteMessageSlice'
import { openDeleteChatroomModal } from '../app/features/modals/deleteChatroom/deleteChatroomSlice'
import { addMessage, getChatroom } from '../services/chatroom'
import { setChatroomReadMessages } from '../services/chatrooms'
import { getDateLastSeen } from '../utils/dateLastSeen'
import { getMonth } from '../utils/months'
import SpinnerLoader from './loaders/SpinnerLoader'
import SocketContext from '../contexts/SocketContext'
import DataContext from '../contexts/DataContext'
import DeleteMessage from './modals/DeleteMessage'
import ClearChat from './modals/ClearChat'


const getTime = d => {
  const date = new Date(d)
  let hour = date.getHours()
  let minute = date.getMinutes()

  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute

  const time = `${hour}:${minute}`
  return time
}


const isChatroomActive = () => {
  const pathname = window.location.pathname
  return pathname?.startsWith('/dashboard/chats')
}


const isVisible = elem => {
  const coords = elem.getBoundingClientRect()
  const windowHeight = document.documentElement.clientHeight

  const scrollTop = coords.top > 0 && coords.top + 70 < windowHeight
  const scrollBottom = coords.bottom > 0 && coords.bottom + 70 < windowHeight

  return scrollTop || scrollBottom
}


const Chatroom = () => {
  const chatHeaderRef = useRef('')
  const chatBodyRef = useRef('')
  const chatFooterRef = useRef('')
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isPrinting, setIsPrinting] = useState(false)
  const [message, setMessage] = useState('')
  const [messages_, setMessages_] = useState([])
  const { user: { _id }} = useSelector(state => state.user)
  const { year, month, day, hour, minute, seconds, dateTime } = useSelector(state => state.date)
  const { _id: chatroomId, users, loading: loadingMessages, messages } = useSelector(state => state.chatroom)
  const { messageSent, setMessageSending, isOpenSelectedMessagesPanel, setIsOpenSelectedMessagesPanel } = useContext(DataContext)
  const { socket } = useContext(SocketContext)


  const readMessage = useCallback(() => {
    const messages = document.querySelectorAll('.message')
    
    Array.from(messages).forEach(msg => {
      if(isVisible(msg)){
        const { id } = msg.dataset
        const message = messages_.find(message => message?._id?.toString() === id?.toString())

        if(message && !message?.read) {
          console.log('read message')

          socket.emit('read message', { messageId: id })

          setMessages_(prevMessages => {
            return prevMessages.map(msg => {
              return msg?._id?.toString() === id?.toString() ? ({ ...msg, read: true }) : msg
            })
          })
        }
      } 
    })
  }, [messages_, socket])


  const user = useMemo(() => {
    return users?.find(user => user._id.toString() !== _id.toString()) 
  }, [users, _id])


  const selectedMessagesCount = useMemo(() => {
    return messages_.filter(msg => msg?.isCheck)?.length
  }, [messages_])


  const scrollDown = (time = 300) => {
    setTimeout(() => {
      window.scrollTo(0, chatBodyRef?.current?.clientHeight)
    }, time)
  }


  const sortMessagesByDate = useCallback(messages => {
    return messages?.reduce((data, message) => {
      const date = new Date(message?.createdAt)
      const year_ = date.getFullYear()  
      const month_ = date.getMonth()
      const day_ = date.getDate()

      let title = `${day_} ${getMonth(month_)} ${year_}`

      if(+year_ === +year && +month - 1 === +month_) {
        if(+day_ === +day) {
          title = 'Today' 
        }

        if(+day - +day_ === 1) {
          title = 'Yesterday' 
        }
      }

      data[title]?.length ? data[title].push(message) : data[title] = [message]
      
      return data
    }, {})
  }, [day, month, year])


  const fetchChatroomById = useCallback(async firstTime => {
    dispatch(date())

    const status = await dispatch(getChatroom(params?.chatroomId, firstTime))
    status === 'error' && navigate('/dashboard/profile')
    
    scrollDown(chatBodyRef?.current?.clientHeight, 200)
    socket.emit('connect to chat', { chatroomId: params?.chatroomId })
  }, [dispatch, params?.chatroomId, navigate, socket])


  useEffect(() => {
    fetchChatroomById(true)
  }, [fetchChatroomById])


  useEffect(() => {
    window.addEventListener('scroll', readMessage)

    return () => {
      window.removeEventListener('scroll', readMessage)
    }
  }, [readMessage])


  useEffect(() => {
    const sendReadMessages = () => {
      const readMessages = messages_.filter(rMsg => rMsg?.senderId?.toString() !== _id?.toString() && rMsg?.read)
                                    .map(rMsg => rMsg?._id)

      socket.emit('send read messages', { readMessages })
    }

    socket.on('get chatroom messages', sendReadMessages)

    return () => socket.off('get chatroom messages', sendReadMessages)
  }, [socket, _id, messages_])


  useEffect(() => {
    const getReadMessages = ({ readMessages, chatId }) => {
      dispatch(setChatroomReadMessages(chatId, readMessages))

      setMessages_(prevMessages => {
        return prevMessages.map(msg => {
          return readMessages?.some(rMsg => rMsg?.toString() === msg?._id?.toString()) ? ({ ...msg, read: true }) : msg
        })
      })
    }

    socket.on('get read messages', getReadMessages)

    return () => socket.off('get read messages', getReadMessages)
  }, [socket, dispatch])


  useEffect(() => {
    const getReadMessage = ({ messageId }) => {
      setMessages_(prevMessages => {
        return prevMessages.map(msg => {
          return msg?._id?.toString() === messageId?.toString() && !msg?.read ? ({ ...msg, read: true }) : msg
        })
      })
    }

    socket.on('get read message', getReadMessage)

    return () => socket.off('get read message', getReadMessage)
  }, [socket])


  useEffect(() => {
    const chatDeleted = () => {
      if(isChatroomActive() && user?._id) {
        navigate(`/dashboard/users/${user._id}`)
      }
    }

    socket.on('chat deleted', chatDeleted)

    return () => socket.off('chat deleted', chatDeleted)
  }, [socket, user, navigate])


  useEffect(() => {
    readMessage()
  }, [readMessage])

  
  useEffect(() => {
    const getMessage = ({ msg, chatId }) => {
      if(chatId === chatroomId) {
        if(!messages_.find(message => message?._id?.toString() === msg?._id?.toString())) {
          const chatHeaderHeight = chatHeaderRef?.current?.clientHeight
          const chatBodyHeight = chatBodyRef.current.clientHeight
          const chatFooterHeight = chatFooterRef?.current?.clientHeight

          const scrollTop = window.scrollY
          const clientHeight = window.innerHeight
          
          dispatch(setMessages([ ...messages_, msg ]))

          chatBodyHeight - clientHeight + chatHeaderHeight + chatFooterHeight === scrollTop && scrollDown(1500)
        }
      }
    }


    const getDeletedMessages = ({ messageIDS, chatId }) => {
      if(chatId === chatroomId) {
        const messages = messages_?.filter(message => !messageIDS.includes(message?._id))
        dispatch(setMessages(messages))
      }
    }

    const clearChat = ({ chatId }) => {
      chatId === chatroomId && dispatch(setMessages([]))
    }

    socket.on('clear chat', clearChat)
    socket.on('get message', getMessage)
    socket.on('get deleted messages', getDeletedMessages)

    return () => {
      socket.off('clear chat', clearChat)
      socket.off('get message', getMessage)
      socket.off('get deleted messages', getDeletedMessages)
    }
  }, [socket, dispatch, chatroomId, messages_, readMessage])


  useEffect(() => {
    const userWrites = ({ isPrinting, userId }) => {
      userId.toString() !== _id.toString() && setIsPrinting(isPrinting)
    }
    
    socket.on('prints', userWrites)

    return () => socket.off('prints', userWrites)
  }, [socket, _id])


  useEffect(() => {
    setIsOpenSelectedMessagesPanel(false)
  }, [setIsOpenSelectedMessagesPanel]) 


  useEffect(() => {
    const mapMessages = arr => messages.map(msg => {
      const message = arr.find(message => msg?._id?.toString() === message?._id?.toString())
      return message ? { ...message } : { ...msg, isCheck: false }
    })

    !messages?.length && setIsOpenSelectedMessagesPanel(false)

    setMessages_(prevMessages => [...mapMessages(prevMessages)]) 
  }, [messages, setIsOpenSelectedMessagesPanel])


  useEffect(() => {
    const userDeletedAccount = ({ _id }) => {
      if(isChatroomActive()) {
        const user = users?.find(user => user?._id?.toString() === _id?.toString())
        user && navigate('/dashboard/profile')
      }
    }

    socket.on('user deleted account', userDeletedAccount)

    return () => socket.off('user deleted account', userDeletedAccount)
  }, [socket, navigate, users])


  useEffect(() => {
    const getEnabledUser = ({ _id }) => {
      if(isChatroomActive()) {
        const user = users?.find(user => user?._id?.toString() === _id?.toString() && !user?.isOnline)
        
        if(user) {
          const mapUsers = users?.map(user => {
            return user?._id?.toString() === _id?.toString() && !user?.isOnline
              ? ({ ...user, isOnline: true, lastSeenOnline: null }) 
              : user
          })

          dispatch(setUsers(mapUsers))
        }
      }
    }

    const getDisabledUser = ({ _id, lastSeenOnline }) => {
      if(isChatroomActive()) {
        const user = users?.find(user => user?._id?.toString() === _id?.toString() && user?.isOnline)
        
        if(user) {
          const mapUsers = users?.map(user => {
            return user?._id?.toString() === _id?.toString() && user?.isOnline
              ? ({ ...user, isOnline: false, lastSeenOnline }) 
              : user
          })
          dispatch(setUsers(mapUsers))
        }
      }
    }

    socket.on('get enabled user', getEnabledUser)
    socket.on('get disabled user', getDisabledUser)

    return () => {
      socket.off('get enabled user', getEnabledUser)
      socket.off('get disabled user', getDisabledUser)
    }
  }, [socket, dispatch, users])


  const handleChange = e => {
    setMessage(e.target.value)
    socket.emit('user writes', { isPrinting: true })
  }


  const handleCheck = messageId => {
    setMessages_(prevMessages => [...prevMessages.map(message => message._id === messageId ? { ...message, isCheck: !message.isCheck } : message )])
  }


  const handleBlur = () => socket.emit('user writes', { isPrinting: false })


  const sendMessage = async () => {
    if(messageSent && message.trim()) {
      dispatch(date())

      setMessages_(prevMessages => [
        ...prevMessages, 
        {
          msg: message,
          _id: Math.random() * 150, 
          createdAt: dateTime ? new Date(dateTime) : new Date(), 
          isSending: true,
          senderId: _id,
          isCheck: false 
        }
      ])

      scrollDown()
      setMessage('')
      setMessageSending(false)
      
      const msg = await dispatch(addMessage({ msg: message }))

      socket.emit('send message', { userId: user?._id, msg })
      
      setMessageSending(true)
      handleBlur()
    }
  }


  const handleOpenDeleteChatroomModal = () => dispatch(openDeleteChatroomModal(user._id))


  const handleOpenClearChatModal = () => dispatch(openClearChatModal(chatroomId))


  const handleOpenDeleteMessageModal = () => {
    const selectedMessageIDS = messages_.filter(message => message.isCheck).map(msg => msg._id)
    dispatch(openDeleteMessageModal(selectedMessageIDS))
  }


  const handleCloseSelectedMessagesPanel = () => {
    setIsOpenSelectedMessagesPanel(false)
    setMessages_(prevMessages => [...prevMessages.map(message => ({ ...message, isCheck: false }))])
  }


  return (
    <>
      {
        loadingMessages ? <SpinnerLoader /> : (
          <div className="chatroom">
            <div className="chatroom-header" ref={chatHeaderRef}>
              <div className="user-details">
                <img 
                  className="user-avatar"
                  alt="user-avatar"
                  src={user?.avatar}
                />

                <div className="user-info">
                  <h3 className="user-name">{user?.fullname}</h3>
                  {
                    isPrinting 
                      ? <p className="text-success">printing...</p>
                      : user?.isOnline 
                        ? <p className="text-success">online</p>
                        : <p>{getDateLastSeen(user?.lastSeenOnline, { year, month, day, hour, minute, seconds })}</p>
                  }
                </div>
              </div>

              <Dropdown>
                <Dropdown.Toggle variant="none" id="dropdown-basic" disabled={!messageSent}>
                  <FaEllipsisV />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item 
                    onClick={() => messages_?.length ? setIsOpenSelectedMessagesPanel(true) : undefined} 
                    disabled={!messages_?.length}
                  >
                    Select message
                  </Dropdown.Item>

                  <Dropdown.Item 
                    onClick={messages_?.length ? handleOpenClearChatModal : undefined}
                    disabled={!messages_?.length}
                  >
                    Clear chat
                  </Dropdown.Item>

                  <Dropdown.Item onClick={handleOpenDeleteChatroomModal}>Delete chat</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="chatroom-body" ref={chatBodyRef}>
              <div className="message-groups">
                {
                  Object.entries(sortMessagesByDate(messages_)).map(item => {
                    return (
                      <div className="message-group" key={item[0]}>
                        <div className="date">
                          <p>{item[0]}</p>
                        </div>

                        <div className="messages">
                          {
                            item[1]
                              .sort((a, b) => Date.now(a?.createdAt) > Date.now(b?.createdAt) ? -1 : 1)
                              .map(message => {
                                return (
                                  <div 
                                    data-id={message._id}
                                    key={message._id}
                                    className={`
                                      ${message.senderId === _id ? 'my-message' : 'message'}
                                      ${isOpenSelectedMessagesPanel ? 'show' : ''}
                                      ${message?.isCheck ? 'checked' : ''}
                                    `}
                                    onClick={() => isOpenSelectedMessagesPanel ? handleCheck(message._id) : undefined}
                                  >
                                    <div className="input-block">
                                      <input 
                                        type="checkbox"
                                        className='form-control'
                                        checked={message?.isCheck}
                                        onChange={() => undefined}
                                      />
                                    </div>

                                    <div 
                                      className='shadow-sm msg-block'
                                    >
                                      {
                                        message.senderId === _id && message?.sent
                                          ?
                                            message?.read 
                                              ? (
                                                <p className="operation">
                                                  <FaEye className="text-info" />
                                                </p>
                                              )
                                              : (
                                                <p className="operation">
                                                  <FaCheck className="text-secondary" />
                                                </p>
                                              )
                                          : ''  
                                      }

                                      <p className="time">
                                        {
                                          message.isSending 
                                            ? <span className="spinner spinner-border text-secondary"></span>
                                            : getTime(message.createdAt)
                                        }
                                      </p>

                                      <p className="msg">{message.msg}</p>
                                    </div>
                                  </div>
                                )
                              })
                          }
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>

            <div className="chatroom-footer" ref={chatFooterRef}>
              <div className="container">
                <div className={`selectedMessages ${ isOpenSelectedMessagesPanel ? 'show' : ''}`}>
                  <div className="details">
                    <button 
                      className="btn"
                      onClick={handleCloseSelectedMessagesPanel}
                    >
                      <FaTimes />
                    </button>

                    <p className="selectedMsgCount">Selected: <span className="count">{selectedMessagesCount}</span></p>
                  </div>
                
                  <button 
                    className="btn"
                    onClick={selectedMessagesCount ? handleOpenDeleteMessageModal : undefined}
                    disabled={!selectedMessagesCount}
                  >
                    <FaTrashAlt className="text-danger" />
                  </button>
                </div>
                
                <div className="chatroom-form">
                  <input 
                    type="text"
                    value={message}
                    className="form-control"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyPress={e => e.key === 'Enter' ? sendMessage() : undefined}
                    placeholder="Enter your message"
                    disabled={!messageSent}
                  />

                  <button 
                    id="send"
                    className="btn"
                    onClick={() => sendMessage()}
                    disabled={!message.trim()}
                  >
                    <FaPaperPlane className={message.trim() ? 'text-success' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Modals */}
      <ClearChat />
      <DeleteMessage handleClosePanel={handleCloseSelectedMessagesPanel} />
    </>
  )
}


export default Chatroom