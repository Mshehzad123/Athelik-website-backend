import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import {
  getAllCustomers,
  getCustomerById,
  banCustomer,
  unbanCustomer,
  updateCustomer,
  updateCustomerProfile,
  deleteCustomer,
  getCustomerStats
} from "../controllers/customerController.js";

const router = express.Router();

// Admin routes (require admin role)
router.get('/', authenticateToken, requireRole(["admin", "manager"]), getAllCustomers);
router.get('/stats', authenticateToken, requireRole(["admin", "manager"]), getCustomerStats);
router.get('/:id', authenticateToken, requireRole(["admin", "manager"]), getCustomerById);
router.put('/:id', authenticateToken, requireRole(["admin", "manager"]), updateCustomer);
router.delete('/:id', authenticateToken, requireRole("admin"), deleteCustomer);
router.post('/ban/:customerId', authenticateToken, requireRole("admin"), banCustomer);
router.post('/unban/:customerId', authenticateToken, requireRole("admin"), unbanCustomer);

// Customer routes (for customers to update their own profile)
router.put('/profile/update', authenticateToken, updateCustomerProfile);

export default router; 