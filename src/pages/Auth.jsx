import React from 'react'
import { useRoutes } from 'react-router-dom'
import Login from '../components/Login'
import Register from '../components/Register'
import ForgotPassword from '../components/ForgotPassword'
import NewPassword from '../components/NewPassword'
import PageNotFound from '../components/PageNotFound'


const Auth = () => {
  const pathname = 'login'

  const pages = useRoutes([
    {
      path: '',
      children: [
        { path: "/", element: <PageNotFound pathname={pathname} /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgot_password", element: <ForgotPassword /> },
        { path: "new_password", element: <NewPassword /> },
        { path: "*", element: <PageNotFound pathname={pathname} /> }
      ]
    }
  ])


  return (
    <div className="container">
      {pages}
    </div>
  )
}


export default Auth