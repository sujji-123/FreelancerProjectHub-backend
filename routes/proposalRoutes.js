import express from "express";
import { createProposal, getProposals } from "../controllers/proposalController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, createProposal);
router.get("/", getProposals);

export default router;
