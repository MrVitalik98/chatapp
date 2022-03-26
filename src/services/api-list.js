import axios from 'axios'

// API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

// Request Header
const requestHeader = (token, params) => {
  const headers = { 'Authorization': `Bearer ${token}` }

  params?.forEach(([key, value]) => headers[key] = value)
  
  return { headers }
}


// Get IP ADDRESS
export const getIpAddress = () => axios.get('https://api.db-ip.com/v2/free/self')

// Date API
export const getDate = ipAddress => axios.get(`https://www.timeapi.io/api/Time/current/ip?ipAddress=${ipAddress}`)

// Auth API`s
export const checkToken = token => api.get(`/auth/new-password?token=${token}`)
export const loginUser = data => api.post('/auth/login', data)
export const registerUser = data => api.post('/auth/register', data)
export const authToken = token => api.post('/auth/token', { token })
export const resetToEmail = email => api.post('/auth/reset', { email })
export const changePassword = (data, token) => api.post(`/auth/new-password?token=${token}`, data)

// Account API`s
export const editUserData = (data, token) => api.post('/account/settings', data, requestHeader(token))
export const uploadAvatar = (data, token) => api.post('/account/avatar/upload', data, requestHeader(token, [['Content-Type', 'multipart/form-data']]))
export const deleteAvatar = token => api.delete('/account/avatar/delete', requestHeader(token))
export const deleteAccount = token => api.delete('/account/delete', requestHeader(token))

// Users API`s
export const getUsers = (token, number) => api.get(`/users?number=${number}`, requestHeader(token))
export const searchUsers = (token, number, query) => api.get(`/users/search?query=${query}&number=${number}`, requestHeader(token))
export const getUserById = (token, userId) => api.get(`/users/${userId}`, requestHeader(token))
export const getOnlineUsers = token => api.get(`/users/online`, requestHeader(token))

// Notification API`s
export const getAllNotifications = token => api.get('/notifications', requestHeader(token))
export const getNewNotifications = token => api.get('/notifications/new', requestHeader(token))
export const addNotification = (token, userId) => api.post('/notifications/add', { userId }, requestHeader(token))
export const deleteNotification = (token, userId) => api.delete(`/notifications/${userId}`, requestHeader(token))

// Chatroom API`s
export const getChatrooms = (token, number) => api.get(`/chatrooms?number=${number}`, requestHeader(token))
export const getChatroom = (token, chatroomId) => api.get(`/chatrooms/${chatroomId}`, requestHeader(token))
export const searchChatrooms = (token, number, query) => api.get(`/chatrooms/search?number=${number}&query=${query}`, requestHeader(token))
export const createNewChatroom = (token, userId) => api.post('/chatrooms/create', { userId }, requestHeader(token))
export const addNewMessage = (token, chatroomId, data) => api.post(`/chatrooms/${chatroomId}/messages`, data, requestHeader(token))
export const deleteMessage = (token, chatroomId, data) => api.put(`/chatrooms/${chatroomId}/messages`, data, requestHeader(token))
export const deleteChatroom = (token, userId) => api.delete(`/chatrooms?userId=${userId}`, requestHeader(token))
export const clearChat = (token, chatroomId) => api.delete(`/chatrooms/${chatroomId}/clear`, requestHeader(token))