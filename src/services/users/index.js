import * as API from '../api-list'
import { showAlert } from '../../app/features/alert/alertSlice'
import { 
  startFetchingUsers, fetchUsersSuccedded, fetchUsersFailed, search,
  startFetchingUser, fetchUserFailed, fetchUserSuccedded
} from '../../app/features/users/usersSlice'
import {
  startFetchingOnlineUsers, fetchOnlineUsersSuccedded, fetchOnlineUsersFailed
} from '../../app/features/onlineUsers/onlineUsersSlice'



export const getUsers = (number = 5) => {
  return async (dispatch, getState) => {
    const token = getState().user.token

    dispatch(search(''))
    dispatch(startFetchingUsers())

    try {
      const { data } = await API.getUsers(token, number)
      dispatch(fetchUsersSuccedded(data))
    }
    catch(e) {
      dispatch(fetchUsersFailed())
      dispatch(showAlert(e.response.data))
    }
  }
}


export const searchUsers = (query, number = 5) => {
  return async (dispatch, getState) => {
    const { token } = getState().user

    dispatch(search(query))
    dispatch(startFetchingUsers())

    try {
      const { data } = await API.searchUsers(token, number, query)
      dispatch(fetchUsersSuccedded(data))
    }
    catch(e) {
      dispatch(fetchUsersFailed())
      dispatch(showAlert(e.response.data))
    }
  }
}


export const loadMoreUsers = () => {
  return async (dispatch, getState) => {
    const { number, query } = getState().users

    try {
      query ? dispatch(searchUsers(query, number)) : dispatch(getUsers(number))
    }
    catch(e) {
      dispatch(fetchUsersFailed())
      dispatch(showAlert(e.response.data))
    }
  }
}


export const getUserById = userId => {
  return async (dispatch, getState) => {
    const { token } = getState().user
    const { dateTime } = getState().date

    dispatch(startFetchingUser())

    try{
      const { data } = await API.getUserById(token, userId)
      const { user, numberOfChats } = data

      const age = new Date(dateTime).getFullYear() - new Date(user?.birthday).getFullYear()
      user && dispatch(fetchUserSuccedded({ ...user, age, numberOfChats }))
    }
    catch(e) {
      dispatch(fetchUserFailed())
      dispatch(showAlert(e?.response?.data))
      return e?.response?.data?.status
    }
  }
}


export const getOnlineUsers = firstTime => {
  return async (dispatch, getState) => {
    const { token } = getState().user
    const { number } = getState().onlineUsers

    firstTime && dispatch(startFetchingOnlineUsers())

    try {
      const { data } = await API.getOnlineUsers(token, number)
      dispatch(fetchOnlineUsersSuccedded(data?.users))
    }
    catch(e) {
      dispatch(fetchOnlineUsersFailed())
      dispatch(showAlert(e?.response?.data))
    }
  }
}