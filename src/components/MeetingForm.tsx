import React from 'react'
import { useState,useRef,useEffect} from 'react'
import socket from '@/app/Constants/socket'
import MediaStreamContext from '@/app/Constants/streamContext'
import { useContext } from 'react'
import { Dialog,DialogActions,DialogContent,DialogTitle,Button} from '@mui/material'
import { useRouter } from 'next/navigation'
import myPeerContext from '@/app/Constants/peerContext'
const Peer = typeof window !== 'undefined' ? require('peerjs') : null;
const PeerConstructor = Peer ? Peer.default : null;

type Prop={
    title:string
    onClose:React.Dispatch<React.SetStateAction<boolean>>
}

const MeetingForm:React.FC<Prop> = ({title,onClose} ) => {

    // getting the stream context..
    const  streamContext=useContext(MediaStreamContext)
    //getting the peer context...
    const peerContext=useContext(myPeerContext)

    console.log('Peer context in the meeting form .....',peerContext)

    const router = useRouter()
    console.log('media stream context coming',streamContext)

    const [meetingId,setMeetingId]=useState<string>('')
    const [meetingname,setmeetingName]=useState<string>('')
    const [error,setMeetingError]=useState<string>('')

    const myvideo  = useRef<HTMLVideoElement>(null)

    useEffect(()=>{

    const getMediaStream = async()=>{
  
      try{
        if (typeof window !== 'undefined' && window.navigator && window.navigator.mediaDevices) {

           const stream  = await window.navigator.mediaDevices.getUserMedia({video:true,audio:true})
           if(myvideo.current !== null){
               myvideo.current.srcObject=stream
                streamContext?.setStream(stream)
                // arrangement is important otherwise the createoffer does include the media capabilites of a client
               console.log('peer connection',)
  
           }
        }
        }
      catch(e){
        setMeetingError('Please Allow Camera and Voice Access.')
        setTimeout(()=>{
           window.location.href='/'
        },5000)
      }
  
  
    }
    const showErr=(err:Error)=>{
        console.log('error happend in meeting form sockets',err)
    }


        socket.on('error', showErr);
        getMediaStream();
  
      return () => {
        if (typeof window !== 'undefined') {
          socket.off('error', showErr);
          console.log('window',window)
          console.log('NOT RUNNING JUST LIKE BEFORE')

        }
      };
    }, []);

    const handleClose = ()=>{
        onClose(false)
    }

    const handleJoinOrCreate=()=>{

        if (peerContext?.myPeer) {
            // Disconnect or destroy the existing Peer instance
            console.log('clearing the existing instance.......')

              
            peerContext.myPeer.disconnect(); // or peerContext.myPeer.destroy();
        }
    
        const newConn=new PeerConstructor()
        newConn.on('open',(id:any)=>{   
            peerContext?.setmyPeer(newConn)
            if(title == 'Create')
            {
                socket.emit('createMeeting',{offer:id,meetingName:meetingname},(meetingId:string)=>{
                    console.log('peer id coming brooooooo',id)

                    router.push(`/meeting/${meetingId}`)
                })

            }

            else{
                console.log('sending the id to the server ',meetingId)
                socket.emit("joinMeeting",{offer:id,meetingId:meetingId},(meeting:[string,string]|null)=>{

                    if(meeting!==null){
                      /*   const dataconn=newConn.connect(meeting[1])
                        dataconn.on('data',(data)=>{
                            console.log('data coming',data)
                            dataconn.send('Yo Bro HIHIHIHIHIHI')
                        })
                        console.log('acknowledgement function of join',dataconn) */

                       router.push(`/meeting/${meeting[0]}`)
                    }

                    else{setMeetingError("Meeting Doesn't Exist")
                }

                })

            }

        })
        newConn.on('error',(err:any)=>{
            console.log('error coming in the peer connection....',err)
        })
        newConn.on('close',()=>{
            console.log('peer connection closed ......');
        })

    }

    return (

    <div>
        <div className=' rounded-2xl text-white text-start'>
        <Dialog open={true} onClose={handleClose} sx={{backgroundColor:'rgba(0,0,0,0.8)'}}>

        <video ref={myvideo} height={500} width={500} autoPlay ></video>
        
        <DialogTitle className='font-mono font-extrabold bg-black text-white'>{title} A Meeting</DialogTitle>
        <DialogContent className='w-90 pt-5 bg-black'>
            <fieldset className='border border-gray-300 p-3'>
    <legend className="text-xs text-white px-1">
    {title === 'Join' ? 'Meeting ID' : 'Room Name'}
  </legend>
            <input className='w-[100%] h-10 border font-mono' type="text" value={title==='Join'?meetingId:meetingname} onChange={(eve:React.ChangeEvent<HTMLInputElement>)=>{
                (title === 'Join'?setMeetingId(eve.currentTarget.value):setmeetingName(eve.currentTarget.value))
            }}/>
            </fieldset>
        </DialogContent>
        <DialogActions className='bg-black font-mono'>
          <Button onClick={handleClose} variant='contained' color="error" className='font-mono'>
            Close
          </Button>
          <Button variant="contained" className='bg-cyan-400 font-mono text-black' onClick={handleJoinOrCreate}>
            {title==='Join'?'Join':'Create'}
          </Button>
        </DialogActions>
        {error?<span className='text-red-600 text-center font-mono bg-black '>{error}</span>:''}

      </Dialog>
        </div>

    </div>
    
    )
}

export default MeetingForm