import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { deleteNotification, getAllNotifications } from '../services/notifications'
import { createNewChatroom } from '../services/chatroom'
import SocketContext from '../contexts/SocketContext'


const NotificationItem = ({ notification }) => {
  const dispatch = useDispatch()
  const { _id, avatar, firstname } = notification
  const { socket } = useContext(SocketContext)


  const acceptRequest = async () => {
    const status = await dispatch(createNewChatroom(_id))
    dispatch(getAllNotifications())
    status === 'success' && socket.emit('chatroom: create or remove', { roomId: _id })
  }


  const cancelRequest = async () => {
    const status = await dispatch(deleteNotification(_id))
    dispatch(getAllNotifications())
    status === 'success' && socket.emit('notification: add or delete', { roomId: _id })
  }


  return (
    <div className="notification shadow">
      <img
        src={avatar}
        alt="user-avatar"
        className="user-avatar"
      />

      <div className="notification-details">
        <p className="message"><b>{firstname}</b> wants to add you to the chat!</p>
        
        <div className="operations">
          <button 
            className="btn btn-success"
            onClick={acceptRequest}
          >
            Accept
          </button>

          <button 
            className="btn btn-danger"
            onClick={cancelRequest}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}


export default NotificationItem