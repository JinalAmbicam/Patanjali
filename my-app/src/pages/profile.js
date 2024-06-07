// import {
//     Box,
//     Flex,
//     Avatar,
//     Heading,
//     Text,
//     Divider,
//     VStack,
//     Badge,
//     Button, Collapse,Stack
//   } from '@chakra-ui/react';
//   import DesktopHeader from '@component/DesktopHeader';
// import MobileHeader from '@component/MobileHeader';
// import { useState ,useEffect} from 'react';
// import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
// import { Router } from 'next/router';
// import { useRouter } from 'next/router';
// import {logout} from '@api/auth'
//   const ProfilePage = () => {
//     const router = useRouter();
//     const [isMobile, setIsMobile] = useState(false);
//     const [isEmailVisible, setEmailVisible] = useState(false);
//     const [isContactVisible, setContactVisible] = useState(false);
//     const [city, setCity] = useState('');
//     const [area, setArea] = useState('');

//     const [loading, setLoading] = useState(true);


//     const handleToggleEmail = () => {
//       setEmailVisible(!isEmailVisible);
//     };
//     const handleToggleContact = () => {
//         setContactVisible(!isContactVisible);
//       };
//     useEffect(() => {
//       const handleResize = () => {
//         setIsMobile(window.innerWidth <= 768);
//       };
  
//       handleResize(); // Initial check
//       window.addEventListener('resize', handleResize);
  
//       return () => {
//         window.removeEventListener('resize', handleResize);
//       };
//     }, []);

//     const handleCallSupport = () => {
//         // Replace the phone number with the desired support number
//         window.location.href = 'tel:+91 96876 72555';
//       };
//       const handleSendEmail = () => {
//         const email = 'contact@vmukti.com'; // Replace with the desired support email address
//         const subject = 'Support Request';
//         const body = 'Hello, I need support with...'; // Replace with the desired email body
      
//         const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
//         window.open(mailtoUrl);
//       };
//       const handleOpenFAQ = () => {
//         // Replace the URL with the desired FAQ page URL
//         const faqUrl = 'https://ambicam.com/faq';
//         window.open(faqUrl, '_blank');
//       };

      
//       const userDetails = JSON.parse(localStorage.getItem('userDetails'));
//       // console.log(userDetails)
  
//       const customerId = userDetails.userId;
//       const username = userDetails.email;
//       const handleLogout = async () => {
//         // Perform logout logic here
//         try {
//           // Call the logout API
//           const logoutResult = await logout();
      
//           if (logoutResult.success) {
//             // Remove any items from local storage or perform any other necessary cleanup
//             localStorage.removeItem('isLoggedIn');
//             localStorage.removeItem('token');
//             console.log('logout',logoutResult)
//             // Redirect to the homepage after logout
//             router.push('/');
//           } else {
//             // Handle logout error
//             // You can display a message or take appropriate action
//             console.error('Logout error:', logoutResult.message);
//           }
//         } catch (error) {
//           // Handle unexpected errors, e.g., network issues
//           console.error('Logout error:', error);
//         }
    
//       };
      
//     return (
//         <Box bg={'gray.100'} minH="100vh" >
//         {/* Mobile Header */}
//         {isMobile && (<>
//          <MobileHeader />
//          </>
//        )}
 
//        {/* Desktop Header */}
//        {!isMobile && (
//          <DesktopHeader/>  )}

         
//     <Box align="center"  paddingLeft={3} paddingRight={3}>
          
//            <Flex direction="column" align="center" pt={"100px"}>
//                 <Avatar  name={username} bg="blue.200" size="xl" />
//                 <Heading mt={4} size="lg">
//                 Account Info
//                 </Heading>
//                 {/* <Text color="gray.500">Email</Text> */}
//             </Flex>
            
//             <Divider my={8} />

//     <VStack spacing={4} >
//     <Box p={4}>
//       {/* Other profile information */}
      
//       <Button  mb={4}>
//         {username}
//       </Button>

//     </Box>

