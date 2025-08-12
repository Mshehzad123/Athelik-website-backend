import Bundle from "../models/Bundle.js";

// Get all bundles
export const getBundles = async (req, res) => {
  try {
    const bundles = await Bundle.find().populate("products");
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const bundlesWithFullUrls = bundles.map(bundle => {
      const bundleObj = bundle.toObject();
      bundleObj.products = bundleObj.products.map(product => ({
        ...product,
        images: product.images ? product.images.map(img => `${baseUrl}${img}`) : []
      }));
      return bundleObj;
    });
    res.json({ data: bundlesWithFullUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bundle by ID
export const getBundleById = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id).populate("products");
    if (!bundle) {
      return res.status(404).json({ error: "Bundle not found" });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const bundleObj = bundle.toObject();
    bundleObj.products = bundleObj.products.map(product => ({
      ...product,
      images: product.images ? product.images.map(img => `${baseUrl}${img}`) : []
    }));
    res.json({ data: bundleObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new bundle
export const createBundle = async (req, res) => {
  try {
    const bundleData = req.body;

    // Validate product count (must be between 2 and 6)
    if (!bundleData.products || bundleData.products.length < 2 || bundleData.products.length > 6) {
      return res.status(400).json({
        error: "Bundle must contain between 2 and 6 products"
      });
    }

    // Validate that all products exist
    const Product = (await import("../models/Product.js")).default;
    const products = await Product.find({ _id: { $in: bundleData.products } });

    if (products.length !== bundleData.products.length) {
      return res.status(400).json({
        error: "Some products not found"
      });
    }

    // Remove category check

    // Calculate original price from products if not provided
    if (!bundleData.originalPrice) {
      bundleData.originalPrice = products.reduce((sum, product) => sum + product.basePrice, 0);
    }

    // Add bundle type based on product count
    bundleData.bundleType = `${bundleData.products.length}-products`;

    const bundle = new Bundle(bundleData);
    await bundle.save();

    const populatedBundle = await Bundle.findById(bundle._id).populate("products");
    res.status(201).json({ data: populatedBundle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update bundle
export const updateBundle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate product count (must be between 2 and 6) if products are being updated
    if (updateData.products && (updateData.products.length < 2 || updateData.products.length > 6)) {
      return res.status(400).json({
        error: "Bundle must contain between 2 and 6 products"
      });
    }

    // Validate that all products exist if products are being updated
    if (updateData.products) {
      const Product = (await import("../models/Product.js")).default;
      const products = await Product.find({ _id: { $in: updateData.products } });

      if (products.length !== updateData.products.length) {
        return res.status(400).json({
          error: "Some products not found"
        });
      }

      // Remove category check

      // Add bundle type based on product count
      updateData.bundleType = `${updateData.products.length}-products`;
    }

    // Calculate original price from products if not provided
    if (!updateData.originalPrice && updateData.products && updateData.products.length > 0) {
      const Product = (await import("../models/Product.js")).default;
      const products = await Product.find({ _id: { $in: updateData.products } });
      updateData.originalPrice = products.reduce((sum, product) => sum + product.basePrice, 0);
    }

    const bundle = await Bundle.findByIdAndUpdate(id, updateData, { new: true }).populate("products");

    if (!bundle) {
      return res.status(404).json({ error: "Bundle not found" });
    }

    res.json({ data: bundle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete bundle
export const deleteBundle = async (req, res) => {
  try {
    const { id } = req.params;
    const bundle = await Bundle.findByIdAndDelete(id);

    if (!bundle) {
      return res.status(404).json({ error: "Bundle not found" });
    }

    res.json({ message: "Bundle deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active bundles (for public website)
export const getActiveBundles = async (req, res) => {
  try {
    const now = new Date();
    const bundles = await Bundle.find({
      isActive: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    }).populate("products");
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const bundlesWithFullUrls = bundles.map(bundle => {
      const bundleObj = bundle.toObject();
      bundleObj.products = bundleObj.products.map(product => ({
        ...product,
        images: product.images ? product.images.map(img => `${baseUrl}${img}`) : []
      }));
      return bundleObj;
    });
    res.json({ data: bundlesWithFullUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active bundles by category (for public website)
export const getActiveBundlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!['men', 'women'].includes(category)) {
      return res.status(400).json({ error: "Category must be 'men' or 'women'" });
    }

    const now = new Date();
    const bundles = await Bundle.find({
      isActive: true,
      category: category,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    }).populate("products");
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const bundlesWithFullUrls = bundles.map(bundle => {
      const bundleObj = bundle.toObject();
      bundleObj.products = bundleObj.products.map(product => ({
        ...product,
        images: product.images ? product.images.map(img => `${baseUrl}${img}`) : []
      }));
      return bundleObj;
    });
    res.json({ data: bundlesWithFullUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate bundle discount for cart items
export const calculateBundleDiscount = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    // Get all active bundles
    const now = new Date();
    const bundles = await Bundle.find({
      isActive: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    }).populate("products");
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const bundlesWithFullUrls = bundles.map(bundle => {
      const bundleObj = bundle.toObject();
      bundleObj.products = bundleObj.products.map(product => ({
        ...product,
        images: product.images ? product.images.map(img => `${baseUrl}${img}`) : []
      }));
      return bundleObj;
    });

    let bestDiscount = null;
    let appliedBundle = null;

    // Check each bundle
    for (const bundle of bundlesWithFullUrls) {
      const bundleProductIds = bundle.products.map(p => p._id.toString());
      const cartProductIds = cartItems.map(item => item.productId);

      // Check if all bundle products are in cart
      const hasAllBundleProducts = bundleProductIds.every(id =>
        cartProductIds.includes(id)
      );

      if (hasAllBundleProducts) {
        // Calculate potential savings
        const bundleTotal = bundle.bundlePrice;
        const individualTotal = cartItems
          .filter(item => bundleProductIds.includes(item.productId))
          .reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const savings = individualTotal - bundleTotal;

        if (savings > 0 && (!bestDiscount || savings > bestDiscount)) {
          bestDiscount = savings;
          appliedBundle = bundle;
        }
      }
    }

    res.json({
      hasBundleDiscount: !!appliedBundle,
      bundle: appliedBundle,
      discountAmount: bestDiscount || 0,
      discountPercentage: appliedBundle ?
        Math.round(((bestDiscount / appliedBundle.originalPrice) * 100)) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
