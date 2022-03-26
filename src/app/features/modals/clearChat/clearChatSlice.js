import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  isShow: false,
  chatroomId: ''
}


const clearChatSlice = createSlice({
  name: 'clear-chatroom',
  initialState,
  reducers: {
    openClearChatModal(_, { payload }) {
      return {
        isShow: true,
        chatroomId: payload
      }
    },
    closeClearChatModal() {
      return initialState
    }
  }
})


// Export Actions
export const { openClearChatModal, closeClearChatModal } = clearChatSlice.actions

// Export Reducer
export default clearChatSlice.reducer