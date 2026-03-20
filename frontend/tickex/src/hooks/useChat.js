import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export function useChat(roomId, token) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', { auth: { token } });
    socketRef.current.emit('join_room', { roomId });
    socketRef.current.on('new_message', msg => setMessages(m => [...m, msg]));
    return () => socketRef.current.disconnect();
  }, [roomId, token]);

  const send = (text) => socketRef.current.emit('send_message', { roomId, text });

  return { messages, send };
}
