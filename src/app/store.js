import { configureStore, combineReducers } from '@reduxjs/toolkit'
import alertReducer from './features/alert/alertSlice'
import userReducer from './features/user/userSlice'
import loaderReducer from './features/loader/loaderSlice'
import dateReducer from './features/date/dateSlice'
import usersReducer from './features/users/usersSlice'
import onlineUsersReducer from './features/onlineUsers/onlineUsersSlice'
import notificationsReducer from './features/notifications/notificationsSlice'
import chatroomsReducer from './features/chatrooms/chatroomsSlice'
import chatroomReducer from './features/chatroom/chatroomSlice'
import modals from './features/modals'


// Root Reducer
const reducer = combineReducers({
  alert: alertReducer,
  user: userReducer,
  users: usersReducer,
  loader: loaderReducer,
  date: dateReducer,
  chatrooms: chatroomsReducer,
  notifications: notificationsReducer,
  onlineUsers: onlineUsersReducer,
  chatroom: chatroomReducer,
  modals
})


export default configureStore({
  reducer,
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware({ 
      serializableCheck: false,
      immutableCheck: false
    })
})