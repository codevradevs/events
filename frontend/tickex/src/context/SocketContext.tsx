import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: { username: string; socketId: string }[];
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, onlineUsers: [], connected: false });

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{ username: string; socketId: string }[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) { socket?.close(); setSocket(null); setConnected(false); return; }

    const s = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { userId: user._id, username: user.username },
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    s.on('onlineUsers', setOnlineUsers);
    setSocket(s);

    return () => { s.close(); setSocket(null); setConnected(false); };
  }, [user?._id]);

  return <SocketContext.Provider value={{ socket, onlineUsers, connected }}>{children}</SocketContext.Provider>;
}
