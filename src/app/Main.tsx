"use client"
import React, { useState } from 'react'
import { Button, Typography} from '@mui/material' 
import MeetingForm from '@/components/MeetingForm'
import socket from './Constants/socket'
import Footer from '@/components/Footer'
import { Boom } from '@/assests'


const Main= () => {

  const[meetingPopup,setmeetingPopup]=useState<boolean>(false)
  const[role,setRole]=useState<string>('')
  const handleClickMeeting=(type:string)=>{

      setmeetingPopup(true)
      setRole(type)

      //emit the join request to the server 
  }


  return (
    
    <div className='bg-gray-200 text-9xl  text-indigo-400 flex flex-col justify-center text-center items-center h-[100%]  font-mono md:pt-10 pt-28'>
        <div className='flex flex-col'>
          <div className='flex justify-center flex-wrap items-center'>
            <h1 className='font-extrabold' id='heading'>Boom</h1>
            <span className='ml-5 animate-bounce' ><img src={Boom.src} alt="" height={96} width={96}/></span>
            </div>
            <div className='flex justify-center items-center flex-wrap  mt-10'>
              <Button variant="contained"  onClick={()=>{handleClickMeeting('Join')}} className='p-5 m-3 mb-2 bg-black rounded-xl'>
                
                Join A Meeting 
              </Button>
    
             <Button variant="contained" onClick={()=>{handleClickMeeting('Create')}} className='p-5 m-3 mb-2  bg-black rounded-xl'>
               Create A Meeting 
             </Button>
            </div>

            {meetingPopup && process.browser && (
  <MeetingForm title={role} onClose={setmeetingPopup} />
)}
            <div className='text-center md:mt-48 sm:mt-10 p-4'>
            </div>
        </div>
     </div>
  )
}

export default Main