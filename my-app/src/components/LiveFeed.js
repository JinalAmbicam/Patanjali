import React, { useState,useEffect, useRef, forwardRef,useImperativeHandle } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import withAuth from '@component/withAuth';
import { Box ,Flex,Button, IconButton,Text} from '@chakra-ui/react';
import { usePinch, useDrag } from 'react-use-gesture';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { TbZoomReset } from 'react-icons/tb';
import VideoTimeline from './VideoTimeline';
import { FiArrowLeft, FiArrowRight, FiArchive } from 'react-icons/fi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";


const LiveFeed = forwardRef(({showTimeline ,live,selectedDate, handleThumbnailGenerated,cameraId,isLive,recordingDates,onVideoLoadError  },ref) => {
  // alert(live)
  // const { zoomIn, zoomOut, resetTransform } = useControls();


  const [videoLoadError, setVideoLoadError] = useState(false);
  const [videoLoadErrorMessage, setVideoLoadErrorMessage] = useState('');


  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <>
      
       <IconButton
         size={isMobile ? 'xs%' : 'sm'}
          // size="sm"
          marginRight={2}
          borderTopLeftRadius={"50%"}
          borderTopRightRadius={"50%"}
          borderBottomLeftRadius={"0%"}
          borderBottomRightRadius={"0%"}
          onClick={() => zoomIn()}
          backgroundColor="rgba(29,30,34,.7)"
          color={"white"}
          
          aria-label="Zoom In"
          variant="ghost"
          marginBottom={0.5}
          icon={<FiPlus />}
          _hover={{ backgroundColor: 'rgba(29, 30, 34, 1)' }}
        />
         <IconButton
         size={isMobile ? 'xs%' : 'sm'}
         borderTopLeftRadius={"0%"}
         borderTopRightRadius={"0%"}
         borderBottomLeftRadius={"50%"}
         borderBottomRightRadius={"50%"}
          // size="sm"
          marginBottom={0.5}
          marginRight={2}
          onClick={() => zoomOut()} 
          // onClick={() => setZoomValue(Math.max(zoomValue - 0.1, 1))}
          backgroundColor="rgba(29,30,34,.7)"
          color={"white"}
          variant="ghost"
          aria-label="Zoom Out"
          icon={<FiMinus />}
          _hover={{ backgroundColor: 'rgba(29, 30, 34, 1)' }}
        />
        {/* <button onClick={() => zoomIn()}>Zoom In</button> */}
        {/* <button onClick={() => zoomOut()}>Zoom Out</button> */}
        <IconButton
         size={isMobile ? 'xs%' : 'sm'}
         borderTopLeftRadius={"50%"}
         borderTopRightRadius={"50%"}
         borderBottomLeftRadius={"50%"}
         borderBottomRightRadius={"50%"}
          // size="sm"
          marginRight={2}
          onClick={() => resetTransform()} 
          // onClick={() => setZoomValue(Math.max(zoomValue - 0.1, 1))}
          backgroundColor="rgba(29,30,34,.7)"
          color={"white"}
          variant="ghost"
          aria-label="Zoom Out"
          icon={<TbZoomReset />}
          _hover={{ backgroundColor: 'rgba(29, 30, 34, 1)' }}
        />
   
      </>
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    wipeToSlide: true,
    slidesToShow: 1, // Show only one "slide" at a time
    slidesToScroll: 0.5, // Scroll by a fraction of a slide
    
  };
  
  const numRepetitions = 3;
  
  const timelineRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  const handleTimelineClick = (event) => {
    const timelineWidth = timelineRef.current.offsetWidth;
    const clickedPosition = event.nativeEvent.offsetX;
    const clickedTime = (clickedPosition / timelineWidth) * 86400;

    if (clickedTime > currentTime) {
      setIsJumping(true); // Indicate that we are jumping forward
      videoRef.current.currentTime = clickedTime + 10; // Jump forward 10 seconds
    } else {
      // Handle buffering and playing from clicked point
      setIsJumping(true);
      videoRef.current.currentTime = clickedTime;
    }

    setCurrentTime(clickedTime);
  };
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (!isJumping && videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
      setIsJumping(false);
    };
  
    // Attach event listeners
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }
  
    // Cleanup
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [isJumping]);
  
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRemainder = Math.floor(seconds % 60);
    const period = hours < 12 ? 'AM' : 'PM';
    const hour12Format = hours === 0 ? 12 : hours <= 12 ? hours : hours - 12;
  
    return `${String(hour12Format).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondsRemainder).padStart(2, '0')} ${period}`;
  };
  
  const formatTime2 = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const period = hours < 12 ? 'AM' : 'PM';
    const hour12Format = hours === 0 ? 12 : hours <= 12 ? hours : hours - 12;

    return `${String(hour12Format).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const videoRef = useRef(null);
  const [response, setResponse] = useState(null);

const currentSource = selectedDate ? selectedDate : live;

const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const destroyVideoPlayer = () => {
    if (playerRef.current) {
      playerRef.current.dispose(); // This will destroy the player instance
    }
  };

  // Use useImperativeHandle to expose the destroyVideoPlayer function via the ref
  useImperativeHandle(ref, () => ({
    destroyVideoPlayer,
  }));

  useEffect(() => {
    const loadPlayer = async () => {
      const videoElement = videoRef.current;
      const player = videojs(videoElement,{
       controls: true // Keep the default controls
      });

      
      class HlsTech extends videojs.getTech('Html5') {
        static canPlayType(type) {
          return videojs.getTech('Html5').canPlayType(type);
        }

        src(_, src) {
          if (src) {
            this.el_.src = src;
            this.el_.setAttribute('type', 'application/x-mpegURL');
          }
        }
      }

      videojs.registerTech('HlsTech', HlsTech);
      player.src({
        src: currentSource ,
        type: 'application/x-mpegURL',
        
      });

      player.autoplay(true);


      // playerRef.current = player;
    // player.CloseButton(true);
      // Attach event listener for errors
      videoElement.addEventListener('error', (event) => {
        // Fetch and set the error message
        const error = videoElement.error;
        setVideoLoadErrorMessage('An error occurred while loading the video.');
        setVideoLoadError(true);
        onVideoLoadError(true); 
        console.error('Video loading error occurred:', error);
        console.error('Error code:', error.code);
        console.error('Network state:', videoElement.networkState);
        console.error('Media error:', videoElement.mediaError);
        console.log(videoElement.error)
      });



        // Attach event listener for 'timeupdate' to track video's current time
        videoElement.addEventListener('timeupdate', () => {
          setCurrentTime(videoElement.currentTime);
          // setCurrentTime(videoElement.currentTime);
        });
    

      let isMetadataLoaded = false;

      // Attach event listeners for loadedmetadata and loadeddata events
      videoElement.addEventListener('loadedmetadata', () => {
        isMetadataLoaded = true;
        setVideoDuration(videoElement.duration); // Update videoDuration state
      });
  
      videoElement.addEventListener('loadeddata', () => {
        if (isMetadataLoaded) {
          generateThumbnail(cameraId);
        }
      });;

      // Set up player refresh every 5 minutes (300,000 milliseconds)
    const refreshInterval = 300000; // 5 minutes in milliseconds

    const refreshPlayer = () => {
      player.src({
        src: currentSource,
        type: 'application/x-mpegURL',
      });
      player.load();
      player.play();
    };

    const refreshTimer = setInterval(refreshPlayer, refreshInterval);
    
      return () => {
        clearInterval(refreshTimer);
        player.dispose();
     
             // Clean up resources, including destroying the video player
    destroyVideoPlayer();

      };
    };

    loadPlayer();
  }, [currentSource]);

 
  
  const generateThumbnail = (cameraId) => {
    const videoElement = videoRef.current;
  
    if (videoElement && videoElement.readyState >= 3) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
  
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
  
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
      const thumbnailUrl = canvas.toDataURL('image/jpeg');
      localStorage.setItem(`thumbnail_${cameraId}`, thumbnailUrl);
      handleThumbnailGenerated(thumbnailUrl, cameraId);
    } else {
      console.log("Video hasn't loaded yet. Wait for metadata to be available.");
    }
  };
  


  return(
    <>
    <Box width="100%"  height="auto" borderRadius="md" overflow="hidden" position="relative">

    <TransformWrapper  style={{width:"100%"}}>
 

       {/* Zoom buttons */}
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            position="absolute"
            top={isMobile ? '30%' : '30%'}
            // top={"50%"}
            right={0}
            zIndex={1}
            m={2}>
          <Controls />
        </Box>
      
        
      <TransformComponent style={{width:"100%"}} >
        
      <video
        playsInline
        ref={videoRef}
        responsive = 'true'
        data-setup='{"liveui": true}'
        controls
        className="video-js "
        style={{
          position: 'relative',
          aleft: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
   </TransformComponent> 
 
    </TransformWrapper>
    {/* <video  ref={videoRef} controls className="video-js" style={{ position:'relative',aleft: 0, width: '100%',  }} /> */}
  </Box>


  {showTimeline && (
  <Box padding={1} > 
   <Flex border="1px"  flexDirection="column"  ref={timelineRef} className="timeline" onClick={handleTimelineClick}>

      
            <Slider {...settings}   
             style={{
              height:"71px",
              outline: 'none',
              border: 'none',
              // any other styling you want to apply
            }}>
            {[...Array(numRepetitions)].map((_, i) => (
              
            <svg width="100%" height="71px"
            style={{
              border:'none' , // Apply border conditionally
            }} >
              <line x1="0" y1="15" x2="100%" y2="15" stroke="black" strokeWidth="2" />
              {[...Array(3)].map((_, i) => (
                <React.Fragment key={i}>
                  {[0, 4, 8, 12].map((hour) => (
                    <React.Fragment key={hour + i * 12}>
                      <line
                        x1={`${((hour + i * 12) / 24) * 100}%`}
                        y1="15"
                        x2={`${((hour + i * 12) / 24) * 100}%`}
                        y2="23"
                        stroke="black"
                        strokeWidth="2"
                      />
                      <text
                        x={`${((hour + i * 12) / 24) * 100}%`}
                        y="35"
                        fontSize="12px"
                        fill="black"
                        textAnchor="right"
                      >
                        {formatTime2((hour + i * 12) * 3600)}
                      </text>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
               <rect
                x={`${(currentTime / (60 * 60 * 24)) * 100}%`}
                y="20"
                width="2"
                height="50"
                fill="red" // Indicator color
              />
            </svg>
              ))}
            </Slider>
          
     
       
   </Flex>
   <text textAlign="center" mt={2}>{formatTime(currentTime)}</text>
   </Box>
   )}
</>
  ) ;
});

export default withAuth(LiveFeed);
