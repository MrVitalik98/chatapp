import React, { useState, useContext } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMessage } from '../../services/chatroom'
import { closeDeleteMessageModal } from '../../app/features/modals/deleteMessage/deleteMessageSlice'
import SocketContext from '../../contexts/SocketContext'


const DeleteMessage = ({ handleClosePanel }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [isCheck, setIsCheck] = useState(false)
  const { isShow, messageIDS } = useSelector(state => state.modals.deleteMessage)
  const { users } = useSelector(state => state.chatroom)
  const { user: { _id } } = useSelector(state => state.user)
  const { socket } = useContext(SocketContext)

  
  const user = users.find(user => user._id !== _id)


  const handleCloseModal = () => {
    dispatch(closeDeleteMessageModal())
    setIsCheck(false)
  }


  const handleDeleteMessage = async () => {
    setIsLoading(true)

    const userId = isCheck ? user?._id : ''
    const status = await dispatch(deleteMessage(userId))
    
    status === 'success' && isCheck && socket.emit('delete messages', { userId, messageIDS })
    
    setIsLoading(false)
    handleCloseModal()
    handleClosePanel()    
  }


  return (
    <Modal 
      show={isShow} 
      onHide={() => dispatch(closeDeleteMessageModal())}
    >
      <Modal.Body id="deleteMessage">
        <h4 className="warning-title">Delete Message?</h4>

        <div className="checkbox-block">
          <input 
            type="checkbox"
            className="form-control"
            checked={isCheck}
            onChange={() => setIsCheck(prev => !prev)}
          />

          <p>Delete also from&nbsp;
            <b className="user-name">
              <i>{user?.fullname?.split(' ')[0]}</i>
            </b>
          </p>
        </div>

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
            onClick={!isLoading ? handleDeleteMessage : undefined}
            disabled={isLoading}
          >
            Delete from me
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default DeleteMessage