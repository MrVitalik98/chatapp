import React, { useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getUserById } from '../services/users'
import SpinnerLoader from './loaders/SpinnerLoader'


export default function User() {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { fullname, avatar, age, loading, numberOfChats } = useSelector(state => state.users?.user)


  const fetching = useCallback(async () => {
    const status = params?.id ? await dispatch(getUserById(params.id)) : 'error'
    status === 'error' && navigate('/dashboard/profile')
  }, [dispatch, params.id, navigate])


  useEffect(() => {
    fetching()
  }, [fetching])


  return (
    loading ? <SpinnerLoader /> : (
      <div className="account">
        <img 
          src={avatar}
          alt="user-avatar"
          className="user-avatar"
        />

        <h2 className="user-name">{fullname}</h2>
        <div className="info">
          <p>
            <sup>Age</sup>{' '}
            <span className="user-age"><b>{age}</b></span>
          </p> 
          |
          <p>
            <sup>Chats</sup>{' '}
            <span className="numberOfChats"><b>{numberOfChats}</b></span>
          </p>
        </div>
      </div>
    )
  )
}