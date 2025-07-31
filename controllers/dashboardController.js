import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import User from "../models/User.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalUsers = await User.countDocuments();

    const recentOrders = await Order.find()
      .populate("items.product")
      .sort({ createdAt: -1 })
      .limit(5);

    const lowStockProducts = await Product.find({
      'variants.stock': { $lt: 10 }
    }).limit(5);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
          },
          status: { $in: ["delivered", "shipped"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalUsers,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 