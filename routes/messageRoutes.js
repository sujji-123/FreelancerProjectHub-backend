import express from "express";
import { createMessage, getMessagesByProject } from "../controllers/messageController.js";

const router = express.Router();
router.post("/", createMessage);
router.get("/project/:projectId", getMessagesByProject);

export default router;
