"use client"
import type { Metadata } from 'next'
import CustomHead from '@/components/CustomHead'
import './globals.css'
import { useState } from 'react'
import Header from '@/components/Header'
import MediaStreamContext from './Constants/streamContext'
import myPeerContext from './Constants/peerContext'
import Peer from 'peerjs'
import Footer from '@/components/Footer'



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
})

{
  const[stream,setStream]=useState<MediaStream | null>(null)
  const[myPeer,setmyPeer]=useState<Peer | undefined>(undefined)

  return (
    <html lang="en">
      <CustomHead/>
        <MediaStreamContext.Provider value={{stream:stream,setStream:setStream}}>
          <myPeerContext.Provider value={{myPeer:myPeer,setmyPeer:setmyPeer}}>
        <body style={{fontFamily:'Nova Square'}} >
        <Header/>
        <main className='md:h-[86vh] h-[80vh]'>
          {children}
        </main>
          <Footer />

          </body>
          </myPeerContext.Provider>
        </MediaStreamContext.Provider>
    </html>
  )
}
