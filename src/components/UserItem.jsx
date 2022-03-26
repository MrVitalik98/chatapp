import React, { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addNewNotification, deleteNotification } from '../services/notifications'
import { openDeleteChatroomModal } from '../app/features/modals/deleteChatroom/deleteChatroomSlice'
import { createNewChatroom } from '../services/chatroom'
import SocketContext from '../contexts/SocketContext'


export default function UserItem({ user }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { socket } = useContext(SocketContext)
  const { loading } = useSelector(state => state.loader)
  const { loading: loadingUsers } = useSelector(state => state.users)


  const getUser = userId => navigate(`/dashboard/users/${userId}`)


  const sendRequestAddToChat = async e => {
    e.stopPropagation()
    const status = await dispatch(addNewNotification(user._id))
    
    status === 'success' && socket.emit('notification: add or delete', { roomId: user._id })
  }


  const acceptRequest = async e => {
    e.stopPropagation()
    const status = await dispatch(createNewChatroom(user._id))

    status === 'success' && socket.emit('chatroom: create or remove', { roomId: user._id })
  }


  const cancelRequest = async e => {
    e.stopPropagation()
    const status = await dispatch(deleteNotification(user._id))

    status === 'success' && socket.emit('notification: add or delete', { roomId: user._id })
  }


  const deleteChatroom = e => {
    e.stopPropagation()
    dispatch(openDeleteChatroomModal(user._id))
  }


  return (
    <div 
      className="user-item shadow-sm" 
      onClick={() => loading || loadingUsers ? undefined : getUser(user._id)}
    >
      <img 
        src={user.avatar} 
        alt="avatar" 
        className="user-avatar" 
      />

      <div className="user-info">
        <h4 className="user-name">{user.fullname}</h4>
        {
          user?.haveChat ? (
            <button 
              className="btn btn-outline-danger"
              disabled={loading || loadingUsers}
              onClick={deleteChatroom}
            >
              Delete Chat
            </button>
          ) : (
            user?.role 
              ? (
                user.role === 'recipient' 
                  ? (
                    <div className="btn-group">
                      <button 
                        className="btn btn-success"
                        disabled={loading || loadingUsers}
                        onClick={acceptRequest}
                      >
                        Accept
                      </button>
  
                      <button 
                        className="btn btn-danger"
                        disabled={loading || loadingUsers}
                        onClick={cancelRequest}
                      >
                        Cancel
                      </button>
                    </div>
                  )
                  : (
                    <button 
                      className="btn btn-danger"
                      disabled={loading || loadingUsers}
                      onClick={cancelRequest}
                    >
                      Cancel request
                    </button>
                  )
              ) 
              : (
                <button 
                  className="btn btn-primary"
                  disabled={loading || loadingUsers}
                  onClick={sendRequestAddToChat}
                >
                  Add to Chat
                </button>
              )
          )
        }
      </div>
    </div>
  )
}