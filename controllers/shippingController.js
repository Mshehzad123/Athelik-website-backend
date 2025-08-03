import ShippingRule from "../models/ShippingRule.js";

// Get all shipping rules
export const getShippingRules = async (req, res) => {
  try {
    const rules = await ShippingRule.find().sort({ priority: 1, createdAt: -1 });
    res.json({ data: rules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get shipping rule by ID
export const getShippingRuleById = async (req, res) => {
  try {
    const rule = await ShippingRule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: "Shipping rule not found" });
    }
    res.json({ data: rule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create shipping rule
export const createShippingRule = async (req, res) => {
  try {
    const rule = new ShippingRule(req.body);
    await rule.save();
    res.status(201).json({ data: rule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update shipping rule
export const updateShippingRule = async (req, res) => {
  try {
    const rule = await ShippingRule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!rule) {
      return res.status(404).json({ error: "Shipping rule not found" });
    }
    res.json({ data: rule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete shipping rule
export const deleteShippingRule = async (req, res) => {
  try {
    const rule = await ShippingRule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: "Shipping rule not found" });
    }
    res.json({ message: "Shipping rule deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate shipping cost (public endpoint)
export const calculateShipping = async (req, res) => {
  try {
    const { subtotal, region = 'US', weight = 0 } = req.body;

    if (!subtotal || subtotal < 0) {
      return res.status(400).json({ error: "Valid subtotal is required" });
    }

    // Find applicable shipping rules
    const applicableRules = await ShippingRule.find({
      isActive: true,
      region: { $in: [region, 'GLOBAL'] },
      minOrderAmount: { $lte: subtotal },
      maxOrderAmount: { $gte: subtotal },
      minWeight: { $lte: weight },
      maxWeight: { $gte: weight }
    }).sort({ priority: 1 });

    if (applicableRules.length === 0) {
      // Try to find any active rule for the region
      const anyActiveRule = await ShippingRule.findOne({
        isActive: true,
        region: { $in: [region, 'GLOBAL'] }
      }).sort({ priority: 1 });

      if (anyActiveRule) {
        const isFreeShipping = subtotal >= anyActiveRule.freeShippingAt;
        const shippingCost = isFreeShipping ? 0 : anyActiveRule.shippingCost;
        
        return res.json({
          shippingCost,
          isFreeShipping,
          deliveryDays: anyActiveRule.deliveryDays,
          rule: {
            name: anyActiveRule.name,
            region: anyActiveRule.region,
            freeShippingAt: anyActiveRule.freeShippingAt
          },
          remainingForFreeShipping: isFreeShipping ? 0 : anyActiveRule.freeShippingAt - subtotal
        });
      } else {
        // Fallback to default values if no rules exist
        return res.json({
          shippingCost: subtotal >= 100 ? 0 : 10,
          isFreeShipping: subtotal >= 100,
          deliveryDays: 3,
          rule: {
            name: "Default Shipping",
            region: "US",
            freeShippingAt: 100
          },
          remainingForFreeShipping: subtotal >= 100 ? 0 : 100 - subtotal
        });
      }
    }

    // Use the highest priority rule (lowest number = highest priority)
    const selectedRule = applicableRules[0];
    
    // Check if free shipping applies
    const isFreeShipping = subtotal >= selectedRule.freeShippingAt;
    const shippingCost = isFreeShipping ? 0 : selectedRule.shippingCost;

    res.json({
      shippingCost,
      isFreeShipping,
      deliveryDays: selectedRule.deliveryDays,
      rule: {
        name: selectedRule.name,
        region: selectedRule.region,
        freeShippingAt: selectedRule.freeShippingAt
      },
      remainingForFreeShipping: isFreeShipping ? 0 : selectedRule.freeShippingAt - subtotal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active shipping rules (public endpoint)
export const getActiveShippingRules = async (req, res) => {
  try {
    const rules = await ShippingRule.find({ isActive: true }).sort({ priority: 1 });
    res.json({ data: rules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 