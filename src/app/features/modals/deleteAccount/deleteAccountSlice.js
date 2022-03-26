import { createSlice } from '@reduxjs/toolkit'


const deleteAccountSlice = createSlice({
  name: 'delete-avatar',
  initialState: { isShow: false },
  reducers: {
    openDeleteAccountModal(state) {
      return { isShow: true }
    },
    closeDeleteAccountModal(state) {
      return { isShow: false }
    }
  }
})


// Export Actions
export const { openDeleteAccountModal, closeDeleteAccountModal } = deleteAccountSlice.actions

// Export Reducer
export default deleteAccountSlice.reducer