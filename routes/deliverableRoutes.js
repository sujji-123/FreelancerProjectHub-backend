import express from "express";
import multer from "multer";
import { uploadDeliverable, getDeliverablesByProject, updateDeliverable } from "../controllers/deliverableController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/", upload.single("file"), uploadDeliverable);
router.get("/project/:projectId", getDeliverablesByProject);
router.put("/:id", updateDeliverable);

export default router;
