import React from 'react'

function Avatar({userId,username,online}) {

    const color = ["bg-red-300", "bg-blue-300", "bg-gray-300", "bg-white-100","bg-green-300","bg-pink-200"];
    const Index = parseInt(userId,16)
    const randomColor = color[Index%6];
    
    return (
      <div className={`w-8 h-8 relative rounded-full ${randomColor} -translate-y-1 text-center`}>

        <p className='opacity-70'>{username[0]}</p>
        {online && (
        <div className='absolute rounded-full bg-green-500 w-2 h-2 right-1 bottom-0 drop-shadow-2xl'></div>
        )}
        {!online && (
        <div className='absolute rounded-full bg-gray-500 w-2 h-2 right-1 bottom-0 drop-shadow-2xl'></div>
        )}
      </div>
    );
}

export default Avatar