import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/orderController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/public/create", createOrder);

// Admin routes (require authentication)
router.get("/admin/all", authenticateToken, requireRole(["admin", "manager"]), getAllOrders);
router.get("/admin/stats", authenticateToken, requireRole(["admin", "manager"]), getOrderStats);
router.get("/admin/:id", authenticateToken, requireRole(["admin", "manager"]), getOrderById);
router.put("/admin/:id/status", authenticateToken, requireRole(["admin", "manager"]), updateOrderStatus);

export default router; 