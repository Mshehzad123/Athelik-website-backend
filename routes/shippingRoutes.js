import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import {
  getShippingRules,
  getShippingRuleById,
  createShippingRule,
  updateShippingRule,
  deleteShippingRule,
  calculateShipping,
  getActiveShippingRules
} from "../controllers/shippingController.js";
const router = express.Router();
// Admin shipping routes (require authentication)
router.get('/', authenticateToken, getShippingRules);
router.get('/:id', authenticateToken, getShippingRuleById);
router.post('/', authenticateToken, requireRole(["admin", "manager"]), createShippingRule);
router.put('/:id', authenticateToken, requireRole(["admin", "manager"]), updateShippingRule);
router.delete('/:id', authenticateToken, requireRole(["admin", "manager"]), deleteShippingRule);
// Public shipping routes (no authentication required)
router.get('/public/active', getActiveShippingRules);
router.post('/public/calculate', calculateShipping);

export default router; 