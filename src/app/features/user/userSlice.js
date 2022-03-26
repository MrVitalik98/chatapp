import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: {
    _id: '',
    avatar: '',
    fullname: '',
    firstname: '',
    lastname: '',
    email: '',
    gender: '',
    birthday: '',
    resetToken: '',
  },
  token: '',
  age: 0
}


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    setAge(state, { payload }) {
      return {
        ...state,
        age: payload
      }
    }
  }
})


// Export Actions
export const { setUser, setAge } = userSlice.actions

// Export Reducer
export default userSlice.reducer