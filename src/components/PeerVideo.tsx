import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import IconButton from '@mui/material/IconButton'
import AccountBoxIcon from '@mui/icons-material/AccountBox';

interface PeerVideoProps {
    id:string,
    stream: MediaStream;
  }
const PeerVideo:React.FC<PeerVideoProps> = ({id,stream}) => {

    const url = stream ? (stream as any) : null; // Cast MediaStream to any and then to null if it's null
    const[audio,setAudio]=useState(true)
    const[videoMuted,setVideoMuted]=useState(false)
    
    
   const handleAudio=()=>{
    const audioTracks = stream?.getAudioTracks();

    audioTracks?.forEach((track) => {
      track.enabled = !audio;
    });
    setAudio(!audio)
  }

  
  const handleVideoMute=()=>{

    const videoTrack = stream.getVideoTracks()[0];

    videoTrack.enabled = !videoTrack.enabled;

    // Update the state to reflect the current  state
    setVideoMuted(!videoMuted);
}
    return (    
      <>
        {stream!=null && !videoMuted? (
            <div className='w-[100%] h-[100%]'>
          <ReactPlayer
            playing={true}
            
            url={url}
           // Mute the video by default to avoid feedback loop
           style={{height:'400px !important',width:'100% !important',maxHeight:'100%',maxWidth:'100%'}}

          />

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
      </>
    )
}

export default PeerVideo