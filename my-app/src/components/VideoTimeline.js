import React, { useState, useEffect, useRef } from 'react';
import { Flex, Text, Box, Menu, MenuButton, Center,Modal, ModalContent, ModalOverlay ,ModalCloseButton,ModalBody,ModalHeader} from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight, FiArchive } from 'react-icons/fi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay, format } from 'date-fns';
import { FiChevronDown } from 'react-icons/fi';

const VideoTimeline = ({ recordingDates, handleSelectDate, selectedDate,handleTimelineNavigation, }) => {
  const [currentTime, setCurrentTime] = useState(0); // Video current time in seconds
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timelineRef = useRef(null);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleTimelineClick = (event) => {
    // Calculate the clicked time based on the click position
    const timelineWidth = timelineRef.current.offsetWidth;
    const clickedPosition = event.nativeEvent.offsetX;
    const clickedTime = (clickedPosition / timelineWidth) * 86400;
    setCurrentTime(clickedTime);
 
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
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
  
  const formattedRecordingDates = recordingDates.map(date => {
    const [day, month, year] = date.split('-');
    return new Date(year, month - 1, day);
  });



  return (
    <Box  bg="gray.300">
       
    <Flex border="1px"  flexDirection="column"  ref={timelineRef} className="timeline" onClick={handleTimelineClick}>
        
    <Box display={'flex'} alignItems="left" px={3} onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
            <Text display={'flex'}>
                {selectedDate ? format(selectedDate, 'dd-MM-yyyy') : format(new Date(), 'dd-MM-yyyy')}
                <FiChevronDown  style={{ margin: '4px 0 0 2px', verticalAlign: 'middle' }} />
            </Text>
    </Box>

    <Modal  isOpen={isModalOpen} onClose={handleCloseModal}>
    <ModalOverlay />
    <ModalContent p={0}> 
        <ModalHeader textAlign={'center'} pt={1.5} pb={1} >Select a Date <ModalCloseButton  /></ModalHeader>
        
        <ModalBody>
        <Flex  justify="center">
            <Center>
            <Calendar 
                onChange={handleSelectDate}
                value={selectedDate || new Date()}
                maxDetail="month"
                tileDisabled={({ date }) =>
                !formattedRecordingDates.some((recordingDate) =>
                    isSameDay(recordingDate, date)
                )
                }
                minDate={new Date(Math.min(...formattedRecordingDates))}
                maxDate={new Date(Math.max(...formattedRecordingDates))}
            />
            </Center>
        </Flex>
        </ModalBody>
    </ModalContent>
    </Modal>



           
        <FiArrowLeft
            size={20}
            style={{ position: 'absolute', top:'85%', left: '5px', transform: 'translateY(-50%)' }}
          />
          <FiArrowRight
            size={20}
            style={{ position: 'absolute', top:'85%', right: '5px', transform: 'translateY(-50%)' }}
          />

          
        
        <svg width="100%" height="71"> {/* Adjust the height here */}
           {/* Left arrow indicator */}
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
            x={`${(currentTime / 86400) * 100}%`}
            y="20"
            width="2"
            height="50"
            fill="red" // Indicator color
            
          />
             
             
        </svg>
        
    </Flex>

      <Text textAlign="center" mt={2}>{formatTime(currentTime)}</Text>
    </Box>
  );
};

export default VideoTimeline;
