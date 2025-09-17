// backend/routes/messageRoutes.js
import express from "express";
import { createMessage, getMessagesByProject } from "../controllers/messageController.js";
import auth from "../middleware/authMiddleware.js"; // Import auth middleware

const router = express.Router();

// This route should be protected to know who the sender is
router.post("/", auth, createMessage);

// FIX: Changed route to match what the frontend service (getMessagesByProject) is calling
router.get("/project/:projectId", auth, getMessagesByProject);

export default router;