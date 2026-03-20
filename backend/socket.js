const { Server } = require('socket.io');
const Message = require('./models/Message');
const jwt = require('jsonwebtoken');

module.exports = function(httpServer) {
  const io = new Server(httpServer, { 
    cors: { 
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth?.userId;
    if (userId) {
      socket.userId = userId;
      socket.username = socket.handshake.auth?.username;
    }
    next();
  });

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.username);
    
    if (socket.userId) {
      onlineUsers.set(socket.userId, { username: socket.username, socketId: socket.id });
      io.emit('onlineUsers', Array.from(onlineUsers.values()));
    }

    socket.on('sendMessage', (data) => {
      socket.broadcast.emit('newMessage', data);
    });

    socket.on('newFeedPost', (post) => {
      socket.broadcast.emit('newFeedPost', post);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.username);
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('onlineUsers', Array.from(onlineUsers.values()));
      }
    });
  });

  return io;
};
