import Customer from "../models/Customer.js";
import Order from "../models/Order.js";

// Get all customers (admin only)
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}, { password: 0, emailVerificationOTP: 0, emailVerificationOTPExpiry: 0 });
    
    // Get order statistics for each customer
    const customersWithStats = await Promise.all(customers.map(async (customer) => {
      const orders = await Order.find({ 
        "customer.email": customer.email 
      });
      
      const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
      
      return {
        ...customer.toObject(),
        totalOrders: orders.length,
        totalSpent,
        averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
      };
    }));
    
    res.json({ data: customersWithStats });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Error fetching customers" });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id, { password: 0, emailVerificationOTP: 0, emailVerificationOTPExpiry: 0 });
    
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Get customer's orders
    const orders = await Order.find({ 
      "customer.email": customer.email 
    }).sort({ createdAt: -1 });

    // Calculate total spent
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      customer,
      orders,
      stats: {
        totalOrders: orders.length,
        totalSpent,
        averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
      }
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Error fetching customer" });
  }
};

// Ban customer (admin only)
export const banCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { reason } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.isBanned = true;
    customer.banReason = reason || "No reason provided";
    await customer.save();

    // Get updated customer with stats
    const orders = await Order.find({ 
      "customer.email": customer.email 
    });
    
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    res.json({ 
      message: "Customer banned successfully",
      customer: {
        id: customer._id,
        email: customer.email,
        name: customer.name,
        isBanned: customer.isBanned,
        banReason: customer.banReason,
        totalOrders: orders.length,
        totalSpent,
        averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
      }
    });
  } catch (error) {
    console.error("Error banning customer:", error);
    res.status(500).json({ message: "Error banning customer" });
  }
};

// Unban customer (admin only)
export const unbanCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.isBanned = false;
    customer.banReason = undefined;
    await customer.save();

    // Get updated customer with stats
    const orders = await Order.find({ 
      "customer.email": customer.email 
    });
    
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    res.json({ 
      message: "Customer unbanned successfully",
      customer: {
        id: customer._id,
        email: customer.email,
        name: customer.name,
        isBanned: customer.isBanned,
        totalOrders: orders.length,
        totalSpent,
        averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
      }
    });
  } catch (error) {
    console.error("Error unbanning customer:", error);
    res.status(500).json({ message: "Error unbanning customer" });
  }
};

// Update customer (admin only)
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      updateData,
      { new: true, select: '-password -emailVerificationOTP -emailVerificationOTPExpiry' }
    );

    res.json({
      message: "Customer updated successfully",
      customer: updatedCustomer
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Error updating customer" });
  }
};

// Delete customer (admin only)
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await Customer.findByIdAndDelete(id);

    res.json({
      message: "Customer deleted successfully",
      data: { _id: id }
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Error deleting customer" });
  }
};

// Update customer profile (for customers to update their own profile)
export const updateCustomerProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, name, dateOfBirth, marketingOptIn } = req.body;

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update fields
    if (firstName && lastName) {
      customer.name = `${firstName} ${lastName}`;
    } else if (name) {
      customer.name = name;
    }
    if (dateOfBirth) customer.dateOfBirth = dateOfBirth;
    if (marketingOptIn !== undefined) customer.marketingOptIn = marketingOptIn;

    await customer.save();

    res.json({
      message: "Profile updated successfully",
      customer: {
        id: customer._id,
        email: customer.email,
        name: customer.name,
        dateOfBirth: customer.dateOfBirth,
        marketingOptIn: customer.marketingOptIn,
        isEmailVerified: customer.isEmailVerified
      }
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// Get customer statistics
export const getCustomerStats = async (req, res) => {
  try {
    const stats = await Customer.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ["$isActive", 1, 0] } },
          banned: { $sum: { $cond: ["$isBanned", 1, 0] } },
          verified: { $sum: { $cond: ["$isEmailVerified", 1, 0] } }
        }
      }
    ]);

    const statsData = stats[0] || { total: 0, active: 0, banned: 0, verified: 0 };
    
    res.json({ data: statsData });
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    res.status(500).json({ message: "Error fetching customer stats" });
  }
}; 