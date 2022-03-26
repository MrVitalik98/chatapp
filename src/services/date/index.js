import * as API from '../api-list'
import { setDate } from '../../app/features/date/dateSlice'
import { showAlert } from '../../app/features/alert/alertSlice'


export const date = () => {
  return async dispatch => {
    try {
      const { data } = await API.getDate()
      dispatch(setDate(data))
    } 
    catch(e) {
      dispatch(showAlert({ status: 'error', message: e.message }))
    }
  }
}