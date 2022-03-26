import React, { useRef } from 'react'
import { FaEdit } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { Dropdown } from 'react-bootstrap'
import { uploadAvatar } from '../services/account'
import { openDeleteAvatarModal } from '../app/features/modals/deleteAvatar/deleteAvatarSlice'
import DeleteAvatar from './modals/DeleteAvatar'


const Profile = () => {
  const fileInputRef = useRef('')
  const dispatch = useDispatch()
  const { user: { fullname, email, avatar } } = useSelector(state => state.user)


  const handleSelectFile = () => {
    fileInputRef.current.click()
  }

  
  const handleUploadFile = e => {
    const file = e.target.files[0]
    file && dispatch(uploadAvatar(file))
  }


  return (
    <>
      <div className="account">
        <div className="user-avatar">
          <img 
            src={avatar}
            alt="avatar" 
            className="avatar" 
          />

          <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">
              <FaEdit />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item 
                as="div"
                id="upload"
                onClick={handleSelectFile}
              >
                Upload 
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="d-none"
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={handleUploadFile}
                />
              </Dropdown.Item>

              {!avatar.split('/gender')[1] ? (
                <Dropdown.Item 
                  as="button"
                  onClick={() => dispatch(openDeleteAvatarModal())}
                  id="delete"
                >
                  Delete
                </Dropdown.Item>
              ) : ''}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        
        <h2 className="user-name">{fullname}</h2>
        <h6 className="user-email">{email}</h6>
      </div>

      <DeleteAvatar />
    </>
  )
}


export default Profile