//   {/* <Box>
//     <Text fontWeight="bold">Location:</Text>
//     {loading ? (
//         <Text>Loading location...</Text>
//       ) : (
//         <Text>{area},{city}</Text>
//       )}
//   </Box> */}

//   <Box p={4}>
//       {/* Other profile information */}
//         <Button
//           onClick={handleToggleContact}
//           variant="outline"
//           colorScheme="blue"
//           size="sm"
//           fontWeight="bold"
//           rounded="md"
//           mb={4}
//           // leftIcon={isContactVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
//         >
//           Contact Support
//         </Button>
      
//       {/* <Collapse in={isContactVisible} animateOpacity> */}
//         <Flex flexWrap="wrap">
//           <Stack direction="row" spacing={4}>
//             <Button onClick={handleCallSupport}> 
//               Call Support
//             </Button>
//             <Button onClick={handleOpenFAQ}>
//               FAQ
//             </Button>
//             <Button onClick={handleSendEmail}>
//               Email Support
//             </Button>
//           </Stack>
//         </Flex>
//       {/* </Collapse> */}
//       <Button
//           onClick={handleLogout}
//           variant="outline"
//           size="sm"
//           fontWeight="bold"
//           rounded="md"
//           mt={4}
//           colorScheme="red"
//           // leftIcon={isContactVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
//         >
//           Logout
//         </Button>
//     </Box>

//   {/* <Box>
//     <Text fontWeight="bold">Bio:</Text>
//     <Text>
//       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
//       malesuada mauris ac mi auctor, vitae fermentum felis posuere. Nulla
//       aliquet lacus vel dolor consequat consectetur. Curabitur nec nunc
//       sed velit aliquam semper. Donec nec finibus lectus.
//     </Text>
//   </Box> */}

//   {/* <Button colorScheme="teal">Edit Profile</Button> */}
// </VStack>
//      </Box>
//      </Box>
//     );
//   };
  
//   export default ProfilePage;


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import { Card, CardHeader, Badge, CardBody, CardFooter, Spacer, Stack, Heading, Button, Icon, IconButton, Flex, Avatar, Box, Text } from '@chakra-ui/react';
import { BiEnvelope, BiCamera, BiNotification, BiInfoCircle, BiPhone, BiArrowBack } from 'react-icons/bi';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FaSignOutAlt } from 'react-icons/fa';
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { FiBell } from 'react-icons/fi';
import ambicam from '@img/ambicam.png'
import ptnlogo from '@img/PatanjaliLogo.png'
import NotificationDialog from '@component/NotificationDialog';
import Image from 'next/image';
// import { logout } from '@api/auth';
import { logout } from './api/auth'



