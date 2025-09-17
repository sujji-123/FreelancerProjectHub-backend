// backend/routes/deliverableRoutes.js
import express from "express";
import multer from "multer";
import { uploadDeliverable, getDeliverablesByProject, updateDeliverable } from "../controllers/deliverableController.js";
import auth from "../middleware/authMiddleware.js"; // Import auth middleware

const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// FIX: Added 'auth' middleware to protect this route and identify the uploader
router.post("/", auth, upload.single("file"), uploadDeliverable);

// FIX: Changed route to match frontend and added auth middleware
router.get("/project/:projectId", auth, getDeliverablesByProject);

// FIX: Added auth middleware
router.put("/:id", auth, updateDeliverable);

export default router;