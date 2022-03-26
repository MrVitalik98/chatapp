import * as API from '../api-list'
import { setUser } from '../../app/features/user/userSlice'
import { showLoader, hideLoader } from '../../app/features/loader/loaderSlice'
import { showAlert } from '../../app/features/alert/alertSlice'
import { logout } from '../auth'


export const editUserData = form => {
  return async (dispatch, getState) => {
    const { token } = getState().user
    dispatch(showLoader())

    try {
      const { data } = await API.editUserData(form, token)
      const { status, message, user } = data

      dispatch(showAlert({ status, message }))

      user && dispatch(setUser({ user }))
    }
    catch(e) {
      dispatch(showAlert(e.response.data))
    }
    finally{
      dispatch(hideLoader())
    }
  }
}


export const uploadAvatar = file => {
  return async (dispatch, getState) => {
    const token = getState().user.token
    dispatch(showLoader())

    const form = new FormData()
    const mimeTypes = [ 'image/png', 'image/jpg', 'image/jpeg' ]
    const maxSize = 1024 * 1024 * 3

    if(!mimeTypes.includes(file.type)) {
      dispatch(showAlert({ status: 'error', message: 'File type is wrong' }))
      return
    }

    if(maxSize < file.size) {
      dispatch(showAlert({ status: 'error', message: 'Max size 3 mb'}))
      return 
    }

    form.append('avatar', file)

    try {
      const { data } = await API.uploadAvatar(form, token)
      const { status, message, user } = data

      dispatch(showAlert({ status, message }))
      user && dispatch(setUser({ user }))
    }
    catch(e) {
      dispatch(showAlert(e.response.data))
    }
    finally{
      dispatch(hideLoader())
    }
  }
}


export const deleteAvatar = () => {
  return async (dispatch, getState) => {
    const token = getState().user.token
    dispatch(showLoader())

    try {
      const { data } = await API.deleteAvatar(token)
      const { status, message, user } = data

      dispatch(showAlert({ status, message }))
      user && dispatch(setUser({ user }))
    }
    catch(e) {
      dispatch(showAlert(e.response.data))
    }
    finally {
      dispatch(hideLoader())
    }
  }
}


export const deleteAccount = () => {
  return async (dispatch, getState) => {
    const token = getState().user.token
    dispatch(showLoader())

    try {
      const { data } = await API.deleteAccount(token)
      const { status, message } = data

      dispatch(showAlert({ status, message }))
      status === 'success' && dispatch(logout())
    }
    catch(e) {
      dispatch(showAlert(e.response.data))
    }
    finally{
      dispatch(hideLoader())
    }
  }
}
