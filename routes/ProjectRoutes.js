//routes/ProjectRoutes.js
import express from "express";
import {
  createProject,
  getProjects,
  getMyProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Create project (client)
router.post("/", auth, createProject);

// All projects (marketplace)
router.get("/", getProjects);

// My projects (client only)
router.get("/my-projects", auth, getMyProjects);

// Update project (client only)
router.put("/:id", auth, updateProject);

// Delete project (client only)
router.delete("/:id", auth, deleteProject);

export default router;
