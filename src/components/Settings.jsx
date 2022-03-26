import React, { useEffect, useState, useRef } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { editUserData } from '../services/account'
import { openDeleteAccountModal } from '../app/features/modals/deleteAccount/deleteAccountSlice'
import DeleteAccount from './modals/DeleteAccount'


const initialState = {
  firstname: '',
  lastname: '',
  email: '',
  birthday: '',
  gender: '',
  currentPassword: '',
  newPassword: '',
  repeatNewPassword: ''
}


const Settings = () => {
  const dispatch = useDispatch()
  const currentPasswordInputRef = useRef('')
  const newPasswordInputRef = useRef('')
  const repeatNewPasswordInputRef = useRef('')
  const { user } = useSelector(state => state.user)
  const { loading } = useSelector(state => state.loader)
  const [userData, setUserData] = useState(initialState)
  const [isSeeCurrentPassword, setIsSeeCurrentPassword] = useState(false)
  const [isSeeNewPassword, setIsSeeNewPassword] = useState(false)
  const [isSeeRepeatNewPassword, setIsSeeRepeatNewPassword] = useState(false)


  useEffect(() => {
    setUserData({ 
      ...initialState,
      ...user,
      birthday: user.birthday?.split('T')[0]
    })
  }, [user])


  const seeCurrentPassword = () => {
    setIsSeeCurrentPassword(!isSeeCurrentPassword)
    currentPasswordInputRef.current.type = !isSeeCurrentPassword ? 'text' : 'password'
  }

  const seeNewPassword = () => {
    setIsSeeNewPassword(!isSeeNewPassword)
    newPasswordInputRef.current.type = !isSeeNewPassword ? 'text' : 'password'
  }

  const seeRepeatNewPassword = () => {
    setIsSeeRepeatNewPassword(!isSeeRepeatNewPassword)
    repeatNewPasswordInputRef.current.type = !isSeeRepeatNewPassword ? 'text' : 'password'
  }

  const handleChange = e => {
    const { value, name } = e.target
    setUserData({
      ...userData,
      [name]: value
    })
  }

  
  const handleSubmit = e => {
    e.preventDefault()
    dispatch(editUserData(userData))
  }


  return (
    <>
      <div className="settings">
        <div className="container">
          <h3 className="title">Settings</h3>

          <form onSubmit={loading ? undefined : handleSubmit}>
            <div className="row">
              <div className="input-group col-12 col-md-6">
                <label htmlFor="firstname">First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="input-group col-12 col-md-6">
                <label htmlFor="lastname">Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="input-group col-12 col-md-6">
                <label htmlFor="birthday">Birthday:</label>
                <input
                  type="date"
                  className="form-control"
                  id="birthday"
                  name="birthday"
                  value={userData.birthday}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="input-group col-12 col-md-6">
                <label htmlFor="gender">Gender:</label>
                <select
                  id="gender"
                  name="gender"
                  className="form-control custom-select"
                  value={userData.gender}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={userData.email}
                disabled
              />
            </div>

            <div className="input-group">
              <label htmlFor="currentPassword">Current Password:</label>

              <div className="input-container">
                <input
                  type="password"
                  className="form-control"
                  id="currentPassword"
                  name="currentPassword"
                  ref={currentPasswordInputRef}
                  value={userData.currentPassword}
                  onChange={handleChange}
                  placeholder="*******************"
                  disabled={loading}
                />

                <div className="input-group-append">
                  <label>
                    {
                      isSeeCurrentPassword
                        ? (
                            <FaRegEye 
                              className="text-secondary" 
                              onClick={seeCurrentPassword}
                            />
                          )
                        : (
                            <FaRegEyeSlash 
                              className="text-secondary"
                              onClick={seeCurrentPassword}
                            />
                          )
                    }
                  </label>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="newPassword">New Password:</label>

              <div className="input-container">
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  name="newPassword"
                  ref={newPasswordInputRef}
                  value={userData.newPassword}
                  onChange={handleChange}
                  placeholder="*******************"
                  disabled={loading}
                />
                
                <div className="input-group-append">
                  <label>
                    {
                      isSeeNewPassword
                        ? (
                            <FaRegEye 
                              className="text-secondary" 
                              onClick={seeNewPassword}
                            />
                          )
                        : (
                            <FaRegEyeSlash 
                              className="text-secondary"
                              onClick={seeNewPassword}
                            />
                          )
                    }
                  </label>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="repeatNewPassword">Repeat New Password:</label>

              <div className="input-container">
                <input
                  type="password"
                  className="form-control"
                  id="repeatNewPassword"
                  name="repeatNewPassword"
                  ref={repeatNewPasswordInputRef}
                  value={userData.repeatNewPassword}
                  onChange={handleChange}
                  placeholder="*******************"
                  disabled={loading}
                />

                <div className="input-group-append">
                  <label>
                    {
                      isSeeRepeatNewPassword
                        ? (
                            <FaRegEye 
                              className="text-secondary" 
                              onClick={seeRepeatNewPassword}
                            />
                          )
                        : (
                            <FaRegEyeSlash 
                              className="text-secondary"
                              onClick={seeRepeatNewPassword}
                            />
                          )
                    }
                  </label>
                </div>
              </div>
            </div>

            <div className="btn-group">
              <button 
                type="button"
                className="btn btn-danger"
                disabled={loading}
                onClick={() => loading ? undefined : dispatch(openDeleteAccountModal())}
              >
                Delete
              </button>

              <button 
                type="submit" 
                className="btn btn-success"
                disabled={loading}
              >
                Save
              </button>  
            </div>
          </form>
        </div>
        
      </div>

      <DeleteAccount />
    </>
  )
}


export default Settings