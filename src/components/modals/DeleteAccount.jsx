import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { closeDeleteAccountModal } from '../../app/features/modals/deleteAccount/deleteAccountSlice'
import { deleteAccount } from '../../services/account'
import SocketContext from '../../contexts/SocketContext'


const DeleteAccount = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { socket } = useContext(SocketContext)
  const { isShow } = useSelector(state => state.modals.deleteAccount)


  const handleDeleteAccount = () => {
    dispatch(deleteAccount())
    dispatch(closeDeleteAccountModal())
    setTimeout(() => navigate('/auth/login'), 500)

    socket.emit('fetch users and chatrooms')
    socket.emit('user deleted account')
    socket.disconnect()
  }


  return (
    <Modal 
      show={isShow} 
      onHide={() => dispatch(closeDeleteAccountModal())}
    >
      <Modal.Body id="deleteAccount">
        <img 
          src="../assets/warning.svg" 
          alt="warning" 
          className="warning-image"
        />

        <h4 className="warning-title">Account will be permanently deleted!</h4>

        <div className="btn-group">
          <button 
            className="btn btn-secondary"
            onClick={() => dispatch(closeDeleteAccountModal())}
          >
            Cancel
          </button>

          <button 
            className="btn btn-success"
            onClick={handleDeleteAccount}
          >
            Continue
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default DeleteAccount