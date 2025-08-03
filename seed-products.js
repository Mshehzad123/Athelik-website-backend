import mongoose from "mongoose";
import Product from "./models/Product.js";

// Connect to database
mongoose.connect("mongodb://localhost:27017/ecommerce_admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testProducts = [
  {
    title: "Essential Pro 7 Inch Shorts - Coral",
    basePrice: 23.00,
    baseSku: "SHORTS-CORAL-001",
    category: "Men",
    subCategory: "Shorts",
    description: "Premium athletic shorts designed for performance and comfort during your most intense workouts.",
    isActive: true,
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    colorOptions: [
      {
        name: "Coral",
        type: "hex",
        value: "#FF6B6B"
      },
      {
        name: "Navy",
        type: "hex", 
        value: "#1a237e"
      }
    ],
    variants: [
      {
        id: "variant-S-Coral-1",
        size: "S",
        color: {
          name: "Coral",
          type: "hex",
          value: "#FF6B6B"
        },
        sku: "SHORTS-CORAL-001-S",
        stock: 10,
        isActive: true
      },
      {
        id: "variant-M-Coral-1", 
        size: "M",
        color: {
          name: "Coral",
          type: "hex",
          value: "#FF6B6B"
        },
        sku: "SHORTS-CORAL-001-M",
        stock: 15,
        isActive: true
      }
    ],
    defaultVariant: "variant-M-Coral-1",
    images: ["/uploads/test-product-1.jpg"]
  },
  {
    title: "Training Shorts",
    basePrice: 35.00,
    baseSku: "SHORTS-TRAINING-001", 
    category: "Men",
    subCategory: "Shorts",
    description: "Comfortable, flexible shorts perfect for any training session.",
    isActive: true,
    sizeOptions: ["S", "M", "L", "XL"],
    colorOptions: [
      {
        name: "Black",
        type: "hex",
        value: "#000000"
      }
    ],
    variants: [
      {
        id: "variant-M-Black-1",
        size: "M", 
        color: {
          name: "Black",
          type: "hex",
          value: "#000000"
        },
        sku: "SHORTS-TRAINING-001-M",
        stock: 20,
        isActive: true
      }
    ],
    defaultVariant: "variant-M-Black-1",
    images: ["/uploads/test-product-2.jpg"]
  },
  {
    title: "Performance Tank Top - Black",
    basePrice: 25.00,
    baseSku: "TANK-BLACK-001",
    category: "Men",
    subCategory: "Tanks",
    description: "Lightweight and breathable tank top perfect for intense workouts and training sessions.",
    isActive: true,
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    colorOptions: [
      {
        name: "Black",
        type: "hex",
        value: "#000000"
      },
      {
        name: "Navy",
        type: "hex",
        value: "#1a237e"
      }
    ],
    variants: [
      {
        id: "variant-M-Black-1",
        size: "M",
        color: {
          name: "Black",
          type: "hex",
          value: "#000000"
        },
        sku: "TANK-BLACK-001-M",
        stock: 15,
        isActive: true
      },
      {
        id: "variant-L-Black-1",
        size: "L",
        color: {
          name: "Black",
          type: "hex",
          value: "#000000"
        },
        sku: "TANK-BLACK-001-L",
        stock: 12,
        isActive: true
      }
    ],
    defaultVariant: "variant-M-Black-1",
    images: ["/uploads/test-product-3.jpg"]
  },
  {
    title: "Athletic Tank Top - Grey",
    basePrice: 28.00,
    baseSku: "TANK-GREY-001",
    category: "Men",
    subCategory: "Tanks",
    description: "Comfortable athletic tank top with moisture-wicking technology for optimal performance.",
    isActive: true,
    sizeOptions: ["S", "M", "L", "XL"],
    colorOptions: [
      {
        name: "Grey",
        type: "hex",
        value: "#9e9e9e"
      },
      {
        name: "White",
        type: "hex",
        value: "#ffffff"
      }
    ],
    variants: [
      {
        id: "variant-M-Grey-1",
        size: "M",
        color: {
          name: "Grey",
          type: "hex",
          value: "#9e9e9e"
        },
        sku: "TANK-GREY-001-M",
        stock: 18,
        isActive: true
      }
    ],
    defaultVariant: "variant-M-Grey-1",
    images: ["/uploads/test-product-4.jpg"]
  }
];

async function seedProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Add test products
    for (const productData of testProducts) {
      const product = new Product(productData);
      await product.save();
      console.log(`Added product: ${productData.title}`);
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedProducts(); 