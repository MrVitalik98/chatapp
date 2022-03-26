import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { getChatrooms, searchChatrooms } from '../services/chatrooms'
import ChatList from './ChatList'
import Online from './OnlineUserList'


const SidebarRight = () => {
  const dispatch = useDispatch()
  const [query, setQuery] = useState('')
  const { loading } = useSelector(state => state.chatrooms)


  const handleSubmit = e => {
    e.preventDefault()
    query ? dispatch(searchChatrooms(query)) : dispatch(getChatrooms(true))
    document.querySelector('.chat-list').scrollTo(0, 0)
  }


  return (
    <div className="sidebar-right">
      <h3>Chats</h3>

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

      <div className="grid">
        <ChatList />
        <Online />
      </div>
    </div>
  )
}


export default SidebarRight