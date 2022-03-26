import React, { useState, useRef, useCallback } from 'react'
import { FaUser, FaRegUser, FaCalendarAlt, FaVenusMars, FaLock, FaEnvelope, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/auth'


const initialState = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirm: '',
  birthday: '',
  gender: ''
}


export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const passwordRef = useRef('')
  const repeatPasswordRef = useRef('')
  const { loading } = useSelector(state => state.loader)
  const [form, setForm] = useState(initialState)
  const [isSeePassword, setSeePassword] = useState(false)

  
  const seePassword = useCallback(() => {
    setSeePassword(!isSeePassword)
    repeatPasswordRef.current.type = passwordRef.current.type  = !isSeePassword ? 'text' : 'password'
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

    const status = await dispatch(registerUser(form))

    setForm({
      ...form,
      password: '',
      confirm: ''
    })
    
    status === 'success' && navigate('/auth/login')
  }


  return (
    <div className="auth">
      <div className="signup-content">
        <div className="signup-form">
          <h2 className="form-title">Sign Up</h2>

          <form onSubmit={loading ? undefined : handleSubmit} autoComplete="off">
            <div className="row">
              <div className="input-group col-12 col-sm-6">
                <div className="input-group-prepend">
                  <label htmlFor="firstname">
                    <FaUser className="text-secondary" />
                  </label>
                </div>
                
                <input 
                  className="form-control" 
                  type="text" 
                  name="firstname" 
                  id="firstname"
                  placeholder="First Name"
                  value={form.firstname}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="input-group col-12 col-sm-6">
                <div className="input-group-prepend">
                  <label htmlFor="lastname">
                    <FaRegUser className="text-secondary" />
                  </label>
                </div>

                <input 
                  className="form-control" 
                  type="text" 
                  name="lastname" 
                  id="lastname"
                  placeholder="Last Name"
                  value={form.lastname}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="input-group col-12 col-sm-6">
                <div className="input-group-prepend">
                  <label htmlFor="birthday">
                    <FaCalendarAlt className="text-secondary" />
                  </label>
                </div>
                
                <input 
                  className="form-control" 
                  type="date" 
                  name="birthday" 
                  id="birthday"
                  placeholder="Birthday"
                  value={form.birthday}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="input-group col-12 col-sm-6">
                <div className="input-group-prepend">
                  <label htmlFor="gender">
                    <FaVenusMars className="text-secondary" />
                  </label>
                </div>

                <select 
                  className="form-control custom-select"
                  value={form.gender}
                  name="gender"
                  id="gender"
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option className="d-none">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <div className="input-group-prepend">
                <label htmlFor="email">
                  <FaEnvelope className="text-secondary" />
                </label>
              </div>
              
              <input 
                className="form-control" 
                type="email" 
                name="email" 
                id="email"
                placeholder="Email"
                value={form.email}
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
                className="form-control" 
                type="password" 
                name="password" 
                id="pass"
                ref={passwordRef}
                placeholder="Password"
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

            <div className="input-group">
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
                ref={repeatPasswordRef}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-button">
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={loading}
              >
                Register
              </button>
            </div>
          </form>

          <div className="loginPage">
            <p>
              <span>Already have an account?</span>
              <Link to={loading ? "#" : "/"}>
                Login now
              </Link>
            </p>
          </div>
        </div>

        <div className="signup-image">
          <img src="../assets/register.svg" alt="signupImage" />

          <div className="loginPage">
            <p>
              <span>Already have an account?</span>
              <Link to={loading ? "#" : "/auth/login"}>
                Login now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}