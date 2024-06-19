import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  Spacer,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  AvatarBadge,
  Grid,
  GridItem,
  Divider,
  VStack,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  HStack,
  Link,
  Badge,
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  FiMenu,
  FiSettings,
  FiBell,
  FiX,
  FiHome,
  FiUser,
} from "react-icons/fi";
import { GrMultiple } from "react-icons/gr";
import NotificationDialog from "@component/NotificationDialog";
import amb from "@img/amb.png";
import Image from "next/image";
import { logout } from "@api/auth";
import ptnlogo from "@img/PatanjaliLogo.png";
import { FiChevronDown, FiMapPin } from "react-icons/fi";
import {
  MdOutlineManageAccounts,
  MdOutlineDashboardCustomize,
} from "react-icons/md";
import { TbCameraCog } from "react-icons/tb";

const MobileHeader = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Retrieve user details from local storage
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails) {
      console.log(userDetails);
      // alert(userDetails.langflag)
      setEmail(userDetails.email);
    }
    // const staticMessage = "Our software is undergoing an upgrade for better performance. During the next 2 days, our downloading service will be temporarily paused. Your recordings are secure with us. For urgent needs, contact our support at `contact@vmukti.com`. We appreciate your understanding.";
    // const initialCount = 1;
    // setNotifications([staticMessage]);
    // setNotificationCount(initialCount);

    const socket = new WebSocket(
      "wss://octopus-app-gl75w.ondigitalocean.app:8080"
    ); // Replace with your WebSocket server URL

    // WebSocket event handlers
    socket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened:", event);
    });
    // Assuming you're handling incoming messages like this
    socket.addEventListener("message", (event) => {
      const notification = event.data;
      handleIncomingNotification(notification);
      setNotificationCount((prevCount) => prevCount + 1);
      // console.log('WebSocket message received:', event.data);
    });

    socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event);
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    // Perform logout logic here
    try {
      // Call the logout API
      const logoutResult = await logout();

      if (logoutResult.success) {
        // Remove any items from local storage or perform any other necessary cleanup
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        console.log("logout", logoutResult);
        // Redirect to the homepage after logout
        router.push("/");
      } else {
        // Handle logout error
        // You can display a message or take appropriate action
        console.error("Logout error:", logoutResult.message);
      }
    } catch (error) {
      // Handle unexpected errors, e.g., network issues
      console.error("Logout error:", error);
    }
  };
  const bottomNavItems = [
    {
      label: "Home",
      icon: <FiHome />,
      onClick: () => router.push("/dashboard"),
    },
    {
      label: "Multiple",
      icon: <GrMultiple />,
      onClick: () => router.push("/multiple"),
    },
    {
      name: "Dashboard",
      icon: <MdOutlineDashboardCustomize />,
      onClick: () => router.push("/dashboard2"),
    },
    {
      name: "CameraList",
      icon: <TbCameraCog />,
      onClick: () => router.push("/manageCamera"),
    },
    {
      name: "UserList",
      icon: <MdOutlineManageAccounts />,
      onClick: () => router.push("/manageUser"),
    },
  
    // Add more navigation items as needed
  ];

  const Sidebar = () => (
    <Drawer
      placement={isMobile ? "left" : "left-start"}
      onClose={onClose}
      isOpen={isMobile ? isOpen : true}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader margin={4} borderBottomWidth="1px">
          <Flex justify="space-between" align="center">
            <Box>
              <Flex direction="row" align="center">
                <Avatar name={email} bg="blue.200" size="sm">
                  <AvatarBadge boxSize="1.2em" bg="blue.200" />
                </Avatar>
                <Text ml={2} fontWeight="bold">
                  {email.split("@")[0]}
                </Text>
              </Flex>
            </Box>
            <IconButton
              icon={<FiX />}
              aria-label="Close"
              variant="ghost"
              colorScheme="blue"
              onClick={onClose}
            />
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="start">
            <Button
              colorScheme="blue"
              variant="ghost"
              width="full"
              onClick={() => router.push("/dashboard")}
            >
              Home
            </Button>
            <Button
              colorScheme="blue"
              variant="ghost"
              width="full"
              onClick={() => router.push("/profile")}
            >
              Profile
            </Button>
            <Button colorScheme="blue" variant="ghost" width="full">
              Cameras
            </Button>

            <Button
              colorScheme="blue"
              variant="ghost"
              width="full"
              onClick={() => router.push("/multiple")}
            >
              Multiple Screen
            </Button>
            <Button colorScheme="blue" variant="ghost" width="full">
              Settings
            </Button>
            <Button
              colorScheme="blue"
              variant="ghost"
              width="full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );

  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

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
    // Reset the notification count
    setNotificationCount(0);
    handleNotificationClose();
  };

  const [notifications, setNotifications] = useState([]);

  // Function to handle incoming notifications from the WebSocket server
  const handleIncomingNotification = (notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  return (
    <Box
      bg="gray.100"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={10}
    >
      {/* <Sidebar  /> */}
      <Flex
        p={4}
        bg="gray.100"
        align="center"
        position="fixed"
        top={0}
        width={"100%"}
      >
        {/* <IconButton
      icon={<FiMenu />}
      aria-label="Menu"
      variant="ghost"
      colorScheme="blue"
      onClick={onOpen}
    /> */}
        {/* <Image height={40} width={40} src={amb}></Image> */}
        <Spacer />
        <Spacer />
        <Image
          style={{ width: "40%", marginTop: "2%", marginRight: "40%" }}
          src={ptnlogo}
          alt="Patanjali logo"
        />
        {/* <Box position="relative" display="inline-block">
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
      </Box> */}

        {/* Notification Dialog */}
        {/* <NotificationDialog
        isOpen={isNotificationOpen}
        onClose={handleNotificationClose}
        notificationCount={notificationCount}
        onMarkAsRead={handleMarkAsRead}
        notifications={notifications}
      /> */}
        <Spacer></Spacer>
        <Box ml={"20px"} onClick={() => router.push("/profile")}>
          <Stack direction="row">
            <Avatar name={email} bg="red.300" size="sm" />
          </Stack>
        </Box>
      </Flex>
      {/* Bottom Navigation Bar */}
      {isMobile && (
        <Flex
          bg="grey.300"
          style={{ boxShadow: "2px 20px 10px 14px" }}
          p={3.5}
          justify="space-around"
          align="center"
        >
          {bottomNavItems.map((item, index) => (
            <Box key={index} textAlign="center" onClick={item.onClick}>
              <div style={{ marginLeft: "25%" }}>{item.icon}</div>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default MobileHeader;
