import * as API from '../api-list'
import { setChatroomMessages } from '../chatrooms'
import { showAlert } from '../../app/features/alert/alertSlice'
import { startFetchingChatroom, fetchChatroomSuccedded, fetchChatroomFailed, setMessages } from '../../app/features/chatroom/chatroomSlice'


export const getChatroom = (chatroomId, firstTime) => {
  return async (dispatch, getState) => {
    const { token } = getState().user

    firstTime && dispatch(startFetchingChatroom())
    
    try {
      const { data } = await API.getChatroom(token, chatroomId)
      const { status, chatroom } = data

      chatroom && dispatch(fetchChatroomSuccedded({ ...chatroom }))
      !firstTime && dispatch(setChatroomMessages(chatroomId, chatroom?.messages))

      return status
    }
    catch(e) {
      dispatch(fetchChatroomFailed())
      dispatch(showAlert(e?.response?.data))
    }
  }
}


export const createNewChatroom = userId => {
  return async (dispatch, getState) => {
    const { token } = getState().user

    try {
      const { data } = await API.createNewChatroom(token, userId)
      const { status } = data
      return status
    }
    catch(e) {
      dispatch(showAlert(e?.response?.data))
    }
  }
}


export const deleteChatroom = userId => {
  return async (dispatch, getState) => {
    const { token } = getState().user
    
    try {
      const { data } = await API.deleteChatroom(token, userId)
      const { status } = data
      return status
    }
    catch(e) {
      dispatch(showAlert(e?.response?.data))
    }
  }
}


export const addMessage = message => {
  return async (dispatch, getState) => {
    const { token } = getState().user
    const { _id, messages } = getState().chatroom

    try {
      const { data } = await API.addNewMessage(token, _id, message)
      const { msg } = data

      dispatch(setMessages([...messages, msg]))
      dispatch(setChatroomMessages(_id, msg))

      return msg
    }
    catch(e) {
      dispatch(showAlert(e?.response?.data))
    }
  }
}


export const clearChat = chatroomId => {
  return async (dispatch, getState) => {
    const { token } = getState().user

    try {
      const { data } = await API.clearChat(token, chatroomId)
      await dispatch(getChatroom(chatroomId, false))

      const { status } = data

      return status
    }
    catch(e) {
      dispatch(showAlert(e?.response?.data))
    }
  }
}


export const deleteMessage = userId => {
  return async (dispatch, getState) => {
    const { token } = getState().user
    const { _id } = getState().chatroom
    const { messageIDS } = getState().modals.deleteMessage
    const json = { messageIDS, userId }

    try {
      const { data } = await API.deleteMessage(token, _id, json)
      await dispatch(getChatroom(_id, false))

      const { status } = data

      return status
    }
    catch(e) {
      dispatch(showAlert(e?.response?.data))
    }
  }
}


