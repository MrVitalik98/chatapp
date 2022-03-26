import { combineReducers } from '@reduxjs/toolkit'
import deleteAvatarReducer from './deleteAvatar/deleteAvatarSlice'
import deleteAccountReducer from './deleteAccount/deleteAccountSlice'
import deleteMessageReducer from './deleteMessage/deleteMessageSlice'
import clearChatReducer from './clearChat/clearChatSlice'
import deleteChatroomReducer from './deleteChatroom/deleteChatroomSlice'


export default combineReducers({
  deleteAvatar: deleteAvatarReducer,
  deleteAccount: deleteAccountReducer,
  deleteMessage: deleteMessageReducer,
  clearChat: clearChatReducer,
  deleteChatroom: deleteChatroomReducer
})