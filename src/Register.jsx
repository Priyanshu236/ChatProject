import axios from 'axios'
import React, { useContext, useState } from 'react'
import {UserContext} from "./UserContext"

function Register() {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [isLoggedin, setIsLoggedin] = useState("register")
  const {setUsername:setLoggedInUserName,setId} = useContext(UserContext)

  async function register(e){
    e.preventDefault();
    const {data} = await axios.post(isLoggedin,{username,password})
    setLoggedInUserName(username)
    setId(data.id)
    
  }
  return (
    <div className='bg-blue-100 h-screen flex items-center'>
      <form className='w-64 mx-auto p-2 t -translate-y-1/2' onSubmit={register}>
        <input type='text' placeholder='username' value={username} onChange={(e)=>{setUsername(e.target.value)}} className='w-full p-3 outline-none my-2 rounded-xl'/>
        <input type='text' placeholder='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} className='w-full p-3 outline-none my-2 rounded-xl'/>
        <button type='submit' className='p-2 my-2 w-full rounded-2xl bg-blue-500 outline-none hover:bg-blue-300'>{isLoggedin}</button>
        <p>Already a member? <button onClick={()=>{ setIsLoggedin((isLoggedin=="register"?"login":"register")) }}> {(isLoggedin=="register"?"login":"register")}</button></p>
      </form>
    </div>
  )
}

export default Register