import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  isShow: false,
  messageIDS: []
}


const deleteMessageSlice = createSlice({
  name: "delete-message",
  initialState,
  reducers: {
    openDeleteMessageModal(_, { payload }) {
      return {
        isShow: true,
        messageIDS: [...payload]
      }
    },
    closeDeleteMessageModal() {
      return { ...initialState }
    }
  }
})


// Export Actions
export const { openDeleteMessageModal, closeDeleteMessageModal } = deleteMessageSlice.actions

// Export Reducer
export default deleteMessageSlice.reducer