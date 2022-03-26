import { React } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


export default function OnlineUserItem({ user }) {
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.loader)
  const { loading: loadingUsers } = useSelector(state => state.users)
  
  const getUser = userId => navigate(`/dashboard/users/${userId}`)


  return (
    <div 
      className="user-item shadow-sm" 
      onClick={() => loading || loadingUsers ? undefined : getUser(user._id)}
    >
      <div className="user-avatar">
        <img 
          src={user.avatar} 
          alt="avatar" 
          className="avatar" 
        />

        <div className="light"></div>
      </div>

      <div className="user-info">
        <h4 className="user-name my-0">{user.fullname}</h4>
        <p className="text-success my-0">online</p>
      </div>
    </div>
  )
}