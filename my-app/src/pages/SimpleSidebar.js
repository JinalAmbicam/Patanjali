import React, { ReactNode, useState } from 'react';
import { IconButton, Box, CloseButton, Flex, Icon, useColorModeValue,Divider, Text, Drawer, DrawerContent, useDisclosure, BoxProps, FlexProps } from '@chakra-ui/react';
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu } from 'react-icons/fi';
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { BiSolidUserDetail } from "react-icons/bi";
import { BsCameraVideo, BsBell, BsCloudArrowDown, BsPeople, BsFillCarFrontFill } from 'react-icons/bs';
import { TbFaceId, TbArrowsDiff } from 'react-icons/tb'; // Replace with the actual import for TbFaceId and TbArrowsDiff
import { AiOutlineHeatMap } from 'react-icons/ai';
// import { FiSettings } from 'react-icons/fi';
import DesktopHeader from '@/components/DesktopHeader';
import MobileHeader from '@/components/MobileHeader';
import Dashboard from './dashboard';
import withAuth from '@component/withAuth';
import CameraList from './CameraList';
const LinkItems = [
  { name: 'Cameras', icon: BsCameraVideo },
  { name: 'Events', icon: BsBell },
  { name: 'Archive Export', icon: BsCloudArrowDown },
  { name :'manageUser', icon:BiSolidUserDetail },
  { name: 'Faces', icon: TbFaceId },
  { name: 'Heatmap', icon: AiOutlineHeatMap },
  { name: 'People', icon: BsPeople },
  { name: 'Visitors', icon: TbArrowsDiff },
  { name: 'ANPR', icon: BsFillCarFrontFill },
  { name: 'Settings', icon: FiSettings },
  { name: 'Dashboard', icon:MdOutlineDashboardCustomize }
];

 const SimpleSidebar= ()=> {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      {/* Mobile Header */}
      {isMobile && (
      
      <MobileHeader />

    )}

    {/* Desktop Header */}
    {!isMobile && (
      
      <Box position="fixed" top={0} left={0} width="100%" zIndex={9}>
      <DesktopHeader />
    </Box> 
     
      )}

      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: '5rem' }} p="0">
      <Box marginTop={isMobile ? '0rem' : '4rem'}  > {/* mt="4rem" Add margin-top here */}
      <Box bg="gray.100" minH="100vh" >
      
      {/* Mobile Header */}
      {isMobile && (
      
        <MobileHeader />

      )}

      {/* Desktop Header */}
      {/* {!isMobile && (
        
        <DesktopHeader />  
       
        )} */}


      {/* Main Content */}
      <Box  marginTop={isMobile ? '5rem' : '0rem'}  paddingRight={3} >
     
      
      <CameraList/>
      {/* Footer */}
      <Divider />
      <Box p={4} textAlign="center" fontSize="sm" color="gray.500">
        &copy; 2023 Smart Home Camera App. All rights reserved.
      </Box>
    </Box>
    </Box>
        </Box>
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      bg={'gray.100'}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: '5rem' }}
      pos="fixed"
      h="full"
      {...rest}
    >
      {/* <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
      </Flex> */}
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        direction="column" // Set direction to 'column'
        align="center"
        pt="4"
        pb="4"
        pl="6"
        pr="6"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'grey.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            fontSize="20" // Set icon size to 20
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        <Text fontSize="10">{children}</Text> {/* Set text size to 10 */}
      </Flex>
    </Box>
  );
};


const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};

export default withAuth(SimpleSidebar);