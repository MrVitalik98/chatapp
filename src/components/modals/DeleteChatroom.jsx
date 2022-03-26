import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { closeDeleteChatroomModal } from '../../app/features/modals/deleteChatroom/deleteChatroomSlice'
import { deleteChatroom } from '../../services/chatroom'
import SocketContext from '../../contexts/SocketContext'


const DeleteChatroom = () => {
  const dispatch = useDispatch()
  const { socket } = useContext(SocketContext)  
  const { chatrooms } = useSelector(state => state.chatrooms)
  const { isShow, userId } = useSelector(state => state.modals.deleteChatroom)


  const handleDeleteChatroom = async () => {
    const status = await dispatch(deleteChatroom(userId))

    status === 'success' && socket.emit('chatroom: create or remove', { roomId: userId })
    dispatch(closeDeleteChatroomModal())

    const chatroom = chatrooms.find(chatroom => chatroom.users.findIndex(user => user._id.toString() === userId.toString()) > -1)
    chatroom?._id && socket.emit('chat deleted', { chatroomId: chatroom._id })
  }


  return (
    <Modal 
      show={isShow} 
      onHide={() => dispatch(closeDeleteChatroomModal())}
    >
      <Modal.Body id="deleteChatroom">
        <img 
          src="../../assets/delete.svg" 
          alt="warning" 
          className="warning-image"
        />

        <h4 className="warning-title">Do you want to delete this chat?</h4>

        <div className="btn-group">
          <button 
            className="btn btn-secondary"
            onClick={() => dispatch(closeDeleteChatroomModal())}
          >
            Cancel
          </button>

          <button 
            className="btn btn-danger"
            onClick={handleDeleteChatroom}
          >
            Delete
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default DeleteChatroom