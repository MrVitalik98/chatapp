import 'react-toastify/dist/ReactToastify.css'
import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { hideAlert } from '../app/features/alert/alertSlice'


function Toast() {
  const dispatch = useDispatch()
  const { message, status } = useSelector(state => state.alert)

  
  useEffect(() => {
    if(message && status) {
      return toast[status](message, {
        onClose() {
          dispatch(hideAlert())
        }
      })
    }

    return 
  }, [status, message, dispatch])


  return <ToastContainer autoClose={3000}/>
}

export default Toast