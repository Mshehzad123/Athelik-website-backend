import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Get all coupons (admin)
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate("applicableProducts", "title")
      .populate("applicableCategories", "name")
      .sort({ createdAt: -1 });
    
    res.json({ data: coupons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get coupon by ID
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate("applicableProducts", "title")
      .populate("applicableCategories", "name");
    
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    res.json({ data: coupon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minAmount,
      maxDiscount,
      usageLimit,
      expiresAt,
      isStackable,
      applicableProducts,
      applicableCategories,
      isActive
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      type,
      value,
      minAmount,
      maxDiscount,
      usageLimit,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isStackable,
      applicableProducts,
      applicableCategories,
      isActive: isActive !== undefined ? isActive : true
    });

    await coupon.save();
    
    res.status(201).json({
      message: "Coupon created successfully",
      data: coupon
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If code is being updated, check for uniqueness
    if (updateData.code) {
      const existingCoupon = await Coupon.findOne({ 
        code: updateData.code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingCoupon) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }
      updateData.code = updateData.code.toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("applicableProducts", "title")
     .populate("applicableCategories", "name");

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json({
      message: "Coupon updated successfully",
      data: coupon
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findByIdAndDelete(id);
    
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json({
      message: "Coupon deleted successfully",
      data: coupon
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Validate coupon (public endpoint)
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, items } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    // Check if coupon has expired (with timezone handling)
    if (coupon.expiresAt) {
      const now = new Date();
      const expiryDate = new Date(coupon.expiresAt);
      
      // Add debug logging
      console.log('🔍 Coupon validation debug:');
      console.log('- Coupon code:', code);
      console.log('- Current time:', now);
      console.log('- Expiry time:', expiryDate);
      console.log('- Is expired?', now > expiryDate);
      
      // Temporarily disable expiration check for testing
      // if (now > expiryDate) {
      //   return res.status(400).json({ message: "Coupon has expired" });
      // }
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    // Check minimum amount
    if (coupon.minAmount && cartTotal < coupon.minAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount of AED${coupon.minAmount} required` 
      });
    }

    // Check applicable products/categories
    if (coupon.applicableProducts.length > 0 || coupon.applicableCategories.length > 0) {
      const itemProductIds = items.map(item => item.productId);
      const itemCategories = items.map(item => item.categoryId);

      const hasApplicableProduct = coupon.applicableProducts.some(productId => 
        itemProductIds.includes(productId.toString())
      );
      
      const hasApplicableCategory = coupon.applicableCategories.some(categoryId => 
        itemCategories.includes(categoryId.toString())
      );

      if (!hasApplicableProduct && !hasApplicableCategory) {
        return res.status(400).json({ message: "Coupon not applicable to items in cart" });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = (cartTotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.value;
    }

    res.json({
      message: "Coupon is valid",
      data: {
        coupon,
        discountAmount,
        finalTotal: cartTotal - discountAmount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Apply coupon to order
export const applyCoupon = async (req, res) => {
  try {
    const { code, orderId } = req.body;

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    // Increment usage count
    coupon.usedCount += 1;
    await coupon.save();

    res.json({
      message: "Coupon applied successfully",
      data: coupon
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get coupon statistics
export const getCouponStats = async (req, res) => {
  try {
    const stats = await Coupon.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ["$isActive", 1, 0] } },
          expired: { $sum: { $cond: [{ $lt: ["$expiresAt", new Date()] }, 1, 0] } },
          totalUsage: { $sum: "$usedCount" }
        }
      }
    ]);

    const statsData = stats[0] || { total: 0, active: 0, expired: 0, totalUsage: 0 };
    
    res.json({ data: statsData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
