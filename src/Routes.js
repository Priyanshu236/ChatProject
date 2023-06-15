import React, { useContext } from 'react'
import Register from './Register'
import { UserContext } from './UserContext'
import Chat from './Chat'
function Routes() {
  const {username,id}= useContext(UserContext)
  if(username)
  {
    return <Chat/>
  }
  else
  {

      return (
          <Register/>
          )
    }
}

export default Routes