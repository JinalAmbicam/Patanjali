// useSignupInstance.js
import React, { useState } from 'react';
import {
  Flex,
  VStack,
  Box,
  Image,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Checkbox,
  Stack,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {signup } from '@api/auth';
import { useRouter } from 'next/router';
import { useToast} from '@chakra-ui/react';

const useSignupInstance = (handleLoginClick,handleOtpClick) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const enterpriseId = localStorage.getItem("enterpriseId");
  
  const router = useRouter();

  const toast = useToast();
  const showToast = (msg,status1)=>{
    toast({
      description:msg,
      status:status1,
      duration: 2000,
      position:'bottom-left',
      isClosable:false
    })
  }

  const handleLoginnClick = () => {
    handleLoginClick()
  };
  
  const handleSignUp = async () => {
    if (rememberMe) {
      localStorage.setItem('rememberMe', true);
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('email');
    }
    try {
      setErrorMessage('');
      setIsLoading(true); // Show the loader

      const signupResult  = await signup(email, password,+enterpriseId);
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      if (signupResult.success) {
        setIsLoading(false);
        // OTP INTANCE
        await handleOtpClick()
        // setTimeout(() => {
          showToast("OTP sent Successfully",'success');
          
        // }, 700);
        
      } else {
        setIsLoading(false);
        // setErrorMessage(signupResult.message);
        showToast("Email and Password both are required",'warning');

        // console.log("SignupResult",signupResult.message)
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(signupResult.message);
      
      // Handle any errors that occur during the login process
      console.error('Error:', error);
    }
   
    
  }
  // Add the rest of your Signup-specific logic here



  const signuptitle = "Join With Us...!";
  const signupForm = (
    <>
      <FormControl id="email">
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email} required
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSignUp();
            }
          }}
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password} required
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSignUp();
              }
            }}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Checkbox mt={2} isChecked={rememberMe} onChange={() => setRememberMe(!rememberMe)}>
        Remember me
      </Checkbox>
      {errorMessage && (
        <Text color="red.500" fontSize="md" mt={2}>
          {errorMessage}
        </Text>
      )}
      <Stack spacing={4} mt={4}>
        <Button
          bg={'green.400'}
          color={'white'}
          _hover={{
            bg: 'green.500',
          }}
          isLoading={isLoading}
          onClick={handleSignUp}
          w="100%"
        >
          {isLoading ? 'Signing up...' : 'Sign up'}
        </Button>
        <Text
            color={'blue.400'}
            textAlign="center"
            onClick={handleLoginnClick}
            cursor="pointer"
          >
            Already having Account? Sign in
          </Text>
      </Stack>
    </>
  );

  return {
    signuptitle,
    signupForm,handleLoginnClick,
  };
};

export default useSignupInstance;
