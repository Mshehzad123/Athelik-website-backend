import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Bundle from "../models/Bundle.js";
import ShippingRule from "../models/ShippingRule.js";
import { createTransporter } from "../utils/emailService.js";

// Calculate shipping cost based on shipping rules
const calculateShipping = async (subtotal, region = 'US') => {
  try {
    // Find applicable shipping rules
    const applicableRules = await ShippingRule.find({
      isActive: true,
      region: { $in: [region, 'GLOBAL'] },
      minOrderAmount: { $lte: subtotal },
      maxOrderAmount: { $gte: subtotal }
    }).sort({ priority: 1 });

    if (applicableRules.length === 0) {
      return { shippingCost: 20, isFreeShipping: false }; // Default fallback
    }

    // Use the highest priority rule
    const selectedRule = applicableRules[0];
    const isFreeShipping = subtotal >= selectedRule.freeShippingAt;
    const shippingCost = isFreeShipping ? 0 : selectedRule.shippingCost;

    return { shippingCost, isFreeShipping };
  } catch (error) {
    console.error("Error calculating shipping:", error);
    return { shippingCost: 20, isFreeShipping: false }; // Default fallback
  }
};

// Calculate bundle discount for cart items
const calculateBundleDiscount = async (cartItems) => {
  try {
    const now = new Date();
    const bundles = await Bundle.find({
      isActive: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    }).populate("products");
    
    let bestDiscount = 0;
    let appliedBundle = null;
    
    // Check each bundle
    for (const bundle of bundles) {
      const bundleProductIds = bundle.products.map(p => p._id.toString());
      const cartProductIds = cartItems.map(item => item.productId);
      
      // Check if all bundle products are in cart
      const hasAllBundleProducts = bundleProductIds.every(id => 
        cartProductIds.includes(id)
      );
      
      if (hasAllBundleProducts) {
        // Calculate potential savings
        const bundleTotal = bundle.bundlePrice;
        const individualTotal = cartItems
          .filter(item => bundleProductIds.includes(item.productId))
          .reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const savings = individualTotal - bundleTotal;
        
        if (savings > 0 && savings > bestDiscount) {
          bestDiscount = savings;
          appliedBundle = bundle;
        }
      }
    }
    
    return {
      hasBundleDiscount: !!appliedBundle,
      bundle: appliedBundle,
      discountAmount: bestDiscount,
      discountPercentage: appliedBundle ? 
        Math.round(((bestDiscount / appliedBundle.originalPrice) * 100)) : 0
    };
  } catch (error) {
    console.error("Error calculating bundle discount:", error);
    return {
      hasBundleDiscount: false,
      bundle: null,
      discountAmount: 0,
      discountPercentage: 0
    };
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: "marketing@athlekt.com",
      to: order.customer.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Confirmation</h2>
          <p>Dear ${order.customer.name},</p>
          <p>Thank you for your order! Your order has been successfully placed.</p>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Items Ordered:</h3>
            ${order.items.map(item => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p><strong>${item.productName}</strong></p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: AED${item.price}</p>
                <p>Total: AED${item.totalPrice}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px;">
            <p><strong>Subtotal:</strong> AED${order.subtotal}</p>
            ${order.bundleDiscount > 0 ? `<p><strong>Bundle Discount:</strong> -AED${order.bundleDiscount}</p>` : ''}
            <p><strong>Shipping:</strong> AED${order.shippingCost}</p>
            <p><strong>Total:</strong> AED${order.total}</p>
          </div>
          
          <p>We'll send you another email when your order ships.</p>
          <p>Thank you for shopping with us!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${order.customer.email}`);
  } catch (error) {
    console.error("❌ Error sending order confirmation email:", error);
    throw error; // Re-throw so we can catch it in createOrder
  }
};

// Send order status update email
const sendOrderStatusUpdateEmail = async (order, oldStatus, newStatus) => {
  try {
    const transporter = createTransporter();
    
    const statusMessages = {
      'processing': 'Your order is now being processed and prepared for shipping.',
      'shipped': 'Your order has been shipped and is on its way to you!',
      'delivered': 'Your order has been delivered successfully.',
      'cancelled': 'Your order has been cancelled as requested.'
    };
    
    const statusMessage = statusMessages[newStatus] || `Your order status has been updated to: ${newStatus}`;
    
    const mailOptions = {
      from: "marketing@athlekt.com",
      to: order.customer.email,
      subject: `Order Status Update - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Status Update</h2>
          <p>Dear ${order.customer.name},</p>
          <p>Your order status has been updated!</p>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Previous Status:</strong> ${oldStatus}</p>
            <p><strong>New Status:</strong> <span style="color: #007bff; font-weight: bold;">${newStatus}</span></p>
            ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Status Update</h3>
            <p>${statusMessage}</p>
            ${newStatus === 'shipped' && order.trackingNumber ? `
              <p><strong>Tracking Information:</strong></p>
              <p>You can track your package using the tracking number: <strong>${order.trackingNumber}</strong></p>
            ` : ''}
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Items in Your Order:</h3>
            ${order.items.map(item => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p><strong>${item.productName}</strong></p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: AED${item.price}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px;">
            <p><strong>Total Amount:</strong> AED${order.total}</p>
          </div>
          
          <p>Thank you for shopping with us!</p>
          <p>If you have any questions, please don't hesitate to contact our customer support.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order status update email sent to ${order.customer.email} (${oldStatus} → ${newStatus})`);
  } catch (error) {
    console.error("❌ Error sending order status update email:", error);
    throw error;
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { customer, items, notes } = req.body;

    // Validate required fields
    if (!customer || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer information and items are required",
      });
    }

    // Validate customer data
    if (!customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: "Customer name, email, and phone are required",
      });
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];

    // Process each item
    for (const item of items) {
      try {
        // Extract actual productId from variantId if it's a composite string
        let actualProductId = item.productId;
        if (item.productId && item.productId.includes('-')) {
          // If productId is in format "productId-size-color", extract just the productId part
          actualProductId = item.productId.split('-')[0];
        }
        
        const product = await Product.findById(actualProductId);
        if (!product) {
          // If product not found, use the data from frontend but create a valid ObjectId
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;

          // Create a new ObjectId for the productId if it's not a valid ObjectId
          let productId;
          try {
            productId = new mongoose.Types.ObjectId(item.productId);
          } catch (error) {
            // If the productId is not a valid ObjectId, create a new one
            productId = new mongoose.Types.ObjectId();
          }

          orderItems.push({
            productId: productId,
            productName: item.productName,
            variant: {
              size: item.size,
              color: item.color,
              sku: item.sku,
            },
            quantity: item.quantity,
            price: item.price,
            totalPrice: itemTotal,
          });
        } else {
          const itemTotal = product.basePrice * item.quantity;
          subtotal += itemTotal;

          orderItems.push({
            productId: product._id,
            productName: product.title,
            variant: {
              size: item.size,
              color: item.color,
              sku: item.sku,
            },
            quantity: item.quantity,
            price: product.basePrice,
            totalPrice: itemTotal,
          });
        }
      } catch (error) {
        console.error(`Error processing item ${item.productId}:`, error);
        // Use frontend data as fallback
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Create a new ObjectId for the productId if it's not a valid ObjectId
        let productId;
        try {
          productId = new mongoose.Types.ObjectId(item.productId);
        } catch (error) {
          // If the productId is not a valid ObjectId, create a new one
          productId = new mongoose.Types.ObjectId();
        }

        orderItems.push({
          productId: productId,
          productName: item.productName,
          variant: {
            size: item.size,
            color: item.color,
            sku: item.sku,
          },
          quantity: item.quantity,
          price: item.price,
          totalPrice: itemTotal,
        });
      }
    }

    // Calculate bundle discount
    const bundleDiscountInfo = await calculateBundleDiscount(items);
    const bundleDiscount = bundleDiscountInfo.discountAmount;

    // Calculate shipping
    const shippingInfo = await calculateShipping(subtotal - bundleDiscount);
    const shippingCost = shippingInfo.shippingCost;
    const total = subtotal - bundleDiscount + shippingCost;

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, "0")}-${Date.now().toString().slice(-4)}`;
    
    console.log("Generated order number:", orderNumber);
    console.log("Order items:", JSON.stringify(orderItems, null, 2));

    // Create order
    const order = new Order({
      orderNumber,
      customer,
      items: orderItems,
      subtotal,
      bundleDiscount,
      appliedBundle: bundleDiscountInfo.bundle ? bundleDiscountInfo.bundle._id : null,
      shippingCost,
      total,
      notes,
      isFreeShipping: shippingCost === 0,
      status: "pending", // Order created but payment not completed
      paymentStatus: "pending", // Payment not initiated yet
      paymentGateway: "ngenius", // Set payment gateway
      paymentGatewayStatus: "pending", // Payment gateway status
    });
    
    console.log("Order object before save:", JSON.stringify(order, null, 2));

    await order.save();

    // Don't send confirmation email yet - wait for payment success
    console.log("✅ Order created successfully, waiting for payment confirmation");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
      emailSent: emailSent,
      bundleDiscount: bundleDiscountInfo
    });
  } catch (error) {
    console.error("Error creating order:", error);
    console.error("Request body:", req.body);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: validationErrors.join(', '),
      });
    }
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate order number",
        error: "Order number already exists",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = {};
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
      ];
    }
    
    const orders = await Order.find(query)
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id).populate("items.productId");
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, notes } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const oldStatus = order.status;
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;

    await order.save();

    // Send email notification if status changed
    let emailSent = false;
    if (oldStatus !== status) {
      try {
        await sendOrderStatusUpdateEmail(order, oldStatus, status);
        emailSent = true;
        console.log(`✅ Status update email sent for order ${order.orderNumber}`);
      } catch (emailError) {
        console.error("❌ Email sending failed, but order was updated:", emailError);
        emailSent = false;
      }
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
      emailSent: emailSent,
      statusChanged: oldStatus !== status
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

// Get order statistics for dashboard
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("items.productId");

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics",
      error: error.message,
    });
  }
}; 
