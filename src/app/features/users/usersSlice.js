import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  loading: false,
  total: 0,
  number: 7,
  query: '',
  user: {
    age: 0,
    fullname: '',
    avatar: '',
    birthday: '',
    loading: false,
    numberOfChats: 0
  }
}


const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    startFetchingUsers(state) {
      return {
        ...state,
        loading: true
      }
    },
    fetchUsersSuccedded(state, { payload }) {
      return {
        ...state,
        ...payload,
        loading: false
      }
    },
    fetchUsersFailed(state) {
      return {
        ...state,
        loading: false
      }
    },
    setNumber(state) {
      return {
        ...state,
        number: +state.number + 7
      }
    },
    search(state, { payload }) {
      return {
        ...state,
        query: payload
      }
    },
    startFetchingUser(state) {
      state.user.loading = true
    },
    fetchUserSuccedded(state, { payload }) {
      return {
        ...state,
        user: {
          ...payload,
          loading: false
        }
      }
    },
    fetchUserFailed(state) {
      state.user.loading = false
    }
  }
})


// Export Actions
export const { 
  startFetchingUsers, fetchUsersSuccedded, fetchUsersFailed, setNumber, 
  search, startFetchingUser, fetchUserSuccedded, fetchUserFailed 
} = usersSlice.actions

// Export Reducer
export default usersSlice.reducer