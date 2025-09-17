// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { initSocket } from "./utils/socket.js"; // We will use the new initSocket function

// Import routes
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/ProjectRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import deliverableRoutes from "./routes/deliverableRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Define the allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000", // Common React port
  "http://localhost:5173"  // Vite/React port
];

// Setup CORS for all HTTP requests
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Serve static files from the "uploads" directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/deliverables", deliverableRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/users', userRoutes);

// Create the HTTP server from the Express app
const server = http.createServer(app);

// Initialize the Socket.IO server and pass it the allowed origins
initSocket(server, allowedOrigins);

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});