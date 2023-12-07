import React, { useState,useEffect } from 'react'
import ReactPlayer from 'react-player'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import IconButton from '@mui/material/IconButton'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useRef } from 'react';

interface PeerVideoProps {
    id:string,
    stream: MediaStream;
  }
const PeerVideo:React.FC<PeerVideoProps> = ({id,stream}) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);


    const url = stream ? (stream as any) : null; // Cast MediaStream to any and then to null if it's null
    const[audio,setAudio]=useState(true)
    const[videoMuted,setVideoMuted]=useState(false)
    
    useEffect(() => {
      if (videoRef.current && stream) {
        const combinedStream = new MediaStream([...stream.getVideoTracks()]);

        videoRef.current.srcObject = combinedStream
      }
    }, [videoMuted]);

    useEffect(() => {
      if (audioRef.current && stream) {
        const combinedAudioStream = new MediaStream([...stream.getAudioTracks()]);
        audioRef.current.srcObject = combinedAudioStream;
      }
    }, []);

   const handleAudio=()=>{
    const audioTracks = stream?.getAudioTracks();

    audioTracks?.forEach((track) => {

      track.enabled = !audio;
    });
    setAudio(!audio)
  }

  
  const handleVideoMute=()=>{

    const videoTrack = stream?.getVideoTracks()[0];
    if(videoTrack)
      videoTrack.enabled = !videoTrack.enabled;

    
    // Update the state to reflect the current  state
    setVideoMuted(!videoMuted);
}
    return (    
      <>
        {stream!=null && !videoMuted? (
            <div className='w-[100%] h-[100%]'>
               <video ref={videoRef}  autoPlay playsInline  style={{ width: '100%', height: '100%' }} />
          </div>
          
        ):<AccountBoxIcon  className=' text-gray-400 h-[400px] w-[100%]' />} 
       {id=='me'?
       <div className='flex  justify-around rounded-md text-center w-[100%]' style={{backgroundColor:'darkslategray'}}><span  className='cursor-pointer' onClick={handleAudio}>
        <IconButton >
          {audio?<KeyboardVoiceIcon className='text-5xl text-white' />:<MicOffIcon className='text-5xl text-white'/>}
        </IconButton>   
</span>
<span className='cursor-pointer text-5xl' onClick={handleVideoMute}>
  
  <IconButton >
{videoMuted?<VideocamOffIcon className='text-5xl text-white'/>:<VideocamIcon className='text-5xl text-white'/>}
</IconButton>

</span></div>:''}
<audio ref={audioRef} autoPlay playsInline style={{ display: 'none' }} />

      </>
    )
}

export default PeerVideo