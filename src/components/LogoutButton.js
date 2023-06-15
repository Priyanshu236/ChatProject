import React from 'react'
import { useState } from 'react';
function LogoutButton() {
  function clearCookiesAndReload() {
    // Clear cookies by setting their expiration date to the past
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  
    // Reload the window
    window.location.reload();
  }
  const [hover, setHover] = useState(false);
  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };
  return (
    <div className='relative' onMouseEnter={onHover} onMouseLeave={onLeave}>
        <svg className='hover:cursor-pointer hover:bg-gray-300 p-1 rounded-full' onClick={()=>{
          clearCookiesAndReload()
        }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1Zm10.293 9.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 1 0-1.414 1.414L14.586 9H7a1 1 0 1 0 0 2h7.586l-1.293 1.293Z" clip-rule="evenodd"/></svg>
        { hover && (
          <div className='absolute bg-white border-2'>
            Logout
          </div>
        )
        }
    </div>
  )
}

export default LogoutButton