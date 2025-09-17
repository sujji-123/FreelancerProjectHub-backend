import { Server } from 'socket.io';

let io;

export const initSocket = (server, allowedOrigins) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    socket.on('joinProject', ({ projectId }) => {
      if (projectId) {
        const roomName = `project_${projectId}`;
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room ${roomName}`);
      }
    });

    // **THIS IS THE FIX:**
    // We are changing 'io.to' to 'socket.broadcast.to'.
    // This sends the message to everyone in the room *except for the original sender*.
    socket.on('sendMessage', ({ projectId, message }) => {
      if (projectId && message) {
        socket.broadcast.to(`project_${projectId}`).emit('newMessage', message);
      }
    });
    
    socket.on("register", ({ userId }) => {
      if (userId) {
        const roomName = `user_${String(userId)}`;
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined notification room ${roomName}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });

  return io;
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};