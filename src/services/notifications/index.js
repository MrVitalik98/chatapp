import * as API from '../api-list'
import { showAlert } from '../../app/features/alert/alertSlice'
import { startFetchingNotifications, fetchNotificationsSuccedded, fetchNotificationsFailed, setNewNotificationsCount } from '../../app/features/notifications/notificationsSlice'


export const getAllNotifications = () => {
  return async (dispatch, getState) => {
    const { token } = getState().user

    dispatch(startFetchingNotifications())

    try {
      const { data } = await API.getAllNotifications(token)
      const { notifications } = data
      dispatch(fetchNotificationsSuccedded(notifications))
    }
    catch(e) {
      dispatch(fetchNotificationsFailed())
      dispatch(showAlert(e.response.data))
    }
  }
}


export const addNewNotification = userId => {
  return async (dispatch, getState) => {
    const { token } = getState().user

    try {
      const { data } = await API.addNotification(token, userId)
      const { status } = data
      return status
    }
    catch(e) {
      dispatch(showAlert(e.response.data))
    }
  }
}


export const getNewNotificationsCount = () => {
  return async (dispatch, getState) => {
    const { token } = getState().user

    try {
      const { data } = await API.getNewNotifications(token)
      const { count } = data
      dispatch(setNewNotificationsCount(count))
    }
    catch(e) {
      dispatch(showAlert(e.response.data))
    }
  }
}


export const deleteNotification = userId => {
  return async (dispatch, getState) => {
    const { token } = getState().user

    try {
      const { data } = await API.deleteNotification(token, userId)
      const { status } = data
      return status
    }
    catch(e) {
      dispatch(showAlert(e.response.data))
    }
  }
}