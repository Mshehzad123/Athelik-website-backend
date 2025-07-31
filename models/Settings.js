import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  storeName: String,
  logo: String,
  currency: { 
    type: String, 
    default: "USD" 
  },
  language: { 
    type: String, 
    default: "en" 
  },
  timezone: String,
  country: String,
  freeShippingThreshold: Number,
  freeGiftThreshold: Number,
  freeGiftProduct: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product" 
  },
  emailSettings: {
    host: String,
    port: Number,
    username: String,
    password: String,
    senderName: String,
  },
  modules: {
    reviews: { 
      type: Boolean, 
      default: true 
    },
    coupons: { 
      type: Boolean, 
      default: true 
    },
    shipping: { 
      type: Boolean, 
      default: true 
    },
    bundles: { 
      type: Boolean, 
      default: true 
    },
  },
  seoMeta: {
    title: String,
    description: String,
    keywords: String,
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
  },
}, {
  timestamps: true
});

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings; 