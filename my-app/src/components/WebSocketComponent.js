import React, { useEffect } from 'react';

const WebSocketComponent = () => {
  useEffect(() => {
    const socket = new WebSocket('ws://pro.ambicam.com:1885/');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Implement your error handling logic here, e.g., display an error message to the user.
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  return <div>WebSocket Component</div>;
};

export default WebSocketComponent;
