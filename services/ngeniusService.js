// N-Genius Payment Service
import axios from 'axios';

class NGeniusService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Lazy loading of environment variables
  getConfig() {
    return {
      apiKey: process.env.N_GENIUS_API_KEY,
      outletId: process.env.N_GENIUS_OUTLET_ID,
      tokenUrl: process.env.N_GENIUS_TOKEN_URL,
      transactionUrlBase: process.env.N_GENIUS_TRANSACTION_URL_BASE
    };
  }

  // Get access token from N-Genius
  async getAccessToken() {
    try {
      // Check if current token is still valid
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      // Get config with lazy loading
      const config = this.getConfig();

      // Debug: Log environment variables
      console.log('🔍 N-Genius Debug:');
      console.log('API Key:', config.apiKey ? 'SET' : 'NOT SET');
      console.log('Outlet ID:', config.outletId);
      console.log('Token URL:', config.tokenUrl);
      console.log('Transaction URL Base:', config.transactionUrlBase);

      const authString = Buffer.from(`${config.apiKey}:`).toString('base64');
      
      // Try with form data and no Content-Type header
      const formData = new URLSearchParams();
      formData.append('grant_type', 'client_credentials');
      
      const response = await axios.post(config.tokenUrl, 
        formData.toString(),
        {
          headers: {
            'Authorization': `Basic ${authString}`,
            'Accept': 'application/json'
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
      const config = this.getConfig();
      const transactionUrl = `${config.transactionUrlBase}${config.outletId}/orders`;

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
