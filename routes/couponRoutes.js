import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  getCouponStats
} from "../controllers/couponController.js";

const router = express.Router();

// Admin routes (require authentication)
router.get('/', authenticateToken, requireRole(["admin", "manager"]), getCoupons);
router.get('/stats', authenticateToken, requireRole(["admin", "manager"]), getCouponStats);
router.get('/:id', authenticateToken, requireRole(["admin", "manager"]), getCouponById);
router.post('/', authenticateToken, requireRole(["admin", "manager"]), createCoupon);
router.put('/:id', authenticateToken, requireRole(["admin", "manager"]), updateCoupon);
router.delete('/:id', authenticateToken, requireRole(["admin", "manager"]), deleteCoupon);

// Public routes (no authentication required)
router.post('/validate', validateCoupon);
router.post('/apply', applyCoupon);

export default router; 