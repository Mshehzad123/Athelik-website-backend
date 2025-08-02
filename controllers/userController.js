import User from "../models/User.js";
import Customer from "../models/Customer.js";
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
    const userType = req.user.userType; // "admin" or "customer"
    
    let user;
    
    if (userType === "customer") {
      // For customers, look in Customer model
      user = await Customer.findById(userId, { password: 0, emailVerificationOTP: 0, emailVerificationOTPExpiry: 0 });
    } else {
      // For admin users, look in User model
      user = await User.findById(userId, { password: 0, emailVerificationOTP: 0, emailVerificationOTPExpiry: 0 });
    }
    
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

// Create new user (admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "viewer",
      isActive: isActive !== undefined ? isActive : true,
      isEmailVerified: true
    });

    await user.save();

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: "User created successfully",
      data: userResponse
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, select: '-password -emailVerificationOTP -emailVerificationOTPExpiry' }
    );

    res.json({
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting the last admin user
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot delete the last admin user" });
      }
    }

    await User.findByIdAndDelete(id);

    res.json({
      message: "User deleted successfully",
      data: { _id: id }
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
}; 