import express from "express";
import { createTask, getTasksByProject, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();
router.post("/", createTask);
router.get("/project/:projectId", getTasksByProject);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
