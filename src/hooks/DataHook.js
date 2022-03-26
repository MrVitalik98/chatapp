import { useState } from 'react'


export const useDataHook = () => {
  const [messageSent, setMessageSending] = useState(true)
  const [isOpenSelectedMessagesPanel, setIsOpenSelectedMessagesPanel] = useState(false)


  return {
    messageSent, setMessageSending , 
    isOpenSelectedMessagesPanel, setIsOpenSelectedMessagesPanel
  }
}