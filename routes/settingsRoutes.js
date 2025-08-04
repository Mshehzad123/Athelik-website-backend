import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import {
  getSettings,
  updateSettings
} from "../controllers/settingsController.js";

const router = express.Router();

// Public settings route (no authentication required)
router.get('/public', getSettings);

// Public currency update route (no authentication required)
router.put('/currency', updateSettings);

// Settings routes (require authentication)
router.get('/', authenticateToken, getSettings);
router.put('/', authenticateToken, requireRole(["admin"]), updateSettings);

export default router; 