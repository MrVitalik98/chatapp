import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  newNotificationsCount: 0,
  notifications: [],
  loading: false
}


const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    startFetchingNotifications(state) {
      state.loading = true
    },
    fetchNotificationsSuccedded(state, { payload }) {
      return {
        ...state,
        notifications: payload,
        newNotificationsCount: 0,
        loading: false
      }
    },
    fetchNotificationsFailed(state) {
      state.loading = false
    },
    setNewNotificationsCount(state, { payload }) {
      state.newNotificationsCount = payload
    }
  }
})


// Export Actions
export const { 
  startFetchingNotifications, 
  fetchNotificationsSuccedded, 
  fetchNotificationsFailed, 
  setNewNotificationsCount
} = notificationsSlice.actions

// Export Reducer
export default notificationsSlice.reducer