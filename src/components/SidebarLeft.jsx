import React, { useState, useEffect, useContext, useCallback } from 'react'
import { FaUser, FaBell, FaCog, FaSignOutAlt, FaSearch } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../services/auth'
import { searchUsers, getUsers } from '../services/users'
import { getNewNotificationsCount, getAllNotifications } from '../services/notifications'
import NotificationList from './NotificationList'
import SocketContext from '../contexts/SocketContext'
import DeleteChatroom from './modals/DeleteChatroom'
import UserList from './UserList'


const SidebarLeft = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { socket } = useContext(SocketContext)
  const { message } = useSelector(state => state.alert)
  const { user: { fullname, avatar }, age } = useSelector(state => state.user)
  const { newNotificationsCount } = useSelector(state => state.notifications)
  const { loading } = useSelector(state => state.users)


  useEffect(() => {
    dispatch(getNewNotificationsCount())
  }, [dispatch])


  const handleLogout = useCallback(() => {
    dispatch(logout())
    socket.disconnect()
    navigate('/auth/login')
  }, [socket, dispatch, navigate])


  useEffect(() => {
    message === 'jwt expired' && handleLogout()
  }, [message, handleLogout])


  const openNotificationsPanel = () => {
    setIsOpen(true)
    dispatch(getAllNotifications())
  }


  const closeNotificationsPanel = () => setIsOpen(false)

  
  const handleSubmit = e => {
    e.preventDefault()
    query ? dispatch(searchUsers(query)) : dispatch(getUsers())
    document.querySelector('.user-list').scrollTo(0, 0)
  }


  return (
    <div className="sidebar-left">
      <div className="user">
        <img 
          src={avatar} 
          alt="avatar" 
          className="avatar" 
        />

        <h4 className="user-name">{fullname}</h4>
        <h6 className="user-age">{age ? `${age} age` : ''}</h6>
      </div>

      <div className="btn-group">
        <NavLink 
          to={loading ? "#" : "/dashboard/profile"}
          className={`btn btn-dark ${loading ? "disabled" : ""}`}
          end
        >
          <FaUser />
        </NavLink>

        <button 
          className="btn btn-dark"
          onClick={openNotificationsPanel}
          disabled={loading}  
        >
          <FaBell />
          {newNotificationsCount ? <span id="newNotificationsCount" className="badge badge-pill badge-danger">{newNotificationsCount}</span> : ''}
        </button>

        <NavLink 
          to={loading ? "#" : "/dashboard/settings"}
          className={`btn btn-dark ${loading ? "disabled" : ""}`}
        >
          <FaCog />
        </NavLink>

        <button 
          className="btn btn-dark"
          onClick={handleLogout}
          disabled={loading}
        >
          <FaSignOutAlt />
        </button>
      </div>

      <div className="users">
        <form onSubmit={loading ? undefined : handleSubmit}>
          <div className="input-group">
            <input 
              type="search" 
              className="form-control" 
              placeholder="Search..."
              disabled={loading} 
              value={query}
              onChange={e => setQuery(e.target.value)}
            />

            <div className="input-group-append">
              <button 
                type="submit" 
                className="btn btn-secondary"
                disabled={loading}
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </form>
        
        <UserList />
      </div>

      <NotificationList 
        isOpen={isOpen}
        closeNotificationsPanel={closeNotificationsPanel}
      />

      <DeleteChatroom />
    </div>
  )
}


export default SidebarLeft