// OfflineMessage.js
import { motion } from 'framer-motion';
import { FaVideoSlash } from 'react-icons/fa';
import { Text, Icon } from '@chakra-ui/react';

const OfflineMessage = ({style}) => (
    <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    style={{
        ...style,
      justifyContent: 'center',
      alignItems: 'center',
    //   height: '65vh',
      backgroundColor: '#1a1a1a', // Dark background color
      border: '1px solid #555', // Darker border color
      borderRadius: '5px',
    //   margin: '20px',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Slightly stronger shadow
      flexDirection: 'column',
      display: 'flex',
      color: '#fff',
      textAlign: 'center',
      padding: '20px', // Add some padding
    }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Icon as={FaVideoSlash} boxSize={8} color="#ff5757" mb={3} /> {/* Red color */}
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Text fontSize="24px" fontWeight="bold" color="#eee" mb={2}>
        Camera Temporarily Offline
      </Text>
      {/* <Text fontSize="16px" color="#ccc">
        Our team is working to get it back online.
      </Text> */}
    </motion.div>
  </motion.div>
);

export default OfflineMessage;
