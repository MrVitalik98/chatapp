import React, { useRef, useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNumber } from '../app/features/users/usersSlice'
import { loadMoreUsers  } from '../services/users'
import { getNewNotificationsCount } from '../services/notifications'
import SocketContext from '../contexts/SocketContext'
import UserItem from './UserItem'


const UserList = () => {
  const dispatch = useDispatch()
  const userListRef = useRef()
  const { socket } = useContext(SocketContext)
  const { users, number, total, loading } = useSelector(state => state.users)


  useEffect(() => {
    dispatch(loadMoreUsers())
  }, [dispatch, number])


  useEffect(() => {
    const fetchNotifications = () => {
      dispatch(loadMoreUsers()) 
      dispatch(getNewNotificationsCount())
    }

    socket.on('fetch notifications', fetchNotifications)

    return () => socket.off('fetch notifications', fetchNotifications)
  }, [dispatch, socket])

  
  const handleScroll = () => {
    const scrollHeight = userListRef.current.scrollHeight
    const offsetHeight = userListRef.current.offsetHeight
    const scrollTop = userListRef.current.scrollTop
    
    if(scrollTop >= scrollHeight - offsetHeight && total > number) {
      dispatch(setNumber())
    }
  }


  return (
    <div 
      ref={userListRef}
      className="user-list" 
      onScroll={loading ? undefined : handleScroll}
    >
      {
        users?.length 
        ? (
          users?.map(user => {
            return <UserItem key={user._id} user={user} />
          })
        ) 
        : !loading && <h5 className="noData text-danger">No users</h5>
      }
      
      <div className={loading ? 'loader my-2' : 'd-none'}>
        <div className="spinner spinner-border text-info"></div>
      </div>
    </div>
  )
}


export default UserList