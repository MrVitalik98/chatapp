import { createSlice } from '@reduxjs/toolkit'


const deleteAvatarSlice = createSlice({
  name: 'delete-avatar',
  initialState: { isShow: false },
  reducers: {
    openDeleteAvatarModal(state) {
      return { isShow: true }
    },
    closeDeleteAvatarModal(state) {
      return { isShow: false }
    }
  }
})


// Export Actions
export const { openDeleteAvatarModal, closeDeleteAvatarModal } = deleteAvatarSlice.actions

// Export Reducer
export default deleteAvatarSlice.reducer