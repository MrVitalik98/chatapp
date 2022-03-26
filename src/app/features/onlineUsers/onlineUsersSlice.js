import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  users: [],
  loading: false
}


const onlineUsersSlice = createSlice({
  name: "online-users",
  initialState,
  reducers: {
    startFetchingOnlineUsers(state) {
      return {
        ...state,
        loading: true
      }
    },
    fetchOnlineUsersSuccedded(state, { payload }) {
      return {
        ...state,
        users: payload,
        loading: false
      }
    },
    fetchOnlineUsersFailed(state) {
      return {
        ...state,
        loading: false
      }
    }
  }
})


// Export Actions
export const { startFetchingOnlineUsers, fetchOnlineUsersSuccedded, fetchOnlineUsersFailed } = onlineUsersSlice.actions

// Export Reducer
export default onlineUsersSlice.reducer