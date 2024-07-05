import React from 'react'
import Avatar from 'react-avatar';

const Client = ({username}) => {
  return (
    <div>
        <Avatar name={username} size={50} round="14px" className='mr-1'/>
        <span className='text-xs ml-0.5'>{username}</span>
    </div>
  )
}

export default Client
