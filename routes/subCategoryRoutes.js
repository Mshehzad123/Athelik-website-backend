import express from "express";
import {
  getSubCategories,
  getSubCategoriesByCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory
} from "../controllers/subCategoryController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/public", getSubCategories);
router.get("/public/category/:category", getSubCategoriesByCategory);

// Admin routes (require authentication)
router.use(authenticateToken);

// Get all subcategories
router.get("/", getSubCategories);

// Get subcategories by parent category
router.get("/category/:category", getSubCategoriesByCategory);

// Create new subcategory
router.post("/", createSubCategory);

// Update subcategory
router.put("/:id", updateSubCategory);

// Delete subcategory
router.delete("/:id", deleteSubCategory);

export default router; 