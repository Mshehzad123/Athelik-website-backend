import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import {
  getReviews,
  getPublicReviews,
  createReview,
  approveReview,
  rejectReview,
  updateReview,
  getReviewStats
} from "../controllers/reviewController.js";

const router = express.Router();

// Public routes (no authentication required)
router.get('/public/:productId', getPublicReviews);
router.post('/public/create', createReview);

// Admin routes (require authentication)
router.get('/', authenticateToken, requireRole(["admin", "manager"]), getReviews);
router.get('/stats', authenticateToken, requireRole(["admin", "manager"]), getReviewStats);
router.post('/:reviewId/approve', authenticateToken, requireRole(["admin", "manager"]), approveReview);
router.post('/:reviewId/reject', authenticateToken, requireRole(["admin", "manager"]), rejectReview);
router.put('/:id', authenticateToken, requireRole(["admin", "manager"]), updateReview);

export default router; 