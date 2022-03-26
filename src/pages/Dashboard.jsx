import React, { useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { date } from '../services/date'
import { setAge } from '../app/features/user/userSlice'
import SidebarLeft from '../components/SidebarLeft'
import SidebarRight from '../components/SidebarRight'
import Profile from '../components/Profile'
import Settings from '../components/Settings'
import Loader from '../components/loaders/Loader'
import User from '../components/User'
import Chatroom from '../components/Chatroom'
import PageNotFound from '../components/PageNotFound'
import SocketContext from '../contexts/SocketContext'


const Main = ({ children }) => {
  const dispatch = useDispatch()
  const { socket } = useContext(SocketContext)
  const { user: { birthday, _id, fullname, avatar } } = useSelector(state => state.user)
  const { dateTime } = useSelector(state => state.date)
  const { loading } = useSelector(state => state.loader)


  useEffect(() => {
    dispatch(date())
  }, [dispatch])


  useEffect(() => {
    socket.emit('user connected', { avatar, fullname, _id })
  }, [socket, _id, avatar, fullname])


  useEffect(() => {
    if(dateTime) {
      const age = new Date(dateTime).getFullYear() - new Date(birthday).getFullYear()
      dispatch(setAge(age))
    }
  }, [dispatch, dateTime, birthday])



  return (
    <>
      {loading ? <Loader /> : ''}

      <div className="dashboard">
        <SidebarLeft />
          
          {children}
      
        <SidebarRight />
      </div>
    </>
  )
}


const Dashboard = () => {
  const pathname = 'profile'
  
  return (
    <Routes>
      <Route path="/" element={<PageNotFound pathname={pathname} />} />
      <Route path="profile" element={<Main children={<Profile />} />} />
      <Route path="settings" element={<Main children={<Settings />} />} />
      <Route path="users/:id" element={<Main children={<User />} />} />
      <Route path="chats/:chatroomId" element={<Main children={<Chatroom />} />} />
      <Route path="*" element={<PageNotFound pathname={pathname} />} />
    </Routes>
  )
}


export default Dashboard