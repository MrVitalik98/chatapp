import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  _id: '',
  users: [],
  messages: [],
  loading: false
}


const chatroomSlice = createSlice({
  name: "chatroom",
  initialState,
  reducers: {
    startFetchingChatroom(state) {
      return {
        ...state,
        loading: true
      }
    },
    fetchChatroomSuccedded(state, { payload }) {
      return {
        ...state,
        ...payload,
        loading: false
      }
    },
    fetchChatroomFailed() {
      return {
        ...initialState
      }
    },
    setUsers(state, { payload }) {
      return {
        ...state,
        users: payload
      }
    },
    setMessages(state, { payload }) {
      return {
        ...state,
        messages: payload
      }
    }
  }
})


// Export Actions
export const { startFetchingChatroom, fetchChatroomSuccedded, fetchChatroomFailed, setUsers, setMessages } = chatroomSlice.actions

// Export Reducer
export default chatroomSlice.reducer