import React from 'react'
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { Button } from '@mui/material';

const Footer = () => {
  return (
  <footer className='text-center p-5  bg-[#25282C]'>
    <ul className='flex justify-center p-0 text-5xl mb-10 text-white'>
        <a className='me-5' href='https://github.com/batty-sk' target='_blank' >
          
          <FaGithub/></a>
        <a href='https://www.linkedin.com/in/saurav-kumar-5225a2292/' target='_blank'><FaLinkedin/></a>
    </ul>
  </footer>
  )
}

export default Footer