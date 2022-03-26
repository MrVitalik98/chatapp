import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { closeDeleteAvatarModal } from '../../app/features/modals/deleteAvatar/deleteAvatarSlice'
import { deleteAvatar } from '../../services/account'


const DeleteAvatar = () => {
  const dispatch = useDispatch()
  const { isShow } = useSelector(state => state.modals.deleteAvatar)


  const handleDeleteAvatar = () => {
    dispatch(deleteAvatar())
    dispatch(closeDeleteAvatarModal())
  }


  return (
    <Modal 
      show={isShow} 
      onHide={() => dispatch(closeDeleteAvatarModal())}
    >
      <Modal.Body id="deleteAvatar">
        <img 
          src="../assets/delete.svg" 
          alt="warning" 
          className="warning-image"
        />

        <h4 className="warning-title">Do you want to delete this avatar?</h4>

        <div className="btn-group">
          <button 
            className="btn btn-secondary"
            onClick={() => dispatch(closeDeleteAvatarModal())}
          >
            Cancel
          </button>

          <button 
            className="btn btn-success"
            onClick={handleDeleteAvatar}
          >
            Continue
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default DeleteAvatar