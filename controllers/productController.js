import Product from "../models/Product.js";

// Get all products with search and filtering
export const getProducts = async (req, res) => {
  try {
    const { search, category, isActive, collectionType } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { baseSku: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by collection type
    if (collectionType) {
      query.collectionType = collectionType;
    }
    
    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform products to include full image URLs
    const transformedProducts = products.map(product => {
      const productObj = product.toObject();
      productObj.images = product.images ? product.images.map(img => `${baseUrl}${img}`) : [];
      return productObj;
    });
    
    res.status(200).json({
      success: true,
      data: transformedProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get public products (for main website)
export const getPublicProducts = async (req, res) => {
  try {
    const { search, category, collectionType } = req.query;
    
    let query = { isActive: true }; // Only active products for public
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by collection type
    if (collectionType) {
      query.collectionType = collectionType;
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform products for frontend compatibility
    const transformedProducts = products.map(product => {
      // Calculate discounted price
      const originalPrice = product.basePrice;
      const discountAmount = (originalPrice * product.discountPercentage) / 100;
      const discountedPrice = originalPrice - discountAmount;
      
      return {
        id: product._id,
        name: product.title,
        price: `AED${discountedPrice.toFixed(2)}`,
        originalPrice: product.discountPercentage > 0 ? 
          `AED${originalPrice.toFixed(2)}` : undefined,
        image: product.images && product.images.length > 0 ? 
          `${baseUrl}${product.images[0]}` : "/placeholder.svg?height=400&width=300",
        images: product.images ? product.images.map(img => `${baseUrl}${img}`) : [],
        category: product.category,
        subCategory: product.subCategory,
        collectionType: product.collectionType,
        description: product.description,
        discountPercentage: product.discountPercentage || 0,
        isOnSale: product.discountPercentage > 0,
        colors: product.colorOptions.map(color => ({
          name: color.name,
          hex: color.type === 'hex' ? color.value : undefined,
          image: color.type === 'image' ? color.value : undefined
        })),
        sizes: product.sizeOptions,
        variants: product.variants,
        defaultVariant: product.defaultVariant
      };
    });
    
    res.status(200).json({
      success: true,
      data: transformedProducts
    });
  } catch (error) {
    console.error('Error fetching public products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public products',
      error: error.message
    });
  }
};

// Get single product by ID
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform product to include full image URLs
    const productObj = product.toObject();
    productObj.images = product.images ? product.images.map(img => `${baseUrl}${img}`) : [];
    
    res.status(200).json({
      success: true,
      data: productObj
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Get public product by ID (for main website)
export const getPublicProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Calculate discounted price
    const originalPrice = product.basePrice;
    const discountAmount = (originalPrice * product.discountPercentage) / 100;
    const discountedPrice = originalPrice - discountAmount;
    
    // Transform product for frontend compatibility
    const transformedProduct = {
      id: product._id,
      name: product.title,
      price: `AED${discountedPrice.toFixed(2)}`,
      originalPrice: product.discountPercentage > 0 ? 
        `AED${originalPrice.toFixed(2)}` : undefined,
      image: product.images && product.images.length > 0 ? 
        `${baseUrl}${product.images[0]}` : "/placeholder.svg?height=400&width=300",
      images: product.images ? product.images.map(img => `${baseUrl}${img}`) : [],
      category: product.category,
      subCategory: product.subCategory,
      description: product.description,
      fullDescription: product.description,
      discountPercentage: product.discountPercentage || 0,
      isOnSale: product.discountPercentage > 0,
      purpose: product.purpose,
      features: product.features,
      materials: product.materials,
      care: product.care,
      colors: product.colorOptions.map(color => ({
        name: color.name,
        hex: color.type === 'hex' ? color.value : undefined,
        image: color.type === 'image' ? color.value : undefined
      })),
      sizes: product.sizeOptions,
      variants: product.variants,
      defaultVariant: product.defaultVariant,
      rating: product.reviewRating || 4.8,
      reviewCount: 0 // Default review count for now
    };
    
    res.status(200).json({
      success: true,
      data: transformedProduct
    });
  } catch (error) {
    console.error('Error fetching public product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      basePrice,
      baseSku,
      category,
      subCategory,
      description,
      discountPercentage,
      purpose,
      features,
      materials,
      care,
      reviewRating,
      isActive,
      isProductHighlight,
      highlightImageIndex,
      sizeOptions,
      colorOptions,
      variants,
      defaultVariant,
      images
    } = req.body;

    // Validate required fields
    if (!title || !basePrice || !baseSku || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, basePrice, baseSku, category'
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ baseSku });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: `Product with SKU "${baseSku}" already exists. Please use a different SKU.`
      });
    }

    // Validate images
    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required'
      });
    }

    // Validate highlight image index if product is being highlighted
    if (isProductHighlight && (highlightImageIndex === undefined || highlightImageIndex < 0 || highlightImageIndex >= images.length)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid highlight image when marking product as highlighted'
      });
    }

    // Validate size and color options
    if (!sizeOptions || sizeOptions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one size option'
      });
    }

    if (!colorOptions || colorOptions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one color option'
      });
    }

    // If this product is being marked as highlighted, unhighlight all other products
    if (isProductHighlight) {
      await Product.updateMany(
        { _id: { $ne: null } }, // Update all products
        { isProductHighlight: false }
      );
    }

    const productData = {
      title,
      basePrice: parseFloat(basePrice),
      baseSku,
      category,
      subCategory,
      description,
      discountPercentage: discountPercentage ? parseFloat(discountPercentage) : 0,
      purpose,
      features,
      materials,
      care,
      reviewRating: reviewRating ? parseFloat(reviewRating) : 5,
      isActive: isActive !== undefined ? isActive : true,
      isProductHighlight: isProductHighlight !== undefined ? isProductHighlight : false,
      highlightImageIndex: highlightImageIndex !== undefined ? parseInt(highlightImageIndex) : 0,
      sizeOptions,
      colorOptions,
      variants: variants || [],
      defaultVariant,
      images
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if SKU is being changed and if it already exists
    if (updateData.baseSku && updateData.baseSku !== existingProduct.baseSku) {
      const skuExists = await Product.findOne({ 
        baseSku: updateData.baseSku,
        _id: { $ne: id }
      });
      
      if (skuExists) {
        return res.status(400).json({
          success: false,
          message: 'Product with this SKU already exists'
        });
      }
    }

    // Validate images if being updated
    if (updateData.images && updateData.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required'
      });
    }

    // Validate highlight image index if product is being highlighted
    if (updateData.isProductHighlight && updateData.highlightImageIndex !== undefined) {
      const images = updateData.images || existingProduct.images;
      if (updateData.highlightImageIndex < 0 || updateData.highlightImageIndex >= images.length) {
        return res.status(400).json({
          success: false,
          message: 'Please select a valid highlight image when marking product as highlighted'
        });
      }
    }

    // If this product is being marked as highlighted, unhighlight all other products
    if (updateData.isProductHighlight) {
      await Product.updateMany(
        { _id: { $ne: id } }, // Update all products except current one
        { isProductHighlight: false }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Upload product images to local storage
export const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
      success: false,
        message: 'Please upload at least one image'
      });
    }

    const imageUrls = req.files.map(file => {
      // Return the file path relative to the public folder
      return `/uploads/${file.filename}`;
    });
    
    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: imageUrls
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
};

