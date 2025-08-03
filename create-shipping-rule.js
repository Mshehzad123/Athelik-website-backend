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

const createShippingRule = async () => {
  try {
    await connectDB();

    // Delete existing rules to avoid conflicts
    await ShippingRule.deleteMany({});
    console.log("🗑️ Deleted existing shipping rules");

    // Create the main shipping rule
    const shippingRule = new ShippingRule({
      name: "US Standard Shipping",
      region: "US",
      minWeight: 0,
      maxWeight: 50,
      minOrderAmount: 0,
      maxOrderAmount: 10000,
      shippingCost: 10,
      freeShippingAt: 100, // Admin can change this to 500, 700, etc.
      deliveryDays: 3,
      isActive: true,
      priority: 1
    });

    await shippingRule.save();
    console.log("✅ Created shipping rule:", shippingRule.name);
    console.log("📋 Rule details:");
    console.log("   - Shipping Cost: $", shippingRule.shippingCost);
    console.log("   - Free Shipping At: $", shippingRule.freeShippingAt);
    console.log("   - Delivery Days:", shippingRule.deliveryDays);
    console.log("   - Region:", shippingRule.region);

    // Create additional rules for other regions
    const additionalRules = [
      {
        name: "International Shipping",
        region: "INTL",
        minWeight: 0,
        maxWeight: 50,
        minOrderAmount: 0,
        maxOrderAmount: 10000,
        shippingCost: 25,
        freeShippingAt: 200,
        deliveryDays: 7,
        isActive: true,
        priority: 2
      },
      {
        name: "Europe Shipping",
        region: "EU",
        minWeight: 0,
        maxWeight: 50,
        minOrderAmount: 0,
        maxOrderAmount: 10000,
        shippingCost: 20,
        freeShippingAt: 150,
        deliveryDays: 5,
        isActive: true,
        priority: 3
      }
    ];

    for (const ruleData of additionalRules) {
      const rule = new ShippingRule(ruleData);
      await rule.save();
      console.log("✅ Created shipping rule:", rule.name);
    }

    console.log("\n🎉 All shipping rules created successfully!");
    console.log("📊 Total rules created:", await ShippingRule.countDocuments());

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating shipping rule:", error);
    process.exit(1);
  }
};

createShippingRule(); 