import React, { useState } from 'react'
import { FaChevronCircleLeft, FaEnvelope } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { resetToEmail } from '../services/auth'
import Loader from './loaders/Loader'


const ForgotPassword = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const { loading } = useSelector(state => state.loader)


  const handleSubmit = async e => {
    e.preventDefault()

    if(!loading) {
      const status = await dispatch(resetToEmail(email))
      status === 'success' && navigate('/auth/login')  
    }
  }


  return (
    <>
      {loading ? <Loader /> : ''}

      <div className="auth">
        <div id="back">
          <button 
            className="btn btn-outline-dark"
            onClick={() => loading ? undefined : navigate('/auth/login')}
            disabled={loading}
          >
            <FaChevronCircleLeft /> 
            <span>Back</span>
          </button>
        </div>

        <div className="forgot-password-content">
          <div className="forgot-password-image">
            <img 
              src="../assets/forgot_password.svg"
              alt="forgot_password"
            />
          </div>

          <div className="reset-password-form">
            <h2 className="form-title">Forgot Password</h2>

            <form autoComplete="off" onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="input-group-prepend">
                  <label htmlFor="email">
                    <FaEnvelope className="text-warning" />
                  </label>
                </div>
                
                <input 
                  className="form-control" 
                  type="email" 
                  name="email" 
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => loading ? undefined : setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-button">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}


export default ForgotPassword