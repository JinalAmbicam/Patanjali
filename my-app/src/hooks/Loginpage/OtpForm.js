import React, { useState , useEffect} from 'react';
import { Text, Button, HStack,PinInput,PinInputField, FormControl, FormLabel, Alert, AlertIcon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { verify } from '@api/auth' 
const useOtpInstance = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOTP] = useState(['', '', '', '','','','','','','','','']);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false); // Add this state variable
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e, index) => {
        if (!isOtpSubmitted) {
        const value = e.target.value.trim(); // Remove leading/trailing spaces
        const updatedOTP = [...otp];
        updatedOTP[index] = value;
        setOTP(updatedOTP);
        }else{
        setOTP(['', '', '', '','','','','','','','','']);
        setIsOtpSubmitted(false);
        }
    };
 
  

 
    const handleSubmitOTP = async() => {
        const emails = localStorage.getItem('email');
        const otpValue = otp.join(''); // Join without a delimiter
        console.log('OTP submitted:', otpValue);
        
        try {
        setErrorMessage('');
        setIsLoading(true); // Show the loader

        // Call the login function and pass the email, password, and langflag
        const verifyResult  = await verify(emails, otpValue);
       
        if (verifyResult.message === 'Email verification successfully') {
            setTimeout(() => {
            // Reload the page to go back to the login page
            window.location.reload();
            }, 2000);
        } 
        else {
            setIsLoading(false);
            setErrorMessage(verifyResult.error);
        }
        } catch (error) {
        setIsLoading(false);
        setErrorMessage(verifyResult.error);
        // Handle any errors that occur during the login process
        console.error('Error:', error);
        }
    };



  const otptitle = "Please Verify Your Account"
  const otpForm = (
  <>
        <FormControl id="">
        
         
     
          <FormLabel>Enter OTP</FormLabel>
            <HStack spacing={1}>
                <PinInput size="sm" variant="filled"  placeholder='*'>
                {otp.map((digit, index) => (
                  <PinInputField
                    key={index}
                    value={digit}  // Set the value of the field to the corresponding digit in the OTP array
                    onChange={(value) => handleChange(value, index)}  // Handle changes in the OTP field
                    isLast={index === otp.length - 1}
                  />
                ))}
                </PinInput>
              </HStack>
        </FormControl>
        <Button
              bg={'green.400'}
              color={'white'}
              _hover={{
                bg: 'green.500',
              }}
              w="100%" mt={4} onClick={handleSubmitOTP}
            >
            {isLoading ? 'Verifying...' : 'Submit'}
        </Button>
            <Alert status="success" mt={2}>
           <AlertIcon />
           We have sent you an OTP to your email for verification. Please check your inbox.
         </Alert>
        </>  
  );

  return {otptitle,
    otpForm,
  };
};

export default useOtpInstance;
