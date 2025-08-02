import mongoose from "mongoose";

const colorOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ["hex", "image"],
    default: "hex"
  },
  value: {
    type: String,
    required: true
  }
});

const productVariantSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["hex", "image"],
      default: "hex"
    },
    value: {
      type: String,
      required: true
    }
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  priceOverride: {
    type: Number,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  basePrice: {
    type: Number,
    required: [true, "Base price is required"],
    min: [0, "Price cannot be negative"]
  },
  baseSku: {
    type: String,
    required: [true, "Base SKU is required"],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true
  },
  subCategory: {
    type: String,
    trim: true
  },
  collectionType: {
    type: String,
    enum: ["men", "women", "train", "general"],
    default: "general",
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sizeOptions: [{
    type: String,
    trim: true
  }],
  colorOptions: [colorOptionSchema],
  variants: [productVariantSchema],
  defaultVariant: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ title: 'text', baseSku: 'text', category: 'text' });

// Pre-save middleware to generate variants if not provided
productSchema.pre('save', function(next) {
  if (this.sizeOptions.length > 0 && this.colorOptions.length > 0 && this.variants.length === 0) {
    this.variants = [];
    
    this.sizeOptions.forEach(size => {
      this.colorOptions.forEach(color => {
        const variantId = `variant-${size}-${color.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const sku = `${this.baseSku}-${size.toUpperCase()}-${color.name.substring(0, 3).toUpperCase()}`;
        
        this.variants.push({
          id: variantId,
          size,
          color,
          sku,
          stock: 0,
          isActive: true
        });
      });
    });
  }
  
  // Set default variant if not set
  if (!this.defaultVariant && this.variants.length > 0) {
    this.defaultVariant = this.variants[0].id;
  }
  
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product; 