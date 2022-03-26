import React, { useState, useContext } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { clearChat } from '../../services/chatroom'
import { closeClearChatModal } from '../../app/features/modals/clearChat/clearChatSlice'
import SocketContext from '../../contexts/SocketContext'


const ClearChat = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const { isShow, chatroomId } = useSelector(state => state.modals.clearChat)
  const { users } = useSelector(state => state.chatroom)
  const { user: { _id } } = useSelector(state => state.user)
  const { socket } = useContext(SocketContext)

  
  const user = users.find(user => user._id !== _id)


  const handleCloseModal = () => {
    dispatch(closeClearChatModal())
  }


  const handleClearChat = async () => {
    setIsLoading(true)

    const status = await dispatch(clearChat(chatroomId))
    
    status === 'success' && socket.emit('clear chat', { userId: user?._id })
    
    handleCloseModal() 
    setIsLoading(false)
  }


  return (
    <Modal 
      show={isShow} 
      onHide={() => dispatch(closeClearChatModal())}
    >
      <Modal.Body id="clearChat">
        <h4 className="warning-title">Do you want to clear chat?</h4>

        <div className="btn-group">
          <button 
            className="btn btn-light text-success border"
            onClick={!isLoading ? handleCloseModal : undefined}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button 
            className="btn btn-success"
            onClick={!isLoading ? handleClearChat : undefined}
            disabled={isLoading}
          >
            Clear Chat
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default ClearChat