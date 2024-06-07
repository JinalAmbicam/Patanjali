import { Box, Button, Collapse, InputGroup, InputRightElement, Text, Flex, useColorModeValue, Stack, Heading, Checkbox, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from '@img/logo.png';
import { resetPassword } from '@api/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
    const [isLoginOpen, setLoginOpen] = useState(true);
    const [isSignUpOpen, setSignUpOpen] = useState(false);
    const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Add this line
    const [langflag, setLangFlag] = useState('');
    const [loginResult, setLoginResult] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Add this line
    const router = useRouter();
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    useEffect(() => {

        // Check for a small screen based on window height
        function handleResize() {
            setIsSmallScreen(window.innerHeight < 676);
        }

        // Add an event listener for window resize
        window.addEventListener('resize', handleResize);

        // Initial check
        handleResize();

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [rememberMe, setRememberMe] = useState(false);
    useEffect(() => {
        // Check if "rememberMe" was previously selected and set the state accordingly
        const rememberMeStatus = localStorage.getItem('rememberMe');
        if (rememberMeStatus === 'true') {
            setRememberMe(true);
            const storedEmail = localStorage.getItem('email');
            if (storedEmail) {
                setEmail(storedEmail);
            }
        }
    }, []);

    // const handleRememberMe = () => {
    //   setRememberMe(!rememberMe);
    // };

    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        try {
            const token = router.query.resetToken;
            console.log(token);
            const loginResult = await resetPassword(password, confirmPassword, token);

            if (loginResult.success) {

                router.push('/dashboard');
            } else {
                setIsLoading(false);
                setErrorMessage('Invalid email or password');
            }
        } catch (error) {
            setIsLoading(false);
            setErrorMessage('Invalid email or password');
            // Handle any errors that occur during the login process
            console.error('Error:', error);
        }
    };


    return (
        <Flex
            overflowY={'hidden'}
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <VStack spacing={4} mx={'auto'} maxW={'lg'} p={6} w="100%">
                <Image src={logo} alt='ambicam logo' width={isSmallScreen ? 100 : undefined}
                    height={isSmallScreen ? 'auto' : undefined} />
                <Heading fontSize={'2xl'} textAlign="center">Sign in to your account</Heading>
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
                    <FormControl id="password">
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                    <FormControl id="password">
                        <FormLabel>Confirm Password</FormLabel>
                        <InputGroup>
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <InputRightElement width="4.5rem">
                                <Button
                                    h="1.75rem"
                                    size="sm"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>

                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <Text
                        color={'blue.400'}
                        textAlign="center"
                        onClick={() => router.push('/')}
                        cursor="pointer"
                    >
                        Remember your password? Log in
                    </Text>
                    <Button
                        mt={4}
                        colorScheme="teal"
                        isLoading={isLoading}
                        onClick={handleResetPassword}
                    >
                        Reset Password
                    </Button>


                    {/* <Checkbox isChecked={rememberMe} onChange={handleRememberMe}>Remember me</Checkbox> */}
                    {errorMessage && (
                        <Text color="red.500" fontSize="md" mt={2}>
                            {errorMessage}
                        </Text>
                    )}
                </Box>
            </VStack>
        </Flex>
    );
};

export default ResetPassword;
