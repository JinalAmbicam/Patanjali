import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import withAuth from '@component/withAuth';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { TbZoomReset } from 'react-icons/tb';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import Hls from 'hls.js';


const LiveFeed = forwardRef(({ showTimeline, live, selectedDate, handleThumbnailGenerated, cameraId, isLive, recordingDates, onVideoLoadError }, ref) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const numRepetitions = 3;
  const timelineRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    wipeToSlide: true,
    slidesToShow: 1, // Show only one "slide" at a time
    slidesToScroll: 0.5, // Scroll by a fraction of a slide
    
  };

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

    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [isJumping]);
  const [error, setError] = useState(null); 
  useEffect(() => {
    const video = videoRef.current;
    let hls;
    const loadStream = (sourceUrl) => {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,            // Enable web workers for better performance
          liveSyncDuration: 3,           // Maximum difference between live edge and current playback position (in seconds)
          maxBufferLength: 30,           // Maximum buffer length (in seconds)
          maxBufferSize: 60 * 1000 * 1000, // Maximum buffer size in bytes (e.g., 60 MB)
          maxMaxBufferLength: 600,       // Maximum buffer length that can be set by the player (in seconds)
          maxMaxBufferSize: 600 * 1000 * 1000, // Maximum buffer size that can be set by the player (e.g., 600 MB)
          lowLatencyMode: true,          // Enable low-latency mode
          liveDurationInfinity: true,    // Treat live streams as having infinite duration
          fragLoadingTimeOut: 20000,     // Fragment loading timeout (in milliseconds)
          fragLoadingMaxRetry: 5,        // Maximum number of fragment loading retries
          fragLoadingRetryDelay: 500,    // Delay between fragment loading retries (in milliseconds)
          levelLoadingTimeOut: 10000,    // Level loading timeout (in milliseconds)
          levelLoadingMaxRetry: 5,       // Maximum number of level loading retries
          levelLoadingRetryDelay: 500,   // Delay between level loading retries (in milliseconds)
          manifestLoadingTimeOut: 10000, // Manifest loading timeout (in milliseconds)
          manifestLoadingMaxRetry: 5,    // Maximum number of manifest loading retries
          manifestLoadingRetryDelay: 500, // Delay between manifest loading retries (in milliseconds)
          backBufferLength:3,           // Number of segments to keep in the back buffer before removing older ones
          liveDurationInfinity: !showTimeline,
      });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(error => console.error('Error playing video:', error));
        });
        // Error handling
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('fatal network error encountered, try to recover');
                setError('A network error occurred. Trying to recover...');
                hls.destroy();
                setTimeout(() => loadStream(sourceUrl), 3000); // Retry after 3 seconds
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('fatal media error encountered, try to recover');
                setError('A media error occurred. Trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                console.error('unrecoverable error', data);
                setError('An unrecoverable error occurred.');
                hls.destroy();
                break;
            }
          }
        });
        hls.on(Hls.Events.FRAG_LOADED, () => {
          // Clear the error message upon successful recovery
          setError(null);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(error => console.error('Error playing video:', error));
        });
      }
    };
  
    loadStream(selectedDate || live);
  
    // Cleanup function
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [selectedDate, live, onVideoLoadError]);

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

  return (
    <>
      <Box width="100%" height="auto" borderRadius="md" overflow="hidden" position="relative">
        <TransformWrapper>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            position="absolute"
            top="30%"
            right={0}
            zIndex={1}
            m={2}>
            <Controls />
          </Box>
          {error && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
            color: 'white', // Text color
            zIndex: 1, // Ensure it's above the video and controls
            fontSize: '20px', // Adjust as needed
          }}>
            {error}
          </div>
        )}
    
          <TransformComponent>
            <video
              autoPlay
              playsInline
              ref={videoRef}
              controls
              crossOrigin="anonymous"
              style={{
                position: 'relative',
                aleft: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            >

        </video>
            {!showTimeline && (
              <style>
                {`
                  video::-webkit-media-controls-timeline {
                    display: none !important;
                  }
                  video::-webkit-media-controls-current-time-display {
                    display: none !important;
                  }
                `}
              </style>
            )}

          </TransformComponent>
        </TransformWrapper>
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
  );
});

export default withAuth(LiveFeed);


// enableWorker: true,
// lowLatencyMode: true,
// backBufferLength: 2,
// liveSyncDuration: 1,
// liveBackBufferLength: 1,
// highBufferWatchdogPeriod: 1,