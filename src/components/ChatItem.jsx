import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'


const ChatItem = ({ chat: { _id: chatroomId, users, messages } }) => {
  const { user: { _id } } = useSelector(state => state.user)
  const { year, month, day } = useSelector(state => state.date)
  
  const user = users?.find(user => user?._id?.toString() !== _id?.toString())
  const lastMessage = messages?.length ? messages[messages?.length - 1] : ''
  const numberOfUnreadMessages = messages?.filter(msg => !msg?.read && msg?.senderId?.toString() !== _id?.toString())?.length
  

  const getDate = date => {
    const date_ = new Date(date)
    const year_ = date_.getFullYear()
    const month_ = date_.getMonth()
    const day_ = date_.getDate()
    let hour_ = date_.getHours()
    let minute_ = date_.getMinutes()

    const d = date_?.toJSON()?.split('T')
    let time = d ? d[0]?.split('-')?.reverse()?.join('.') : ''

    hour_ = +hour_ < 10 ? '0' + hour_ : hour_
    minute_ = +minute_ < 10 ? '0' + minute_ : minute_
 
    if(year === year_ && month === month_) {
      if(day === day_) {
        time = `${hour_}:${minute_}`
      }

      else if(day - day_ === 1) {
        time = 'yesterday'
      }
    }

    return time
  }


  return (
    <NavLink 
      to={`/dashboard/chats/${chatroomId}`}
      className={({ isActive }) => `user-item shadow-sm ${isActive ? "active-chatroom" : ''}`}
    >
      <div className="user-avatar">
        <img 
          src={user?.avatar} 
          alt="avatar" 
          className="avatar" 
        />
      </div>
      
      <div className="user-info">
        <h4 className="user-name">{user?.fullname}</h4>
        {
          numberOfUnreadMessages 
            ? <div className="numberOfUnreadMessages bg-success">
                <p>{numberOfUnreadMessages}</p>
              </div> 
            : ''
        }
        {
          lastMessage ? (
            <>
              <p className="date">{getDate(lastMessage?.createdAt)}</p>
              <p className="last-message">{lastMessage?.msg}</p>
            </>
          ) : ''
        }
      </div>
    </NavLink>
  )
}


export default ChatItem