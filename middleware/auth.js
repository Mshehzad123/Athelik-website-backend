import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

// Auth Middleware
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user is banned
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }
    
    if (user.isBanned) {
      return res.status(403).json({ 
        error: "Account has been banned by administrator",
        banReason: user.banReason || "No reason provided"
      });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Role-based access control
export const requireRole = (roles) => {
  return (req, res, next) => {
    // Convert single role to array if needed
    const roleArray = Array.isArray(roles) ? roles : [roles];
    if (!roleArray.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

// Check if user is banned (for public routes)
export const checkUserBan = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(); // No token, continue (user not logged in)
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (user && user.isBanned) {
      return res.status(403).json({ 
        error: "Account has been banned by administrator",
        banReason: user.banReason || "No reason provided"
      });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    // Invalid token, but don't block the request
    next();
  }
};

// Initialize default users
export const initializeUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const defaultUsers = [
        { email: "admin@example.com", password: "admin123", role: "admin", name: "Admin User" },
        { email: "manager@example.com", password: "manager123", role: "manager", name: "Manager User" },
        { email: "viewer@example.com", password: "viewer123", role: "viewer", name: "Viewer User" },
      ];

      for (const userData of defaultUsers) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new User({
          ...userData,
          password: hashedPassword,
        });
        await user.save();
      }
      console.log("Default users created");
    }
  } catch (error) {
    console.error("Error initializing users:", error);
  }
}; 