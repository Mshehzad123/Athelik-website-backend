import Order from '../models/Order.js';
import ngeniusService from '../services/ngeniusService.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

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
      try {
        await sendOrderConfirmationEmail(order);
        console.log('✅ Payment successful, order confirmation email sent:', order.orderNumber);
      } catch (emailError) {
        console.error('❌ Email sending failed after payment success:', emailError);
      }
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

// Handle payment success (when user returns from N-Genius)
export const handlePaymentSuccess = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if payment is actually successful
    if (order.paymentStatus === 'paid') {
      return res.json({
        success: true,
        message: "Payment already confirmed",
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          paymentStatus: order.paymentStatus,
          total: order.total
        }
      });
    }

    // If payment is still pending, check with N-Genius for status
    if (order.paymentStatus === 'pending' && order.paymentGatewayOrderId) {
      try {
        // Check payment status with N-Genius
        const paymentStatus = await ngeniusService.getPaymentStatus(order.paymentGatewayOrderId);
        
        if (paymentStatus.state === 'CAPTURED') {
          // Update order status
          order.paymentStatus = 'paid';
          order.paymentGatewayStatus = 'captured';
          order.status = 'processing';
          await order.save();

          // Send confirmation email
          try {
            await sendOrderConfirmationEmail(order);
            console.log('✅ Payment confirmed, order confirmation email sent:', order.orderNumber);
          } catch (emailError) {
            console.error('❌ Email sending failed after payment confirmation:', emailError);
          }

          return res.json({
            success: true,
            message: "Payment confirmed successfully",
            data: {
              orderId: order._id,
              orderNumber: order.orderNumber,
              paymentStatus: order.paymentStatus,
              total: order.total
            }
          });
        } else if (paymentStatus.state === 'FAILED' || paymentStatus.state === 'CANCELLED') {
          order.paymentStatus = 'failed';
          order.paymentGatewayStatus = paymentStatus.state.toLowerCase();
          await order.save();

          return res.json({
            success: false,
            message: "Payment failed",
            data: {
              orderId: order._id,
              orderNumber: order.orderNumber,
              paymentStatus: order.paymentStatus
            }
          });
        }
      } catch (statusError) {
        console.error('Error checking payment status:', statusError);
      }
    }

    // If payment is still pending, redirect to payment URL
    if (order.paymentStatus === 'pending' && order.paymentUrl) {
      return res.json({
        success: false,
        message: "Payment not completed yet",
        data: {
          paymentUrl: order.paymentUrl,
          orderId: order._id
        }
      });
    }

    res.status(400).json({
      success: false,
      message: "Invalid payment status"
    });

  } catch (error) {
    console.error('Error handling payment success:', error);
    res.status(500).json({
      success: false,
      message: "Failed to handle payment success",
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
