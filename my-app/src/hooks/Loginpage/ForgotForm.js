import React, { useState , useEffect} from 'react';
import { Box, Button, Input, FormControl, FormLabel, Alert, Text,AlertIcon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { forgotPassword } from '@api/auth' 
import { useToast } from '@chakra-ui/react';
const useForgotInstance = (handleLoginClick2) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const handleLoginnClick2 = () => {
      handleLoginClick2()
    };
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
    const handleForgotPassword = async () => {
      try {
        setErrorMessage('');
        setIsLoading(true); // Show the loader
  
        // Call the forgotPassword function and pass the email
        const forgotPasswordResult = await forgotPassword(email);
  
        if (forgotPasswordResult.success) {
          // Redirect to the login page
          //setErrorMessage('Password reset email sent successfully');
          setTimeout(() => {
            showToast("Password reset email sent successfully","success")
          }, 1000);
          // router.push('/');
          setIsLoading(false);
          // setTimeout(() => {
          //   showToast('Password changed Successfully', 'success');
          // }, 1000);
        } else {
          setIsLoading(false);
          setErrorMessage('Invalid email ');
          showToast("Invalid Email","error");
        }
      } catch (error) {
        setIsLoading(false);
        setErrorMessage('Invalid email');
        // Handle any errors that occur during the forgot password process
        console.error('Error:', error);
      }
    }


  const forgottitle = "Forgot Your Password"
  const forgotForm = (
  <>
  {errorMessage && (
            <Text color="red.500" fontSize="md" mt={2}>
              {errorMessage}
            </Text>
          )}
                <FormControl id="forgot-password-email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    // Add necessary state and onChange for forgot password email
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  isLoading={isLoading} mt={3}
                  // Add onClick handler for sending reset password email
                  onClick={handleForgotPassword}
                  w="100%"
                >
                  {isLoading ? 'Sending email...' : 'Send reset email'}
                </Button>
                <Text
                  color={'blue.400'}
                  textAlign="center"
                  onClick={handleLoginnClick2}
                  cursor="pointer"
                >
                  Remember your password? Log in
                </Text>
     </>
  );

  return {forgottitle,
    forgotForm,handleLoginnClick2
  };
};

export default useForgotInstance;
