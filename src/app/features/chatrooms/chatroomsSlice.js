import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  chatrooms: [],
  loading: false,
  total: 0,
  number: 7,
  query: ''
}


const chatroomsSlice = createSlice({
  name: 'chatrooms',
  initialState,
  reducers: {
    startFetchingChatrooms(state) {
      state.loading = true
    },
    fetchChatroomsSuccedded(state, { payload }) {
      return {
        ...state,
        ...payload,
        loading: false
      }
    },
    fetchChatroomsFailed(state) {
      return {
        ...state,
        loading: false
      }
    },
    search(state, { payload }) {
      return {
        ...state,
        query: payload
      }
    },
    setNumber(state) {
      return {
        ...state,
        number: +state.number + 7
      }
    },
    setChatrooms(state, { payload }) {
      return {
        ...state,
        chatrooms: payload
      }
    }
  }
})


// Export Actions
export const { 
  startFetchingChatrooms, fetchChatroomsSuccedded, fetchChatroomsFailed, 
  search , setNumber, setChatrooms
} = chatroomsSlice.actions

// Export Reducer
export default chatroomsSlice.reducer