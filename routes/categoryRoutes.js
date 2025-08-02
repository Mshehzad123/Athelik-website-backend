import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import {
  getCategories,
  getCarouselCategories,
  getWomenCategories,
  getMenCategories,
  getTrainingCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCarouselDisplay,
  getCategoryStats
} from "../controllers/categoryController.js";

const router = express.Router();

// Public routes (no authentication required)
router.get('/public/carousel', getCarouselCategories);
router.get('/public/women', getWomenCategories);
router.get('/public/men', getMenCategories);
router.get('/public/training', getTrainingCategories);

// Admin routes (require authentication)
router.get('/', authenticateToken, requireRole(["admin", "manager"]), getCategories);
router.get('/stats', authenticateToken, requireRole(["admin", "manager"]), getCategoryStats);
router.post('/', authenticateToken, requireRole(["admin", "manager"]), createCategory);
router.put('/:id', authenticateToken, requireRole(["admin", "manager"]), updateCategory);
router.delete('/:id', authenticateToken, requireRole(["admin", "manager"]), deleteCategory);
router.put('/:id/carousel', authenticateToken, requireRole(["admin", "manager"]), toggleCarouselDisplay);

export default router; 