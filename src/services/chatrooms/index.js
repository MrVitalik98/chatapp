import * as API from '../api-list'
import { showAlert } from '../../app/features/alert/alertSlice'
import { setUsers } from '../../app/features/chatroom/chatroomSlice'
import { startFetchingChatrooms, fetchChatroomsSuccedded, fetchChatroomsFailed, search, setChatrooms } from '../../app/features/chatrooms/chatroomsSlice'


export const getChatrooms = (firstTime, number = 5) => {
  return async (dispatch, getState) => {
    const { token } = getState().user
    const { _id } = getState().chatroom

    firstTime && dispatch(startFetchingChatrooms())
    dispatch(search(''))
 
    try {
      const { data } = await API.getChatrooms(token, number)
      const chatroom = data?.chatrooms.find(chatroom => chatroom._id.toString() === _id.toString())

      if(chatroom?._id) {
        const { users } = chatroom
        dispatch(setUsers(users))
      }
      
      dispatch(fetchChatroomsSuccedded(data))
    }
    catch(e) {
      dispatch(fetchChatroomsFailed())
      dispatch(showAlert(e?.response?.data))
    }
  }
}


export const searchChatrooms = (query, number = 5) => {
  return async (dispatch, getState) => {
    const { token } = getState().user
    const { _id } = getState().chatroom

    dispatch(search(query))
    dispatch(startFetchingChatrooms())    
 
    try {
      const { data } = await API.searchChatrooms(token, number, query)
      const chatroom = data?.chatrooms.find(chatroom => chatroom._id === _id)

      if(chatroom?._id) {
        const { users } = chatroom
        dispatch(setUsers(users))
      }

      dispatch(fetchChatroomsSuccedded(data))
    }
    catch(e) {
      dispatch(fetchChatroomsFailed())
      dispatch(showAlert(e.response.data))
    }
  }
}


export const loadMoreChatrooms = firstTime => {
  return async (dispatch, getState) => {
    const { query, number } = getState().chatrooms

    try {
      query ? dispatch(searchChatrooms(query, number)) : dispatch(getChatrooms(firstTime, number))
    }
    catch(e) {
      dispatch(fetchChatroomsFailed())
      dispatch(showAlert(e.response.data))
    }
  }
}


export const setChatroomMessages = (chatroomId, messages) => {
  return (dispatch, getState) => {
    const { chatrooms } = getState().chatrooms

    const chatrooms_ = chatrooms.map(chat => {
      return chat?._id?.toString() === chatroomId?.toString() 
        ? { 
            ...chat, 
            messages: Array.isArray(messages) ? messages : [...chat?.messages, messages]
          }
        : chat
    })

    dispatch(setChatrooms(chatrooms_ ))
  }
}


export const setChatroomReadMessages = (chatroomId, readMessages) => {
  return (dispatch, getState) => {
    const { chatrooms } = getState().chatrooms

    const chatrooms_ = chatrooms.map(chat => {
      return chat?._id?.toString() === chatroomId?.toString()
        ? {
            ...chat,
            messages: chat?.messages?.map(msg => readMessages.some(rMsg => rMsg?.toString() === msg?._id?.toString()) ? ({ ...msg, read: true }) : msg)
          }
        : chat
    })

    dispatch(setChatrooms(chatrooms_))
  }
}