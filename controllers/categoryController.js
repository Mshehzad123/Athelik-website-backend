import Category from "../models/Category.js";

// Get categories organized by Men and Women for dashboard dropdown
export const getDashboardCategories = async (req, res) => {
  try {
    // Get all active categories
    const allCategories = await Category.find({ isActive: true }).sort({ sectionOrder: 1, createdAt: -1 });
    
    // Organize categories by section
    const organizedCategories = {
      men: allCategories.filter(cat => cat.displaySection === 'men'),
      women: allCategories.filter(cat => cat.displaySection === 'women'),
      other: allCategories.filter(cat => !cat.displaySection || cat.displaySection === 'none')
    };
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform categories to include full image URLs
    const transformCategories = (categories) => categories.map(category => ({
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image ? `${baseUrl}${category.image}` : undefined,
      carouselImage: category.carouselImage ? `${baseUrl}${category.carouselImage}` : undefined,
      showInCarousel: category.showInCarousel,
      carouselOrder: category.carouselOrder,
      displaySection: category.displaySection,
      sectionOrder: category.sectionOrder,
      isActive: category.isActive,
      createdAt: category.createdAt
    }));
    
    const result = {
      men: transformCategories(organizedCategories.men),
      women: transformCategories(organizedCategories.women),
      other: transformCategories(organizedCategories.other)
    };
    
    res.json({ 
      success: true,
      data: result 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform categories to include full image URLs
    const transformedCategories = categories.map(category => ({
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image ? `${baseUrl}${category.image}` : undefined,
      carouselImage: category.carouselImage ? `${baseUrl}${category.carouselImage}` : undefined,
      showInCarousel: category.showInCarousel,
      carouselOrder: category.carouselOrder,
      isActive: category.isActive,
      createdAt: category.createdAt
    }));
    
    res.json({ data: transformedCategories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get categories for carousel (only active and showInCarousel = true)
export const getCarouselCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
      showInCarousel: true
    })
    .sort({ carouselOrder: 1, createdAt: -1 })
    .limit(7); // Limit to first 7 for carousel
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform categories to include full image URLs
    const transformedCategories = categories.map(category => ({
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image ? `${baseUrl}${category.image}` : undefined,
      carouselImage: category.carouselImage ? `${baseUrl}${category.carouselImage}` : undefined,
      showInCarousel: category.showInCarousel,
      carouselOrder: category.carouselOrder,
      displaySection: category.displaySection,
      sectionOrder: category.sectionOrder,
      isActive: category.isActive,
      createdAt: category.createdAt
    }));
    
    res.json({ data: transformedCategories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get categories for women section
export const getWomenCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
      displaySection: 'women'
    })
    .sort({ sectionOrder: 1, createdAt: -1 })
    .limit(4); // Limit to 4 for women section
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform categories to include full image URLs
    const transformedCategories = categories.map(category => ({
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image ? `${baseUrl}${category.image}` : undefined,
      carouselImage: category.carouselImage ? `${baseUrl}${category.carouselImage}` : undefined,
      discountPercentage: category.discountPercentage,
      displaySection: category.displaySection,
      sectionOrder: category.sectionOrder,
      isActive: category.isActive,
      createdAt: category.createdAt
    }));
    
    res.json({ data: transformedCategories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get categories for men section
export const getMenCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
      displaySection: 'men'
    })
    .sort({ sectionOrder: 1, createdAt: -1 })
    .limit(4); // Limit to 4 for men section
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform categories to include full image URLs
    const transformedCategories = categories.map(category => ({
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image ? `${baseUrl}${category.image}` : undefined,
      carouselImage: category.carouselImage ? `${baseUrl}${category.carouselImage}` : undefined,
      discountPercentage: category.discountPercentage,
      displaySection: category.displaySection,
      sectionOrder: category.sectionOrder,
      isActive: category.isActive,
      createdAt: category.createdAt
    }));
    
    res.json({ data: transformedCategories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get categories for training section
export const getTrainingCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
      displaySection: 'training'
    })
    .sort({ sectionOrder: 1, createdAt: -1 })
    .limit(4); // Limit to 4 for training section
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform categories to include full image URLs
    const transformedCategories = categories.map(category => ({
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image ? `${baseUrl}${category.image}` : undefined,
      carouselImage: category.carouselImage ? `${baseUrl}${category.carouselImage}` : undefined,
      showInCarousel: category.showInCarousel,
      carouselOrder: category.carouselOrder,
      isActive: category.isActive,
      createdAt: category.createdAt
    }));
    
    res.json({ data: transformedCategories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      image, 
      isActive, 
      showInCarousel, 
      carouselOrder, 
      carouselImage,
      discountPercentage,
      displaySection,
      sectionOrder
    } = req.body;
    
    const category = new Category({
      name,
      description,
      image,
      isActive: isActive !== undefined ? isActive : true,
      showInCarousel: showInCarousel || false,
      carouselOrder: carouselOrder || 0,
      carouselImage,
      discountPercentage: discountPercentage || 0,
      displaySection: displaySection || 'none',
      sectionOrder: sectionOrder || 0
    });
    
    await category.save();
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform category to include full image URLs
    const transformedCategory = {
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image ? `${baseUrl}${category.image}` : undefined,
      carouselImage: category.carouselImage ? `${baseUrl}${category.carouselImage}` : undefined,
      showInCarousel: category.showInCarousel,
      carouselOrder: category.carouselOrder,
      isActive: category.isActive,
      createdAt: category.createdAt
    };
    
    res.status(201).json({
      message: "Category created successfully",
      category: transformedCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform category to include full image URLs
    const transformedCategory = {
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image ? `${baseUrl}${category.image}` : undefined,
      carouselImage: category.carouselImage ? `${baseUrl}${category.carouselImage}` : undefined,
      showInCarousel: category.showInCarousel,
      carouselOrder: category.carouselOrder,
      isActive: category.isActive,
      createdAt: category.createdAt
    };
    
    res.json({
      message: "Category updated successfully",
      category: transformedCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({
      message: "Category deleted successfully",
      category
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle carousel display for category
export const toggleCarouselDisplay = async (req, res) => {
  try {
    const { id } = req.params;
    const { showInCarousel, carouselOrder, carouselImage } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id,
      {
        showInCarousel,
        carouselOrder,
        carouselImage
      },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform category to include full image URLs
    const transformedCategory = {
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image ? `${baseUrl}${category.image}` : undefined,
      carouselImage: category.carouselImage ? `${baseUrl}${category.carouselImage}` : undefined,
      showInCarousel: category.showInCarousel,
      carouselOrder: category.carouselOrder,
      isActive: category.isActive,
      createdAt: category.createdAt
    };
    
    res.json({
      message: "Category carousel settings updated successfully",
      category: transformedCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get category statistics
export const getCategoryStats = async (req, res) => {
  try {
    const stats = await Category.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ["$isActive", 1, 0] } },
          inCarousel: { $sum: { $cond: ["$showInCarousel", 1, 0] } }
        }
      }
    ]);
    
    const statsData = stats[0] || { total: 0, active: 0, inCarousel: 0 };
    
    res.json({ data: statsData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 