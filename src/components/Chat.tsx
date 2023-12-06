import React from 'react'

interface Prop{
    message:string
}
const Chat:React.FC<Prop> = ({message}) => {
  return (
    <div className='bg-slate-100 border font-mono flex flex-col rounded-l-3xl-xl'>
        <span className='p-1'>{message}</span>
    </div>
  )
}

export default Chat