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