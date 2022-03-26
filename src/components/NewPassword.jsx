import React, { useState, useEffect, useCallback, useRef } from 'react'
import { FaLock, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import queryString from 'query-string'
import { checkToken, changePassword } from '../services/auth'
import Loader from './loaders/Loader'


const initialState = {
  password: '',
  confirm: ''
}


export default function NewPassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const newPasswordRef = useRef('')
  const repeatNewPasswordRef = useRef('')
  const { loading } = useSelector(state => state.loader)
  const [form, setForm] = useState(initialState)
  const [isSeeNewPassword, setSeeNewPassword] = useState(false)
  const [isSeeRepeatNewPassword, setSeeRepeatNewPassword] = useState(false)
  

  const seeNewPassword = useCallback(() => {
    setSeeNewPassword(!isSeeNewPassword)
    newPasswordRef.current.type = !isSeeNewPassword ? 'text' : 'password'
  }, [isSeeNewPassword])


  const seeRepeatNewPassword = useCallback(() => {
    setSeeRepeatNewPassword(!isSeeRepeatNewPassword)
    repeatNewPasswordRef.current.type = !isSeeRepeatNewPassword ? 'text' : 'password'
  }, [isSeeRepeatNewPassword])

  
  const handleChange = e => {
    const { value, name } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }

  const fetching = useCallback(async () => {
    const parsed = queryString.parse(window.location.search)
    const status = parsed?.token ? await dispatch(checkToken(parsed?.token)) : 'error'
    status === 'error' && navigate('/auth/login')
  }, [dispatch, navigate])


  useEffect(() => {
    fetching()
  }, [fetching])


  const handleSubmit = async e => {
    e.preventDefault()
    const parsed = queryString.parse(window.location.search)
    
    if(!loading) {
      const status = await dispatch(changePassword(parsed?.token, form))
      status === 'success' && navigate('/auth/login')  
    }
  }


  return (
    <>
      {loading ? <Loader /> : ''}
      
      <div className="auth">
        <div className="new-password-content">
          <div className="new-password-form">
            <h2 className="form-title">New Password</h2>

            <form autoComplete="off" onSubmit={handleSubmit}>
              <div className="input-group" id="newpassword">
                <div className="input-group-prepend">
                  <label htmlFor="newPassword">
                    <FaLock className="text-secondary" />
                  </label>
                </div>
                
                <input 
                  className="form-control" 
                  type="password" 
                  name="password" 
                  id="newPassword"
                  placeholder="New Password"
                  value={form.password}
                  ref={newPasswordRef}
                  onChange={handleChange}
                  disabled={loading}
                  required
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

              <div className="input-group" id="repassword">
                <div className="input-group-prepend">
                  <label htmlFor="confirm">
                    <FaLock className="text-success" />
                  </label>
                </div>
                
                <input 
                  className="form-control" 
                  type="password" 
                  name="confirm" 
                  id="confirm"
                  placeholder="Repeat New Password"
                  value={form.confirm}
                  onChange={handleChange}
                  ref={repeatNewPasswordRef}
                  disabled={loading}
                  required
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

              <div className="form-button">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={loading}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        
          <div className="new-password-image">
            <img 
              src="../assets/new_password.svg"
              alt="new_password"
            />
          </div>
        </div>
      </div>
    </>
  )
}