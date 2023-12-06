"use client"

import React from 'react'
import MeetingArea from '@/components/MeetingArea'
export type Para={
  params:{
    meeting:string
    id:string
  }
}
const page:React.FC<Para>= ({params}) => {
  return (
    <>
    <MeetingArea  params={params}/>
    </>
  )
}

export default page