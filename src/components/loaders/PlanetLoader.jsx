import React from 'react'


export default function PlanetLoader() {
  return (
    <div className="planet-loader">
      <div className="content">
        <div className="planet">
          <div className="ring"></div>
            <div className="cover-ring"></div>
          <div className="spots">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <p>loading</p>
      </div>
    </div>
  )
}