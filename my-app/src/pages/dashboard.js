import { useState ,useEffect} from 'react';
import { useRouter } from 'next/router';
import withAuth from '@component/withAuth';
import {
  Box, useColorModeValue,CloseButton,
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
  Image,
  Divider,Icon,
  VStack,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  HStack,
  Link
} from '@chakra-ui/react';
import { FiMenu, FiSettings, FiBell, FiX } from 'react-icons/fi';
import DesktopHeader from '@component/DesktopHeader';
import MobileHeader from '@component/MobileHeader';
import { BsCameraVideo, BsBell, BsCloudArrowDown, BsPeople, BsFillCarFrontFill } from 'react-icons/bs';
import { TbFaceId, TbArrowsDiff } from 'react-icons/tb'; // Replace with the actual import for TbFaceId and TbArrowsDiff
import { AiOutlineHeatMap } from 'react-icons/ai';
import { GrMultiple } from 'react-icons/gr';
import axios from 'axios';
import CameraList from '@/pages/CameraList';

const LinkItems = [
  { name: 'Cameras', icon: BsCameraVideo },
  { name: 'Multiple', icon: GrMultiple ,path: '/multiple'},
  { name: 'Events', icon: BsBell },
  { name: 'Archive Export', icon: BsCloudArrowDown },
  { name: 'Faces', icon: TbFaceId },
  { name: 'Heatmap', icon: AiOutlineHeatMap },
  { name: 'People', icon: BsPeople },
  { name: 'Visitors', icon: TbArrowsDiff },
  { name: 'ANPR', icon: BsFillCarFrontFill },
  { name: 'Settings', icon: FiSettings },
];

const DashboardPage = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
           <Link href={link.path}>{link.name}</Link>
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
            bg: 'cyan.400',
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


   
    <Box ml={{ base: 0, md: '5rem' }} p="0">
   
    <Box bg="gray.100" minH="100vh" >
    
    {/* Mobile Header */}
    {isMobile && (
    
      <MobileHeader headerText="Dashboard"/>

    )}

 
    {/* Main Content */}
    <Box   p={isMobile ? '4rem 0 0 0' : '4rem 0 0 0'}  paddingRight={0} >
   
    
    <CameraList/>
    
    {/* Footer */}
    {
      !isMobile &&(<>
        <Divider />
        <Box  p={4} textAlign="center" fontSize="sm" color="gray.500">
      &copy; 2023 Ambicam Camera App. All rights reserved.
    </Box>
    </>)
    }
  </Box>
  
      </Box>
    </Box>
  </Box>

  );
};
export default withAuth(DashboardPage);