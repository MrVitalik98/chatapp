import React, { useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getOnlineUsers } from '../services/users'
import { fetchOnlineUsersSuccedded } from '../app/features/onlineUsers/onlineUsersSlice'
import OnlineUserItem from './OnlineUserItem'
import SocketContext from '../contexts/SocketContext'


const OnlineUserList = () => {
  const dispatch = useDispatch()
  const { socket } = useContext(SocketContext)
  const { user: { _id }} = useSelector(state => state.user)
  const { users, loading, number } = useSelector(state => state.onlineUsers)


  useEffect(() => {
    dispatch(getOnlineUsers(true))
  }, [dispatch, number])


  useEffect(() => {
    const getOnlineUsers = ({ onlineUsers }) => {
      const mapOnlineUsers = onlineUsers.filter(user => user?._id?.toString() !== _id?.toString())
      dispatch(fetchOnlineUsersSuccedded(mapOnlineUsers))
    }

    socket.on('get online users', getOnlineUsers)

    return () => socket.off('get online users', getOnlineUsers)
  }, [socket, dispatch, _id])


  return (
    <div className="online-users">
      <h3>Online</h3>

      <div className="online-user-list">
        {
          users?.length ? (
            users?.map(user => {
              return <OnlineUserItem 
                key={user._id} 
                user={user} 
              />
            })
          ) : !loading && <h5 className="noData text-danger">No online users</h5>
        }

        <div className={loading ? 'loader my-2' : 'd-none'}>
          <div className="spinner spinner-border text-info"></div>
        </div>
      </div>
    </div>
  )
}


export default OnlineUserList