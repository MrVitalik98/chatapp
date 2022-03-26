import React from 'react'
import { useNavigate, Outlet } from 'react-router-dom'


const PageNotFound = ({ pathname }) => {
  const navigate = useNavigate()


  return (
    <div className="pageNotFound">
      <img
        src="../assets/page_not_found.svg"
        alt="404 page not found"
      />

      <div className="content">
        <h2 className="title">Page not found</h2>

        <button 
          className="btn btn-dark"
          onClick={() => navigate(pathname)}
        >
          Go Home
        </button>
      </div>

      <Outlet />
    </div>
  )
}


export default PageNotFound