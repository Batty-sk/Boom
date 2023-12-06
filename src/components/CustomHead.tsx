
import Head from 'next/head';

import { Chat2 } from '@/assests';
const CustomHead = () => (
  <Head>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Nova+Square&display=swap"
    />
    <link rel="icon" href={Chat2.src} />
    <title>Boom</title>
  </Head>
);

export default CustomHead;