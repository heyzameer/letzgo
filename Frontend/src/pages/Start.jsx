import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logoblack.png'
// import logo from '../assets/logo2.png'
import tag from '../assets/tag.png'

const Start = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/login')
  }

  return (
    <div
      className="h-screen w-full bg-white flex flex-col items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center">
        <img
          className="w-200 h-190 object-contain mb-8"
          src={logo}
          alt="LetzGo Logo"
        />
        <img
          className="w-88 h-16 object-contain"
          src={tag}
          alt="tag"
        />
      </div>
    </div>
  )
}

export default Start
