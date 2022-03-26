import { createContext } from 'react'


export default createContext({
  key: '',
  messageSent: true,
  isOpenSelectedMessagesPanel: false,
  setMessageSending() {},
  setIsOpenSelectedMessagesPanel() {}
})