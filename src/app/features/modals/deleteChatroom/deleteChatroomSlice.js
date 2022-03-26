import { createSlice } from '@reduxjs/toolkit'


const initialState = { 
  isShow: false,
  userId: ''
}


const deleteChatroomSlice = createSlice({
  name: 'delete-chatroom',
  initialState,
  reducers: {
    openDeleteChatroomModal(state, { payload }) {
      return { 
        isShow: true,
        userId: payload
      }
    },
    closeDeleteChatroomModal() {
      return { 
        isShow: false,
        userId: ''
      }
    }
  }
})


// Export Actions
export const { openDeleteChatroomModal, closeDeleteChatroomModal } = deleteChatroomSlice.actions

// Export Reducer
export default deleteChatroomSlice.reducer