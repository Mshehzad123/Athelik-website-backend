// N-Genius Payment Service
import axios from 'axios';

class NGeniusService {
  constructor() {
    this.apiKey = process.env.N_GENIUS_API_KEY;
    this.outletId = process.env.N_GENIUS_OUTLET_ID;
    this.tokenUrl = process.env.N_GENIUS_TOKEN_URL;
    this.transactionUrlBase = process.env.N_GENIUS_TRANSACTION_URL_BASE;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Get access token from N-Genius
  async getAccessToken() {
    try {
      // Check if current token is still valid
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const authString = Buffer.from(`${this.apiKey}:`).toString('base64');
      
      const response = await axios.post(this.tokenUrl, 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 minute buffer
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting N-Genius access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with N-Genius');
    }
  }

  // Create payment order
  async createPaymentOrder(orderData) {
    try {
      const accessToken = await this.getAccessToken();
      const transactionUrl = `${this.transactionUrlBase}${this.outletId}/orders`;

      const paymentData = {
        action: "PURCHASE",
        amount: {
          currencyCode: orderData.currency || "AED",
          value: Math.round(orderData.total * 100) // Convert to minor units
        },
        merchantOrderReference: orderData.orderNumber,
        emailAddress: orderData.customer.email,
        billingAddress: {
          firstName: orderData.customer.name.split(' ')[0] || orderData.customer.name,
          lastName: orderData.customer.name.split(' ').slice(1).join(' ') || '',
          address1: orderData.customer.address.street,
          city: orderData.customer.address.city,
          state: orderData.customer.address.state,
          postCode: orderData.customer.address.zipCode,
          countryCode: "AE"
        },
        returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success`,
        cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-cancelled`,
        language: "en"
      };

      const response = await axios.post(transactionUrl, paymentData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/vnd.ni-payment.v2+json',
          'Accept': 'application/vnd.ni-payment.v2+json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating N-Genius payment order:', error.response?.data || error.message);
      throw new Error('Failed to create payment order');
    }
  }

  // Verify webhook signature (optional but recommended)
  verifyWebhookSignature(payload, signature) {
    // Implement webhook signature verification if N-Genius provides it
    // This is important for security
    return true; // Placeholder - implement actual verification
  }
}

export default new NGeniusService();
