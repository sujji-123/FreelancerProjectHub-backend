import express from "express";
import { createProject, getProjects, getMyProjects } from "../controllers/projectController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, createProject);
router.get("/", getProjects);

// ✅ New route
router.get("/my-projects", auth, getMyProjects);

export default router;
