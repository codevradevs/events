import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      try {
        const newSocket = io('http://localhost:5000', {
          auth: { userId: user._id, username: user.username },
          transports: ['websocket', 'polling'],
          timeout: 5000
        });

        newSocket.on('connect', () => {
          console.log('Connected to server');
          setConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from server');
          setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
          console.log('Connection error:', error.message);
          setConnected(false);
        });

        newSocket.on('onlineUsers', (users) => {
          setOnlineUsers(users);
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
          setSocket(null);
          setConnected(false);
        };
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, connected }}>
      {children}
    </SocketContext.Provider>
  );
};