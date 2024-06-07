// SharedCameras.js
import React from 'react';
import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Image,
  HStack,
  Icon,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit, FiTrash2, SettingsIcon } from 'react-icons/fi';

const SharedCameras = ({ shareCameraList, handleOpenModal, handleEditCameraName, handleCameraSettingsClick, handleDeleteCamera }) => {
  return (
    <Box
      maxH="calc(100vh - 250px)"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '0.2em',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
        },
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 transparent',
        ':active': {
          overflowY: 'scroll',
        },
      }}
    >
      {shareCameraList.length === 0 ? (
        <Flex alignItems="center" justifyContent="center" height="100%">
          <Box p={6} borderWidth={1} borderRadius="lg" borderColor="gray.300" boxShadow="md" bg="white">
            <Flex direction="column" alignItems="center" color="gray.500">
              <Icon as={FaVideoSlash} boxSize={20} color="blue.500" />
              <Text fontSize="xl" mt={4} fontWeight="bold">
                Oh no! No shared cameras found.
              </Text>
              <Text fontSize="md" mt={2} textAlign="center">
                It looks like you haven't been granted access to any shared cameras yet.
              </Text>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={4}>
          {shareCameraList.map((camera) => (
            <GridItem key={camera.cameraid} width={window.innerWidth <= 280 ? '280px' : ''}>
              <Box
                bg="white"
                borderRadius="md"
                p={1}
                mb={2}
                boxShadow="md"
                transition="transform 0.3s, box-shadow 0.3s"
                _hover={{
                  transform: 'scale(1.03)',
                  boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Box position="relative" cursor="pointer">
                  <Image
                    src={localStorage.getItem(`thumbnail_${camera.cameraid}`) || camera.thumbnailUrl || 'https://via.placeholder.com/600x342/000000/?text='}
                    onClick={() => handleOpenModal(camera.streamname, camera.createdDate, camera.plandays, camera.cameraid, camera.cameraname, camera.planname, camera.islive, camera.cameraurl, camera.deviceid)}
                    alt="Camera"
                    size={modalSize}
                    height={imageHeight}
                  />
                  <Text
                    position="absolute"
                    top="50%"
                    left="50%"
                    fontSize={25}
                    transform="translate(-50%, -50%)"
                  >
                    ▶
                  </Text>
                  {camera.islive ? (
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      fontSize="sm"
                      colorScheme="green"
                    >
                      On
                    </Badge>
                  ) : (
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      fontSize="sm"
                      colorScheme="red"
                    >
                      Off
                    </Badge>
                  )}
                </Box>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold" fontSize="sm" p={1}>
                    {camera.cameraname} <span style={{ fontSize: '11px', fontWeight: '500' }}>({camera.deviceid})</span>
                  </Text>
                  <Menu placement="top">
                    <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" />
                    <MenuList>
                      <MenuItem onClick={handleEditCameraName} icon={<FiEdit}>Edit Camera Name</MenuItem>
                      <MenuItem onClick={() => handleCameraSettingsClick(camera.planname, camera.deviceid)} icon={<SettingsIcon />}>Camera Settings</MenuItem>
                      <MenuItem onClick={() => handleDeleteCamera(camera.cameraid)} icon={<FiTrash2}>Remove Camera</MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </Box>
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SharedCameras;
