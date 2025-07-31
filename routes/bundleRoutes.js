import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import {
  getBundles,
  createBundle
} from "../controllers/bundleController.js";

const router = express.Router();

// Bundle routes
router.get('/', authenticateToken, getBundles);
router.post('/', authenticateToken, requireRole(["admin", "manager"]), createBundle);

export default router; 