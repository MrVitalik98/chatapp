import React, { useState, useRef, useCallback, useContext } from 'react'
import { FaUser, FaLock, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/auth'
import SocketContext from '../contexts/SocketContext'


const initialState = {
  email: '',
  password: ''
}


const Login = () => {
  const passwordRef = useRef('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { socket } = useContext(SocketContext)
  const { loading } = useSelector(state => state.loader)
  const [isSeePassword, setIsSeePassword] = useState(false)
  const [form, setForm] = useState(initialState)


  const seePassword = useCallback(() => {
    setIsSeePassword(!isSeePassword)
    passwordRef.current.type = !isSeePassword ? 'text' : 'password'
  }, [isSeePassword])


  const handleChange = e => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }


  const handleSubmit = async e => {
    e.preventDefault()
    const data = await dispatch(loginUser(form))
    
    if(data?.status === 'success') {
      socket.connect()
      socket.emit('user connected', { ...data?.user })
      navigate('/dashboard/profile')
    }

    setForm({ ...form, password: '' })
  }


  return (
    <div className="auth">
      <div className="signin-content">
        <div className="signin-image">
          <img src="../assets/login.svg" alt="signinImage" />
        </div>

        <div className="signin-form">
          <h2 className="form-title">Sign In</h2>

          <form onSubmit={loading ? undefined : handleSubmit}>
            <div className="input-group">
              <div className="input-group-prepend">
                <label htmlFor="your_email">
                  <FaUser className="text-secondary" />
                </label>
              </div>

              <input 
                type="email" 
                id="your_email"
                name="email"
                className="form-control" 
                placeholder="Your Email"
                value={form?.email} 
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="input-group">
              <div className="input-group-prepend">
                <label htmlFor="pass">
                  <FaLock className="text-secondary" />
                </label>
              </div>

              <input 
                type="password" 
                id="pass"
                name="password"
                className="form-control" 
                placeholder="Password" 
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <div className="input-group-append">
                <label>
                  {
                    isSeePassword
                      ? (
                          <FaRegEye 
                            className="text-secondary" 
                            onClick={seePassword}
                          />
                        )
                      : (
                          <FaRegEyeSlash 
                            className="text-secondary"
                            onClick={seePassword}
                          />
                        )
                  }
                </label>
              </div>
            </div>

            <div className="form-button">
              <button 
                type="submit" 
                className="btn btn-info"
                disabled={loading}
              >
                Login
              </button>
            </div>
          </form>

          <div className="registrationPage">
            <p>
              <span>You don`t have an account?</span>
              <Link to={loading ? "#" : "/auth/register"}>
                Create an account
              </Link>
            </p>

            <Link to={loading ? "#" : "/auth/forgot_password"} id="forgot-password">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Login