// Get product statistics
export const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({
      'variants.stock': { $lt: 10 }
    });

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching product stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product statistics',
      error: error.message
    });
  }
};

// Get highlighted product (for public website) - only one product can be highlighted
export const getHighlightedProducts = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      isActive: true, 
      isProductHighlight: true 
    }).sort({ createdAt: -1 });
    
    if (!product) {
      return res.status(200).json({
        success: true,
        data: null
      });
    }
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Calculate discounted price
    const originalPrice = product.basePrice;
    const discountAmount = (originalPrice * product.discountPercentage) / 100;
    const discountedPrice = originalPrice - discountAmount;
    
    // Get the highlight image (specific image selected for highlight)
    const highlightImageIndex = product.highlightImageIndex || 0;
    
    const highlightImage = product.images && product.images.length > highlightImageIndex 
      ? `${baseUrl}${product.images[highlightImageIndex]}` 
      : (product.images && product.images.length > 0 ? `${baseUrl}${product.images[0]}` : null);
    
    // Transform product for frontend compatibility
    const transformedProduct = {
      id: product._id,
      name: product.title,
      title: product.title,
      price: `AED${discountedPrice.toFixed(2)}`,
      basePrice: product.basePrice,
      originalPrice: originalPrice,
      image: highlightImage, // Use the specific highlight image
      images: product.images ? product.images.map(img => `${baseUrl}${img}`) : [],
      category: product.category,
      subCategory: product.subCategory,
      description: product.description,
      isOnSale: product.discountPercentage > 0,
      colors: product.colorOptions || [],
      sizes: product.sizeOptions || [],
      sizeOptions: product.sizeOptions || [],
      variants: product.variants || [],
      defaultVariant: product.defaultVariant,
      rating: product.reviewRating || 5,
      reviewRating: product.reviewRating || 5,
      reviewCount: 0
    };

    res.status(200).json({
      success: true,
      data: transformedProduct
    });
  } catch (error) {
    console.error('Error fetching highlighted product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch highlighted product',
      error: error.message
    });
  }
};

// Get current product's highlight image (for per-product highlight)
export const getProductHighlightImage = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if this product has a highlight image
    if (!product.isProductHighlight) {
      return res.status(200).json({
        success: true,
        data: null
      });
    }
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Get the highlight image (specific image selected for highlight)
    const highlightImageIndex = product.highlightImageIndex || 0;
    
    const highlightImage = product.images && product.images.length > highlightImageIndex 
      ? `${baseUrl}${product.images[highlightImageIndex]}` 
      : (product.images && product.images.length > 0 ? `${baseUrl}${product.images[0]}` : null);
    
    // Transform product for frontend compatibility
    const transformedProduct = {
      id: product._id,
      name: product.title,
      title: product.title,
      image: highlightImage, // Use the specific highlight image
      isProductHighlight: product.isProductHighlight,
      highlightImageIndex: product.highlightImageIndex
    };

    res.status(200).json({
      success: true,
      data: transformedProduct
    });
  } catch (error) {
    console.error('Error fetching product highlight image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product highlight image',
      error: error.message
    });
  }
}; 
