import * as API from '../api-list'
import { showLoader, hideLoader } from '../../app/features/loader/loaderSlice'
import { showAlert } from '../../app/features/alert/alertSlice'
import { setUser } from '../../app/features/user/userSlice'
import { fetchUsersSuccedded } from '../../app/features/users/usersSlice'
const TOKEN_DATA = 'STORAGE/TOKEN_DATA'


export const authToken = () => {
  return async dispatch => {
    dispatch(showLoader())

    try {
      const tokenData = JSON.parse(localStorage.getItem(TOKEN_DATA))
      
      if(tokenData && tokenData?.token) {
        const { data } = await API.authToken(tokenData.token)
        const { user, token } = data

        token && localStorage.setItem(TOKEN_DATA, JSON.stringify({ token }))
        user && token && dispatch(setUser({ user, token }))
      }
    } 
    catch(e) {
      dispatch(showAlert(e?.response?.data))
    }
    finally {
      dispatch(hideLoader())
    }
  }
}


export const loginUser = form => {
  return async dispatch => {
    dispatch(showLoader())

    try {
      const { data } = await API.loginUser(form)
      const { status, user, token } = data
      const { _id, avatar, fullname } = user

      token && localStorage.setItem(TOKEN_DATA, JSON.stringify({ token }))
      user && token && dispatch(setUser({ user, token }))

      return { status, user: { _id, avatar, fullname } }
    } 
    catch(e) {
      dispatch(showAlert(e?.response?.data))
    } 
    finally {
      dispatch(hideLoader())
    }
  }
}


export const registerUser = (form) => {
  return async dispatch => {
    dispatch(showLoader())

    try {
      const { data } = await API.registerUser(form)
      
      dispatch(showAlert({ ...data }))
      return data.status
    }
    catch(e) {
      dispatch(showAlert(e?.response?.data))
    }
    finally {
      dispatch(hideLoader())
    }
  }
}


export const logout = () => {
  return dispatch => {
    localStorage.removeItem(TOKEN_DATA)
    dispatch(setUser({ user: {}, token: '', age: 0 }))
    dispatch(fetchUsersSuccedded({ users: [], total: 0, number: 5, query: '' }))
  }
}


export const resetToEmail = email => {
  return async dispatch => {
    dispatch(showLoader())

    try {
      const { data } = await API.resetToEmail(email)
      const { status, message } = data
      
      dispatch(showAlert({ status, message }))
      return status
    }
    catch(e) {
      dispatch(showAlert(e?.response?.data))
    }
    finally{
      dispatch(hideLoader())
    }
  }
}


export const checkToken = token => {
  return async dispatch => {
    dispatch(showLoader())

    try {
      await API.checkToken(token)
    }
    catch(e) {
      dispatch(showAlert(e?.response?.data))
      return e?.response?.data?.status
    }
    finally{
      dispatch(hideLoader())
    }
  }
}


export const changePassword = (token, form) => {
  return async dispatch => {
    dispatch(showLoader())

    try {
      const { data } = await API.changePassword(form, token)
      const { status, message } = data
      
      dispatch(showAlert({ status, message }))
      return status
    }
    catch(e) {
      dispatch(showAlert(e?.response?.data))
    }
    finally{
      dispatch(hideLoader())
    }
  }
}