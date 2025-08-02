import express from "express";
import { 
  getAllUsers, 
  getUserProfile, 
  banUser, 
  unbanUser, 
  updateUserProfile, 
  changePassword,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import { authenticateToken, requireRole, checkUserBan } from "../middleware/auth.js";

const router = express.Router();

// Admin routes (require admin role)
router.get("/", authenticateToken, requireRole(["admin", "manager"]), getAllUsers);
router.post("/", authenticateToken, requireRole("admin"), createUser);
router.put("/:id", authenticateToken, requireRole("admin"), updateUser);
router.delete("/:id", authenticateToken, requireRole("admin"), deleteUser);
router.post("/admin/ban/:userId", authenticateToken, requireRole("admin"), banUser);
router.post("/admin/unban/:userId", authenticateToken, requireRole("admin"), unbanUser);

// User profile routes (require authentication)
router.get("/profile", authenticateToken, getUserProfile);
router.get("/profile/:id", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);
router.put("/change-password", authenticateToken, changePassword);

export default router; 