const ProfilePage = () => {
  const router = useRouter(); // Use useRouter hook
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
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


  const handleCallSupport = () => {
    window.location.href = 'tel:+91 96876 72555';
  };
  const handleSendEmail = () => {
    const email = 'contact@vmukti.com'; // Replace with the desired support email address
    const subject = 'Support Request';
    const body = 'Hello, I need support with...'; // Replace with the desired email body

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };
  // Function to handle incoming notifications from the WebSocket server
  const handleIncomingNotification = (notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
  };
  useEffect(() => {
    console.log("Useeffect inside")
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));



    if (userDetails) {
      console.log("UserDetailsss", userDetails)

      setEmail(userDetails.email);
      setUsername(userDetails.email); // Set username here
      console.log(userDetails)
      // alert(userDetails.langflag)
      setEmail(userDetails.email);
    }
    const staticMessage = "Our software is undergoing an upgrade for better performance. During the next 2 days, our downloading service will be temporarily paused. Your recordings are secure with us. For urgent needs, contact our support at `contact@vmukti.com`. We appreciate your understanding.";
    const initialCount = 1;
    setNotifications([staticMessage]);
    setNotificationCount(initialCount);

    const socket = new WebSocket('wss://octopus-app-gl75w.ondigitalocean.app:8080'); // Replace with your WebSocket server URL

    // WebSocket event handlers
    socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened:', event);
    });
    // Assuming you're handling incoming messages like this
    socket.addEventListener('message', (event) => {
      const notification = event.data;
      handleIncomingNotification(notification);
      setNotificationCount((prevCount) => prevCount + 1);
      // console.log('WebSocket message received:', event.data);
    });

    socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event);
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  const handleNotificationOpen = () => {
    // Increase the notification count and open the dialog
    // setNotificationCount(prevCount => prevCount + 1);
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    // Close the dialog
    setNotificationOpen(false);
  };
  const handleMarkAsRead = () => {
    setNotificationCount(0);
    handleNotificationClose();
  };
  const handleBackButtonClick = () => {
    router.back(); // Use useRouter to navigate back
  };

  const handleLogout = async () => {
    console.log("Logout clicked")
    try {
      const logoutResult = await logout();

      if (logoutResult.success) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        router.push('/');
      } else {
        console.error('Logout error:', logoutResult.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    (isMobile && (
      < div className = "main" >
      <Flex p={4} bg="gray.100" align="center" position="fixed" top={0} width={'100%'}>
        <Button size="md" onClick={handleBackButtonClick} colorScheme="gray" bgColor={"transparent"} mr="2" rightIcon={<ChevronLeftIcon />} />

        <Image style={{width:"40%",marginLeft:"15%",marginTop:"5%"}}  src={ptnlogo} alt='Patanjali logo' />
        <Spacer />
      </Flex>
      <Card maxW='md' marginTop='80px'>
        <CardHeader>
          <Flex spacing='4'>
            <Flex flex='1' gap='4' alignItems='center' ml='10px' flexWrap='wrap'>
              <Avatar name={username} bg="green.200" size="lg" mb={0} />
              <Box>
                <Heading size='sm'>{email}</Heading>
              </Box>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody>
          <Stack spacing='2'>

            <Card boxShadow="md" borderRadius="md" p={4} mb={4}>
              <CardHeader display="flex" alignItems="flex-start" flexDirection="column">
                <Flex alignItems="flex-start">
                  <Icon as={BiEnvelope} boxSize={5} color="gray.500" mr={2} mt={1} />
                  <Heading size="sm" color="grey">Email</Heading>
                </Flex>
                <Text size="sm" color="grey" mt={2} ml={7}>{email}</Text>
              </CardHeader>
              <CardHeader display="flex" alignItems="center">
                <Icon as={BiNotification} boxSize={5} color="gray.500" mr={2} /> {/* Notification icon */}
                <Heading size='sm' color="grey" flex="1">Notifications</Heading>
                <Box position="relative" display="inline-block">
                  <Badge
                    colorScheme="blue"
                    borderRadius="full"
                    px={2}
                    py={1}
                    fontSize="0.8em"
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    zIndex={1}
                  >
                    {notificationCount}
                  </Badge>
                  <IconButton
                    aria-label="Notifications"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={handleNotificationOpen}
                  >
                    <FiBell />
                  </IconButton>
                </Box>
                <NotificationDialog
                  isOpen={isNotificationOpen}
                  onClose={handleNotificationClose}
                  notificationCount={notificationCount}
                  onMarkAsRead={handleMarkAsRead}
                  notifications={notifications}
                />
              </CardHeader>
              <CardHeader
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                border="1px solid gray"
                borderRadius="md"
                onClick={handleLogout}
                p={4}
              >
                <Flex alignItems="center">
                  <Heading size="md" color="grey" >Logout</Heading>
                </Flex>
              </CardHeader>
            </Card>
          </Stack>
        </CardBody>


        <CardFooter
          justify='space-between'
          flexWrap='wrap'
          sx={{
            '& > button': {
              minW: '136px',
            },
          }}
        >

          <Button onClick={handleCallSupport} flex='1' variant='ghost' leftIcon={<BiPhone />}>
            Call Support
          </Button>
          <Button onClick={handleSendEmail} flex='1' variant='ghost' leftIcon={<BiEnvelope />}>
            Email Support
          </Button>
        </CardFooter>
      </Card>
    </div >
    ))
  );
}

export default ProfilePage;

  