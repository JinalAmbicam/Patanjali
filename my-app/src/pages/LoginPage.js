import { Box, Button, Collapse,InputGroup,InputRightElement,Text,Flex,useColorModeValue,Stack,Heading,Checkbox, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'
import logo from '@img/PatanjaliLogo.png'

import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import useLoginInstance from '../hooks/Loginpage/LoginForm';
import  useSignupInstance  from '../hooks/Loginpage/SignupForm'
import  useOtpInstance  from '../hooks/Loginpage/OtpForm'
import  useForgotInstance  from '../hooks/Loginpage/ForgotForm'

const LoginPage = () => {
  const [isLoginOpen, setLoginOpen] = useState(true);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isOtpOpen, setOtpOpen] = useState();
  const [isForgotOpen, setForgotOpen] = useState();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // login form instance hooks
  const handleSignUpClick = () => {
    setLoginOpen(false)
    setSignUpOpen(true);
  };
  const handleForgotClick = () => {
    setLoginOpen(false);
    setForgotOpen(true)
   }
  
  const { logintitle, loginForm } = useLoginInstance( handleSignUpClick,handleForgotClick);
//////////////////////////////////////////////////////////////////////////////////////////////////////////
  // signup form instance hooks
  const handleLoginClick = () => {
    setLoginOpen(true);
    setSignUpOpen(false);
  };

    const handleOtpClick = () => {
      setLoginOpen(false);
      setSignUpOpen(false);
      setOtpOpen(true);
    };
  const { signuptitle, signupForm } = useSignupInstance(handleLoginClick,handleOtpClick);

//////////////////////////////////////////////////////////////////////////////////////////////////////////
  // OTP form instance hooks
  const { otptitle, otpForm } = useOtpInstance(setOtpOpen, handleLoginClick); // Implement the OTP form instance

//////////////////////////////////////////////////////////////////////////////////////////////////////////
const handleLoginClick2 = () => {

  setSignUpOpen(false);
  setForgotOpen(false);
  setLoginOpen(true);
};
 const { forgottitle, forgotForm } = useForgotInstance(handleLoginClick2);

  return (
  
    <Flex
    overflowY={'hidden'}
    minH={'100vh'}
    align={'center'}
    justify={'center'}
    bg={useColorModeValue('gray.50', 'gray.800')}>
    <VStack spacing={4} mx={'auto'} maxW={'lg'} p={6} >
      <Image src={logo} alt='ambicam logo' width="200"
      // width={isSmallScreen ? 50 : undefined}
        // height={isSmallScreen ? 'auto' : undefined}
        />
          {isLoginOpen && (
            <Heading fontSize={'2xl'} textAlign="center">{logintitle}</Heading>
          )}

          {isSignUpOpen && (
            <Heading fontSize={'2xl'} textAlign="center">{signuptitle}</Heading>
          )}
          {isOtpOpen && (
            <Heading fontSize={'2xl'} textAlign="center">{otptitle}</Heading>
          )}
          {isForgotOpen && (
            <Heading fontSize={'2xl'} textAlign="center">{forgottitle}</Heading>
          )}
      
      <Text fontSize={'md'} color={'gray.600'} textAlign="center">
        to enjoy all of our cool <span style={{ color: "#4299E1" }}>features</span>
      </Text>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={6}
        w="100%"
        >
          {isLoginOpen && (<>{loginForm}</>)}
          {isSignUpOpen && (<>{signupForm}</>)}
          {isOtpOpen && (<>{otpForm}</>)}
          {isForgotOpen && (<>{forgotForm}</>)}
      </Box>
    </VStack>
  </Flex>
 
  );
};

export default LoginPage;
