// backend/routes/notificationRoutes.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getNotifications, markRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", auth, getNotifications);
router.patch("/:id/read", auth, markRead);

export default router;
