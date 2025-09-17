// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/ProjectRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import deliverableRoutes from "./routes/deliverableRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from './routes/userRoutes.js';
import { setSocketIO } from "./utils/socket.js";

import { Server } from "socket.io";
import http from "http";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// connect to DB
connectDB();

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/deliverables", deliverableRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/users', userRoutes);


// serve uploads or static if needed (keep your existing static handling if present)
const server = http.createServer(app);

// Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // match your frontend dev origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// store io instance so controllers can access it
setSocketIO(io);

// socket connection handling
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // clients should emit "register" with their userId once they connect
  // e.g. socket.emit('register', { userId: '<userId>' })
  socket.on("register", ({ userId }) => {
    try {
      if (userId) {
        const room = `user_${String(userId)}`;
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
      }
    } catch (err) {
      console.error("register socket error:", err);
    }
  });

  // project chat join (if used across your collab feature)
  socket.on("joinProject", ({ projectId }) => {
    if (projectId) {
      socket.join(`project_${projectId}`);
      console.log(`Socket ${socket.id} joined project_${projectId}`);
    }
  });

  // project chat messages - keep your existing behavior if already implemented
  socket.on("sendMessage", ({ projectId, message }) => {
    io.to(`project_${projectId}`).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});