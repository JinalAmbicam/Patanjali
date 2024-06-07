
import {
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogCloseButton,
    AlertDialogBody,
    AlertDialogFooter,
    Button,Stack, Flex, Badge, Text
  } from '@chakra-ui/react';
  import PropTypes from 'prop-types';

  import React, { useState, useEffect } from 'react';

  const NotificationDialog = ({ isOpen, onClose, notificationCount,notifications, onMarkAsRead }) => {

      
    const handleMarkAsRead = () => {
      onMarkAsRead();
      onClose();
    };
  
    return (
      <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Notifications
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
            <Stack spacing={4}>
          {notifications.map((notification, index) => (
            <Flex
              key={index}
              p={2}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              alignItems="center"
            >
              <Badge colorScheme="teal" mr={2}>
                {index + 1}
              </Badge>
              <Text flex="1">{notification}</Text>
            </Flex>
          ))}
        </Stack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="blue" backgroundColor={"#63b3ed"} onClick={handleMarkAsRead}>
                Mark as Read
              </Button>
              <Button ml={4} variant="outline" onClick={onClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  };
  
  NotificationDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    notificationCount: PropTypes.number.isRequired,
    onMarkAsRead: PropTypes.func.isRequired,
 
  };
  
  export default NotificationDialog;
  