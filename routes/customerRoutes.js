import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import {
  getCustomers,
  updateCustomer
} from "../controllers/customerController.js";

const router = express.Router();

// Customer routes
router.get('/', authenticateToken, getCustomers);
router.put('/:id', authenticateToken, requireRole(["admin", "manager"]), updateCustomer);

export default router; 