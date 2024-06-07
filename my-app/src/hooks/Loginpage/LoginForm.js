import React, { useState, useEffect } from "react";
import { login, reverify, verify } from "@api/auth";
import { useRouter } from "next/router";
import {
  Flex,
  HStack,
  PinInput,
  PinInputField,
  Alert,
  AlertIcon,
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
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const useLoginInstance = (handleSignUpClick, handleForgotClick) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationMessageVisible, setVerificationMessageVisible] =
    useState(false);
  const router = useRouter();
  const enterpriseId = localStorage.getItem("enterpriseId");
  const [otp, setOTP] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false); // Add this state variable

  const toast = useToast();
  const showToast = (msg, status1) => {
    toast({
      description: msg,
      status: status1,
      duration: 3000,
      position: "bottom-left",
      isClosable: true,
    });
  };
  const handleChange = (e, index) => {
    if (!isOtpSubmitted) {
      const value = e.target.value.trim(); // Remove leading/trailing spaces
      const updatedOTP = [...otp];
      updatedOTP[index] = value;
      setOTP(updatedOTP);
    } else {
      setOTP(["", "", "", "", "", "", "", "", "", "", "", ""]);
      setIsOtpSubmitted(false);
    }
  };

  const handleSubmitOTP = async () => {
    const emails = localStorage.getItem("email");
    const otpValue = otp.join(""); // Join without a delimiter
    console.log("OTP submitted:", otpValue);

    try {
      setErrorMessage("");
      setIsLoading(true); // Show the loader

      // Call the login function and pass the email, password, and langflag
      const verifyResult = await verify(emails, otpValue);

      if (verifyResult.message === "Email verification successfully") {
        setTimeout(() => {
          // Reload the page to go back to the login page
          window.location.reload();
        }, 2000);
      } else {
        setIsLoading(false);
        setErrorMessage(verifyResult.message);
      }
    } catch (error) {
      setIsLoading(false);
      // setErrorMessage(verifyResult.message);
      // Handle any errors that occur during the login process
      console.error("Error:", error);
    }
  };

  const handleLogin = async () => {
    if (rememberMe) {
      localStorage.setItem("rememberMe", true);
      localStorage.setItem("email", email);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("email");
    }

    try {
      setErrorMessage("");
      setIsLoading(true); // Show the loader

      // Call the login function and pass the email, password, and langflag
      localStorage.setItem("email", email);
      const loginResult = await login(email, password, +enterpriseId);
      if (loginResult.success) {
        localStorage.setItem("userDetails", JSON.stringify(loginResult.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("email", loginResult.user.email);
        localStorage.setItem("token", loginResult.token);
        localStorage.setItem("userId", loginResult.user.customerid);
        localStorage.setItem("langflag", "en");

        // Redirect to the dashboard page
        await router.push("/dashboard");
        showToast("Logged in Successfully", "success");
      } else {
        setIsLoading(false);
        // setErrorMessage(loginResult.message);
        showToast(loginResult.message, "warning");
      }
    } catch (error) {
      // setIsLoading(false);
      // setErrorMessage(loginResult.message);
      // console.error("Error:", error);
      setIsLoading(false);
      setErrorMessage(error.message); // Use 'error' instead of 'loginResult'
      console.error("Error:", error);
    }
  };

  const verifyhere = async () => {
    setErrorMessage("");
    setIsLoading(false);
    const emails = localStorage.getItem("email");

    try {
      setErrorMessage("");

      // Call the login function and pass the email, password, and langflag
      const reverifi = await reverify(emails);
      console.log(reverifi);
      if (reverifi.message) {
      } else {
        setIsLoading(false);
        setErrorMessage(reverifi.message);
      }
    } catch (error) {
      setIsLoading(false);
      // setErrorMessage(reverifi.message);
      // Handle any errors that occur during the login process
      console.error("Error:", error);
    }
    setVerificationMessageVisible(true);
  };

  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check if "rememberMe" was previously selected and set the state accordingly
    const rememberMeStatus = localStorage.getItem("rememberMe");
    if (rememberMeStatus === "true") {
      setRememberMe(true);
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);

  const handleSignupClick = () => {
    handleSignUpClick(); // Call the provided callback
  };

  const handleforgotClick = () => {
    handleForgotClick(); // Call the provided callback
  };

  const logintitle = "Sign in to your account";
  const loginForm = (
    <>
      {!isVerificationMessageVisible && (
        <>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
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
          <Checkbox
            mt={2}
            isChecked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          >
            Remember me
          </Checkbox>
          {errorMessage && (
            <Text color="red.500" fontSize="md" mt={2}>
              {errorMessage}
            </Text>
          )}
          {errorMessage === "Your account is not verified." && (
            <Button
              bg={"green.400"}
              color={"white"}
              _hover={{ bg: "green.500" }}
              onClick={verifyhere}
              isLoading={isLoading}
              w="100%"
            >
              {isLoading ? "Sending Verification OTP...!" : "Click to Verify"}
            </Button>
          )}
          <Stack spacing={4}>
            <Text
              color={"blue.400"}
              textAlign="right"
              onClick={handleforgotClick}
              cursor={"pointer"}
            >
              Forgot password?
            </Text>
            <Button
              bg={"green.400"}
              color={"white"}
              _hover={{
                bg: "green.500",
              }}
              isLoading={isLoading}
              onClick={handleLogin}
              w="100%"
            >
              {isLoading ? "Logging in..." : "Sign in"}
            </Button>
            <Text
              color={"blue.400"}
              textAlign="center"
              onClick={handleSignupClick}
              cursor="pointer"
            >
              Don't have an account? Sign up
            </Text>
          </Stack>
        </>
      )}

      {isVerificationMessageVisible && (
        <>
          <FormControl id="">
            <FormLabel>Enter OTP</FormLabel>
            <HStack spacing={1}>
              <PinInput size="sm" variant="filled" placeholder="*">
                {otp.map((digit, index) => (
                  <PinInputField
                    key={index}
                    value={digit} // Set the value of the field to the corresponding digit in the OTP array
                    onChange={(value) => handleChange(value, index)} // Handle changes in the OTP field
                    isLast={index === otp.length - 1}
                  />
                ))}
              </PinInput>
            </HStack>
          </FormControl>
          <Button
            bg={"green.400"}
            color={"white"}
            _hover={{
              bg: "green.500",
            }}
            w="100%"
            mt={4}
            onClick={handleSubmitOTP}
          >
            {isLoading ? "Verifying..." : "Submit"}
          </Button>
          <Alert status="success" mt={2}>
            <AlertIcon />
            We have sent you an OTP to your email for verification. Please check
            your inbox.
          </Alert>
        </>
      )}
    </>
  );

  return { logintitle, loginForm, handleSignupClick, handleforgotClick };
};

export default useLoginInstance;
