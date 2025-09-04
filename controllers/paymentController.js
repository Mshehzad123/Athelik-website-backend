import Order from '../models/Order.js';
import ngeniusService from '../services/ngeniusService.js';

// Create N-Genius payment order
export const createNGeniusPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: "Order is already paid"
      });
    }

    // Create payment order with N-Genius
    const paymentData = {
      orderNumber: order.orderNumber,
      total: order.total,
      currency: "AED",
      customer: order.customer
    };

    const ngeniusResponse = await ngeniusService.createPaymentOrder(paymentData);

    // Update order with N-Genius data
    order.paymentGateway = "ngenius";
    order.paymentGatewayOrderId = ngeniusResponse.reference;
    order.paymentUrl = ngeniusResponse._links.payment.href;
    order.paymentGatewayResponse = ngeniusResponse;
    
    await order.save();

    res.json({
      success: true,
      message: "Payment order created successfully",
      data: {
        paymentUrl: ngeniusResponse._links.payment.href,
        orderId: order._id,
        ngeniusOrderId: ngeniusResponse.reference
      }
    });

  } catch (error) {
    console.error('Error creating N-Genius payment:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message
    });
  }
};

// Handle N-Genius webhook
export const handleNGeniusWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const signature = req.headers['x-ngenius-signature'] || req.headers['authorization'];

    // Verify webhook signature (implement based on N-Genius documentation)
    // const isValid = ngeniusService.verifyWebhookSignature(payload, signature);
    // if (!isValid) {
    //   return res.status(401).json({ success: false, message: "Invalid signature" });
    // }

    // Extract order information from webhook
    const { orderReference, state, amount } = payload;
    
    // Find order by N-Genius order reference
    const order = await Order.findOne({ 
      paymentGatewayOrderId: orderReference 
    });

    if (!order) {
      console.error('Order not found for N-Genius reference:', orderReference);
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update order status based on payment result
    if (state === 'CAPTURED') {
      order.paymentStatus = 'paid';
      order.paymentGatewayStatus = 'captured';
      order.status = 'processing'; // Move to processing
    } else if (state === 'FAILED') {
      order.paymentStatus = 'failed';
      order.paymentGatewayStatus = 'failed';
    } else if (state === 'CANCELLED') {
      order.paymentStatus = 'failed';
      order.paymentGatewayStatus = 'cancelled';
    }

    // Store webhook response
    order.paymentGatewayResponse = {
      ...order.paymentGatewayResponse,
      webhook: payload
    };

    await order.save();

    // Send confirmation email if payment successful
    if (state === 'CAPTURED') {
      // You can call your existing email service here
      console.log('Payment successful, order updated:', order.orderNumber);
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully" });

  } catch (error) {
    console.error('Error processing N-Genius webhook:', error);
    res.status(500).json({
      success: false,
      message: "Failed to process webhook",
      error: error.message
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        paymentGatewayStatus: order.paymentGatewayStatus,
        total: order.total,
        currency: "AED"
      }
    });

  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment status",
      error: error.message
    });
  }
};
