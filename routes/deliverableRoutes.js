// backend/routes/deliverableRoutes.js
import express from "express";
import multer from "multer";
import auth from "../middleware/authMiddleware.js";
import {
  uploadDeliverable,
  getDeliverablesByProject,
  updateDeliverable,
  deleteDeliverable,
} from "../controllers/deliverableController.js";

const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Protected endpoints
router.post("/", auth, upload.single("file"), uploadDeliverable);
router.get("/project/:projectId", auth, getDeliverablesByProject);
router.put("/:id", auth, updateDeliverable);
router.delete("/:id", auth, deleteDeliverable);

export default router;
