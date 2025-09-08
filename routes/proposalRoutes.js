// backend/routes/proposalRoutes.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createProposal,
  getProposalsForClient,
  acceptProposal,
  rejectProposal,
} from "../controllers/proposalController.js";

const router = express.Router();

// Freelancers create proposals
router.post("/", auth, createProposal);

// Client fetch proposals targeted to their projects
router.get("/client", auth, getProposalsForClient);

// Client accepts / rejects
router.patch("/:id/accept", auth, acceptProposal);
router.patch("/:id/reject", auth, rejectProposal);

export default router;
