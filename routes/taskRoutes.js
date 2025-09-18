import express from "express";
import auth from "../middleware/authMiddleware.js";
import { createTask, getTasksByProject, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

// Protect routes so req.user is available
router.post("/", auth, createTask);
router.get("/project/:projectId", auth, getTasksByProject);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

export default router;
