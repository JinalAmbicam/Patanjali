import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import logo from '@img/PatanjaliLogo.png';
import LoginPage from './LoginPage';
import axios from 'axios';
import React from 'react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { ChakraProvider,CSSReset  ,Skeleton, SkeletonCircle, SkeletonText,useBreakpointValue } from '@chakra-ui/react'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [loginvisible ,setLoginVisible] = useState(false)
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === null){
      setShowLoader(false);
      setLoginVisible(true)
    }

    if (isLoggedIn === 'true') {
      router.push('/dashboard');
      
    }
    
    // Check for small screen based on window height
    function handleResize() {
      setIsSmallScreen(window.innerHeight < 676);
    }
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Check if the user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
   
    if (isLoggedIn === null){
      setShowLoader(false);
      setLoginVisible(true)
    }

    if (isLoggedIn === 'true') {
      router.push('/dashboard');
    }
  }, []);


React.useEffect(() => {
  // Add an event listener to the contextmenu event to disable right-clicking
  document.addEventListener('contextmenu', handleContextMenu);

  // Cleanup the event listener when the component unmounts
  return () => {
    document.removeEventListener('contextmenu', handleContextMenu);
  };
}, []);

function handleContextMenu(e) {
  e.preventDefault();
}
  return (
    <>
      <Head>
        <title>Patanjali VMS</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
<script>

</script>
      </Head>
      <ChakraProvider  >
      {showLoader && !loginvisible && (
          <div className="loader-container">
            <Image src={logo} alt="Loading Logo" className="loader-logo" />
            <Skeleton startColor='blue.200' endColor='blue.500' height='2px'>
              {/* span text is necessary for show SKeleton */}
              <span>Loading Patanjali</span>
            </Skeleton>
          </div>
        )}
        <style jsx>{`
              .loader-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.8); /* Optional: Add a semi-transparent background */
                z-index: 9999; /* Make sure it's above other content */
                animation: fade-in-out 1s ease-in-out forwards;
              }
              @keyframes fade-in-out {
                0% {
                  opacity: 0;
                }
                100% {
                  opacity: 1;
                }
              }
              .loader-logo {
                width: 100px;
                height: 100px;
              }

              /* Add your existing media query styles here */
            `}</style>
    </ChakraProvider>
     {loginvisible &&(
      <LoginPage />
     ) }
      
 
    
    </>
  )
}
