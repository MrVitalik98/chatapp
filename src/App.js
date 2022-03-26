import React, { useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { authToken } from './services/auth'
import { useDataHook } from './hooks/DataHook'
import Routes from './Routes'
import Toast from './components/Toast'
import SocketContext from './contexts/SocketContext'
import DataContext from './contexts/DataContext'


const App = () => {
  const dispatch = useDispatch()
  const socketClientRef = useRef()
  const { loading } = useSelector(state => state.loader)
  const { messageSent, setMessageSending, isOpenSelectedMessagesPanel, setIsOpenSelectedMessagesPanel } = useDataHook()
  

  useEffect(() => {
    const client = io(process.env.REACT_APP_API_URL)

    client.connect()

    client.on("disconnect", reason => {
      if (['io server disconnect'].includes(reason)) {
        client.connect()
      }
    })

    socketClientRef.current = client
    window.addEventListener('unload', () => client.disconnect())

    return () => client.close()
  }, [])
  

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : 'auto'
  }, [loading])  

  
  useEffect(() => {
    dispatch(authToken())
  }, [dispatch])
 

  return (
    <SocketContext.Provider value={{ socket: socketClientRef.current }}>
      <DataContext.Provider value={{ messageSent, setMessageSending , isOpenSelectedMessagesPanel, setIsOpenSelectedMessagesPanel }}>
        <Toast />
        <Routes />
      </DataContext.Provider>
    </SocketContext.Provider>
  )
}


export default App