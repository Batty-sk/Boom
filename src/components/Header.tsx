import React from 'react'
/* import { SignOutButton } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs'; */
import { Grid } from '@mui/material';
import { Boom } from '@/assests';

const Header:React.FC = () => {

  return (
    <header className='pt-3 bg-[#25282C] p-5 ' style={{boxShadow:'0px 10px 10px white'}}>
        <Grid container justifyContent={''}>
                <Grid  item xs={12} className='flex items-center'>
                    <h3 className='font-mono font-extrabold md:text-5xl text-3xl text-white'>BOOM</h3>
                    <span className='ml-5' ><img src={Boom.src} alt=""  className='md:h-[48px] md:w-[48px] h-[32px] w-[32px]'/></span>

                </Grid>


          
        </Grid>
    </header>
  )
}

export default Header