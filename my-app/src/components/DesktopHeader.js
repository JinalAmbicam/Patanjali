"use client";

import {
  Badge,
  Box,
  Flex,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  HStack,
  VStack,
  IconButton,
  Link,
  Icon,
} from "@chakra-ui/react";
import ambicam from "@img/ambicam.png";
import ptnlogo from "@img/PatanjaliLogo.png";
import Image from "next/image";
import NotificationDialog from "@component/NotificationDialog";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { BsCameraVideo, BsCollectionPlay } from "react-icons/bs";
import { BiSolidUserDetail } from "react-icons/bi";
import { FiChevronDown, FiSettings, FiBell } from "react-icons/fi";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TbCameraCog } from "react-icons/tb";
import { FiMapPin } from "react-icons/fi";




import { logout } from "@api/auth";
const NavLink = (props) => {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

const LinkItems = [
  { name: "Cameras", icon: BsCameraVideo, path: "/dashboard" },
  { name: "Multiple", icon: BsCollectionPlay, path: "/multiple" },
  { name: "UserList", icon: MdOutlineManageAccounts, path: "/manageUser" },
  {name: "Dashboard", icon: MdOutlineDashboardCustomize,path:"/dashboard2"},
  {name:"ManageCamera", icon:TbCameraCog,path:"/manageCamera"},
  {name:"googlemap", icon:FiMapPin,path:"/googlemap"}

  // { name: 'Settings', icon: FiSettings },
];

export default function Header() {
  const router = useRouter();
  const userDetailsString = localStorage.getItem("userDetails");
  const userDetails = JSON.parse(userDetailsString);
  const Loggeduserrole = userDetails.role;
  const handleLogout = async () => {
    try {
      const logoutResult = await logout();

      if (logoutResult.success) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        router.push("/");
      } else {
        console.error("Logout error:", logoutResult.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  

  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleNotificationOpen = () => {
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
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Retrieve user details from local storage
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails) {
      // console.log(userDetails);
      // alert(userDetails.langflag)
      setEmail(userDetails.email);
    }
  }, []);

  const handleCallSupport = () => {
    window.location.href = "tel:+91 96876 72555";
  };
  const handleSendEmail = () => {
    const email = "contact@vmukti.com";
    const subject = "Support Request";
    const body = "Hello, I need support with...";

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };
  const handleOpenFAQ = () => {
    // Replace the URL with the desired FAQ page URL
    const faqUrl = "https://ambicam.com/faq";
    window.open(faqUrl, "_blank");
  };

  // State for managing notifications
  const [notifications, setNotifications] = useState([]);

  // Function to handle incoming notifications from the WebSocket server
  const handleIncomingNotification = (notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  const SidebarContent = ({ onClose, ...rest }) => {
    const filteredLinkItems = LinkItems.filter(link => {
      if (["local", "regional", "zonal","super", "panIn", "No Role"].includes(Loggeduserrole)) {
        return link.name !== "UserList" && link.name !== "Dashboard" && link.name !== "ManageCamera" ;
      } else {
        return true;
      }
    });
    return (
      <Box
        bg={"gray.100"}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.300", "gray.700")}
        w={{ base: "full", md: "4.5rem" }}
        pos="fixed"
        h="full"
        {...rest}
      >
        {filteredLinkItems.map((link) => (
        <NavItem key={link.name} path={link.path} icon={link.icon}>
          <Link style={{ textDecoration: "none" }} href={link.path}>
            {link.name}
          </Link>
        </NavItem>
      ))}
      </Box>
    );
  };
  const NavItem = ({ icon, children, path, ...rest }) => {
    const router = useRouter();
    const isActive = router.pathname === path;

    return (
      <Box
        as="a"
        href={path}
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          direction="column"
          align="center"
          mt={3}
          mb={3}
          pt="2"
          pb="2"
          mx="1.5"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            // color: "green",
            
          }}
          {...rest}
          color={isActive ? "green.500" : "inherit"} // Set text color to green if active
        >
          {icon && (
            <Icon
              fontSize="24"
              as={icon}
              _groupHover={{
                // color: "green",
                fontSize:"26"
              }}
              color={isActive ? "green.500" : "inherit"} // Set icon color to green if active
            />
          )}
          <Text fontSize="12">{children}</Text>
        </Flex>
      </Box>
    );
  };

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        boxShadow={"base"}
        zIndex={9999}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            {" "}
            <Image
              style={{ width: "30%" }}
              src={ptnlogo}
              alt="Patanjali logo"
            />{" "}
          </Box>
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <HStack spacing={{ base: "0", md: "6" }}>
                <Flex alignItems="center">
                  <Menu>
                    <MenuButton
                      py={2}
                      transition="all 0.3s"
                      _focus={{ boxShadow: "none" }}
                    >
                      <HStack>
                        <Avatar size="sm" name={email} bg="red.200" />
                        <VStack
                          display={{ base: "none", md: "flex" }}
                          alignItems="flex-start"
                          spacing="1px"
                          ml="2"
                        >
                          <Text fontSize="sm">{email}</Text>
                          <Text fontSize="md" color="gray.600">
                            {Loggeduserrole}
                          </Text>
                        </VStack>
                        <Box display={{ base: "none", md: "flex" }}>
                          <FiChevronDown />
                        </Box>
                      </HStack>
                    </MenuButton>
                    <MenuList bg="white" borderColor="gray.200">
                      {/* <MenuItem>Settings</MenuItem> */}

                      <MenuItem onClick={handleCallSupport}>
                        Call Support
                      </MenuItem>

                      <MenuItem onClick={handleOpenFAQ}>FAQ</MenuItem>

                      <MenuItem onClick={handleSendEmail}>
                        Email Support
                      </MenuItem>

                      {/* <MenuItem>Billing</MenuItem> */}
                      <MenuDivider />
                      <MenuItem onClick={handleLogout}>Sign out</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </HStack>
            </Stack>
          </Flex>
        </Flex>
      </Box>
      <SidebarContent
        mt={0.5}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
    </>
  );
}
