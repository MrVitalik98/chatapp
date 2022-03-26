import React from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import NotificationItem from './NotificationItem'
import SpinnerLoader from './loaders/SpinnerLoader'


const NotificationList = ({ isOpen, closeNotificationsPanel }) => {
  const { notifications, loading } = useSelector(state => state.notifications)

  return (
    <div className={`notifications-panel ${isOpen ? 'open' : ''}`}>
      <button 
        className="btn"
        id="closePanelBtn"
        onClick={closeNotificationsPanel}
      >
        <FaTimesCircle />
      </button>

      <h2>Notifications</h2>

      {loading ? <SpinnerLoader /> : (
        notifications?.length 
          ? (
            <div className="notifications">
              {notifications?.map(notification => {
                return <NotificationItem key={notification._id} notification={notification} />
              })}
            </div>
          )
          : <h5 className="text-center text-danger mt-5">No notifications</h5>
      )}
    </div>
  )
}


export default NotificationList