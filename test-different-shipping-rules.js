import mongoose from "mongoose";
import ShippingRule from "./models/ShippingRule.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const testDifferentRules = async () => {
  try {
    await connectDB();

    // Delete existing rules
    await ShippingRule.deleteMany({});
    console.log("🗑️ Deleted existing shipping rules");

    // Test different shipping rules
    const testRules = [
      {
        name: "Low Threshold Rule",
        region: "US",
        minWeight: 0,
        maxWeight: 50,
        minOrderAmount: 0,
        maxOrderAmount: 10000,
        shippingCost: 5,
        freeShippingAt: 50, // $50 for free shipping
        deliveryDays: 2,
        isActive: true,
        priority: 1
      },
      {
        name: "Medium Threshold Rule", 
        region: "US",
        minWeight: 0,
        maxWeight: 50,
        minOrderAmount: 0,
        maxOrderAmount: 10000,
        shippingCost: 10,
        freeShippingAt: 100, // $100 for free shipping
        deliveryDays: 3,
        isActive: true,
        priority: 2
      },
      {
        name: "High Threshold Rule",
        region: "US", 
        minWeight: 0,
        maxWeight: 50,
        minOrderAmount: 0,
        maxOrderAmount: 10000,
        shippingCost: 15,
        freeShippingAt: 500, // $500 for free shipping
        deliveryDays: 5,
        isActive: true,
        priority: 3
      },
      {
        name: "Premium Threshold Rule",
        region: "US",
        minWeight: 0,
        maxWeight: 50,
        minOrderAmount: 0,
        maxOrderAmount: 10000,
        shippingCost: 20,
        freeShippingAt: 700, // $700 for free shipping
        deliveryDays: 7,
        isActive: true,
        priority: 4
      }
    ];

    console.log("🧪 Creating test shipping rules...\n");

    for (const ruleData of testRules) {
      const rule = new ShippingRule(ruleData);
      await rule.save();
      console.log(`✅ Created: ${rule.name}`);
      console.log(`   - Free Shipping At: $${rule.freeShippingAt}`);
      console.log(`   - Shipping Cost: $${rule.shippingCost}`);
      console.log(`   - Delivery Days: ${rule.deliveryDays}`);
      console.log("");
    }

    console.log("🎉 All test rules created successfully!");
    console.log("📊 Total rules created:", await ShippingRule.countDocuments());
    console.log("\n💡 To test different rules:");
    console.log("1. Go to admin dashboard");
    console.log("2. Navigate to Shipping section");
    console.log("3. Edit any rule's 'Free Shipping At' value");
    console.log("4. Checkout page will automatically update!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test rules:", error);
    process.exit(1);
  }
};

testDifferentRules(); 