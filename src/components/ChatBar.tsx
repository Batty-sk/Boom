import React,{useState} from 'react'
import Chat from './Chat'
import SendIcon from '@mui/icons-material/Send';
import {IconButton} from "@mui/material"
import Draggable from 'react-draggable';

interface ChatBarProps {
    chats: string[]|null;
    handleSendMessage: (message: string) => void;
    onClose?:React.Dispatch<React.SetStateAction<boolean>>
}

const ChatBar:React.FC<ChatBarProps> = ({ chats, handleSendMessage,onClose }) => {
    const [message,setMessage]=useState<string>('')

    

  return (
<div className='w-[100%] h-[100%] bg-slate-200 border  relative'>
   <div className='font-mono  flex justify-around items-center text-center text-3xl p-5 text-black font-extrabold border bg-indigo-300 relative z-10'>  
   <h3 className='text-center'>Chat</h3>
    {onClose?<div className='text-end relative z-50
     text-red-600' ><span className='p-2 cursor-pointer font-extrabold text-5xl' onClick={()=>{
        onClose((state)=>!state)
        }}>X</span ></div>:null}</div>
    <div  className='flex flex-col absolute bottom-16 top-5 overflow-y-auto left-0 right-0 items-end justify-end p-3 z-0 bg-white'>
        {chats?.map((chat,index)=><Chat message={chat}  key={index} />)}
    </div>
    <div className='flex justify-around h-fit w-[100%] font-mono absolute left-0 right-0 bottom-0 '>
        <input className='h-10 border w-[70%] outline-2 text-black' type="text" name="" id="" value={message} onChange={(x)=>{
            setMessage(x.currentTarget.value) 
        }} placeholder='Send Message..' /> 
        <IconButton onClick={()=>{handleSendMessage(message) 
            setMessage('')}}>
          <SendIcon  className=' text-3xl'/>
        </IconButton>

    </div>
    </div>
      )
}

export default ChatBar