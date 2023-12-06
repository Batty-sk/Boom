"use client"
import React, { useRef } from 'react'
import {useState } from 'react'
import { useEffect } from 'react'
import socket from '@/app/Constants/socket'
import { useContext } from 'react'
import myPeerContext from '@/app/Constants/peerContext'
import { Grid } from '@mui/material'
import MediaStreamContext from '@/app/Constants/streamContext'
import { Para } from '@/app/[meeting]/[id]/page'
import PeerVideo from './PeerVideo'
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import LogoutIcon from '@mui/icons-material/Logout';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChatBar from './ChatBar'
import { Chat2 } from '@/assests'
import { chatlogo } from '@/assests'
import Draggable from 'react-draggable'

interface PeerInfo {
    id: string;
    peer: MediaStream;
    name?:string
  }

interface Iam{
    user:string,
    peerID:string
}
const MeetingArea:React.FC<Para>= ({params}) => {
 
    const[meetingName,setMeetingName]=useState('')
    const isMobile = useMediaQuery('(min-width: 890px)');
    console.log('isMobile',isMobile)

    const peer=useContext(myPeerContext)
    const stream=useContext(MediaStreamContext)
    const [error,setError]=useState('')
    const [chats,setChats]=useState<string[]|null>(null)
    const[peers,setPeers]=useState<any[]>([{ id: 'me', peer: stream?.stream }])
    const [textToCopy, setTextToCopy] = useState<string>(params.id);
    const [isCopied, setIsCopied] = useState(false);
    const [chatBarVisible,setchatBarVisible]=useState<boolean>(false)
  
    const handleCopyClick = () => {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 2000); // Reset the "Copied" status after 2 seconds
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
        });
    }
    const {id}=params
    

    const handleCall=(value:Iam[])=>{
        const AllPeers:PeerInfo[]=[...peers]
        let processedEvents=0
        console.log('values len and allpeers',value.length,AllPeers.length)
        value.map((p,i)=>{
            if(p.peerID !== peer?.myPeer?.id )
            {
                if(stream?.stream!==null && stream!==undefined){
                    console.log('calling the peer with peerId ',p.peerID)
                    const call=peer?.myPeer?.call(p.peerID,stream.stream)

                    console.log('called the other peer')

                   call?.on('stream',(remoteStream)=>{

                      console.log('coming to the recieving of stream by the caller')
                     AllPeers.push({id:call.peer,peer:remoteStream})
                     processedEvents++;
                     if(processedEvents == value.length)
                     {
                         console.log('after colecting All peers',AllPeers)
                         setPeers((prevPeers) => {
                            // Use the functional form of setPeers
                            return [...AllPeers];
                          });}
          
                   })
                   call?.on('close', () => {
                      console.log('Call with peer closed:', p.peerID);})
                
          
                  }

            }
        })
      
      
      }

    const handleSendMessage=(message:string)=>{
        socket.emit('Message',{message,id}) // send the message alggon with the meeting id so the all the users in the group will be notified
        console.log('message sent successfully !')

    }

    const handleChatVisible=()=>{
        setchatBarVisible(!chatBarVisible)
    }

    useEffect(()=>{


        console.log('use eeffect called')

        const RemoteCalling = (call:any) => {
        
            console.log('Im Getting the right remote Stream', call.peer);
            call.answer(stream?.stream)
                call.on('stream',(remoteStream:MediaStream)=>{
                    console.log('pushing baabby')
                    console.log('before updating peers:',peers)
                    setPeers((prevPeers) => {
                        return [...prevPeers, { id: call.peer, peer: remoteStream }];
                      });

                      
                 }
                 
                 )
                 
        }
            // Update TempPeer or perform other logic as needed
          

        peer?.myPeer?.on('call',RemoteCalling)

        socket.emit('whoAmi',{meetingId:id,offer:peer?.myPeer?.id},(value:null | undefined | Iam[],meetingN:string)=>{
            console.log('server acknowledge to whoAmi')
            if (value!==null && value!==undefined)
            {   
                console.log('value coming....',value)
                handleCall(value)
                setMeetingName(meetingN)

            }
            else if(value==null)
            {
                console.log('i am an owner')
                setMeetingName(meetingN)

            }
            else if(value==undefined)
                setError(`Sorry No Meeting Found With The Meeting Id: ${id}`)


        }) 
        const handleDisconnect=(userId:string)=>{
            console.log('running the userDisconnected...')
            const newArray = peers.filter((item) => item.id !== userId);
            console.log('newArray',newArray)
            setPeers(newArray)
        }
        socket.on('userDisconnected',handleDisconnect)
        return ()=>{
            peer?.myPeer?.off('call',RemoteCalling)
            socket.off('userDisconnected',handleDisconnect)
            console.log('Destructure is calling ')
        }

        },[])



    useEffect(()=>{
        const handleChats=(chat:any)=>
        
        {   console.log('chats coming........... ',chat)
        setChats((prevChats) => {
            if (prevChats !== null) {
              const temp = [...prevChats]; // 
              temp.push(chat);
              return temp;
            } else {
              return [chat]; // If the previous chats array was null start a new array
            }
          });

        }
        socket.on('getChat',handleChats)
        console.log('getChat is listening bro')

        return ()=>{
            socket.off('getChat',handleChats)
            console.log('getchat offline...')
        }
    },[])



    if(error)
        return <h1 className='text-5xl text-white text-center'>{error}</h1>
  return (
    <Grid container className='flex justify-between relative  h-[100%] w-[100%] bg-[#111518]'>

    <Grid item container xs={12} md={9} className='border border-green-500 h-[100%] overflow-y-auto'>
    <Grid item xs={12} className='flex md:justify-between justify-center flex-wrap items-center bg-[rgba(0,0,0,0.4)] text-white  h-fit p-5'>
            <h2 className=' md:rounded-r-2xl md:rounded-br-2xl rounded-r-2xl rounded-bl-2xl font-bold font-mono text-black p-3 me-5' style={{background:'tan',border:'5px inset black '}}>{meetingName}</h2>
            <div className='flex font-mono mt-8  me-2'> <span className='text-white cursor-pointer mr-2' onClick={handleCopyClick} >
                <ContentPasteIcon/>
            </span>
                <h5 >meetingID: {textToCopy}</h5>
             </div>
             <div className='mt-8'>
                <span onClick={()=>{
                    socket.disconnect()
                    location.href='/'
                    console.log('User Exited Removing All the Video INstances of the user...')
                }}>
                    <LogoutIcon className='text-red-600 text-5xl cursor-pointer hover:scale-75'/>
                    <span>Exit</span>
                </span>
             </div>
    </Grid>
    <Grid item  xs={12}>
    <Grid container className='flex justify-around w-[100%] items-center flex-wrap mt-5  '>
    {[...new Set(peers.map((peer) => peer.id))].map((uniqueId) => {
    const peer = peers.find((p) => p.id === uniqueId);

    if (!peer) {
        return null; // Skip if peer not found (optional)
    }

    console.log('peers', peers);

    return (
        <Grid
            item
            key={peer.id}
            xs={11}
            md={6}
            className='relative flex flex-col items-center h-fit w-fit mb-3 '
            style={{ border: '5px solid white' }}
        >
            <PeerVideo id={peer.id} stream={peer.peer} />
        </Grid>
    );
})}
</Grid>
</Grid>
</Grid>
{isMobile?
<Grid item container xs={0} md={3}>
<Grid item xs={12} >
    <ChatBar chats={chats} handleSendMessage={handleSendMessage}/>
</Grid>
</Grid>
:
<><div className='absolute right-5 bottom-0 flex justify-end'>
        <img src={Chat2.src} alt="Chat" className='cursor-pointer h-[64px] w-[64px]' onClick={handleChatVisible}/>
    </div></>}
{(chatBarVisible && <div className='absolute left-0 right-0 bottom-0 top-0 ' >    <ChatBar chats={chats} handleSendMessage={handleSendMessage} onClose={setchatBarVisible}/>
</div>)}
    </Grid>
  )
}

export default MeetingArea