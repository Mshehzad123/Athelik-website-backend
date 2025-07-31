import User from "../models/User.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, emailVerificationOTP: 0, emailVerificationOTPExpiry: 0 });
    
    // Get order statistics for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const orders = await Order.find({ 
        "customer.email": user.email 
      });
      
      const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
      
      return {
        ...user.toObject(),
        totalOrders: orders.length,
        totalSpent,
        averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
      };
    }));
    
    res.json({ data: usersWithStats });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get user profile with orders
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.userId;
    
    const user = await User.findById(userId, { password: 0, emailVerificationOTP: 0, emailVerificationOTPExpiry: 0 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's orders
    const orders = await Order.find({ 
      "customer.email": user.email 
    }).sort({ createdAt: -1 });

    // Calculate total spent
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      user,
      orders,
      stats: {
        totalOrders: orders.length,
        totalSpent,
        averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

// Ban user (admin only)
export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = true;
    user.banReason = reason || "No reason provided";
    await user.save();

    // Get updated user with stats
    const orders = await Order.find({ 
      "customer.email": user.email 
    });
    
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    res.json({ 
      message: "User banned successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name || user.firstName || user.email,
        isBanned: user.isBanned,
        banReason: user.banReason,
        totalOrders: orders.length,
        totalSpent,
        averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
      }
    });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ message: "Error banning user" });
  }
};

// Unban user (admin only)
export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = false;
    user.banReason = undefined;
    await user.save();

    // Get updated user with stats
    const orders = await Order.find({ 
      "customer.email": user.email 
    });
    
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    res.json({ 
      message: "User unbanned successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name || user.firstName || user.email,
        isBanned: user.isBanned,
        totalOrders: orders.length,
        totalSpent,
        averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
      }
    });
  } catch (error) {
    console.error("Error unbanning user:", error);
    res.status(500).json({ message: "Error unbanning user" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, name, dateOfBirth, marketingOptIn } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (name) user.name = name;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (marketingOptIn !== undefined) user.marketingOptIn = marketingOptIn;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name || user.firstName || user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        marketingOptIn: user.marketingOptIn,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password" });
  }
}; 