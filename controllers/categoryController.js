import Category from "../models/Category.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ data: categories });
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
    .sort({ carouselOrder: 1, createdAt: -1 });
    
    res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, image, isActive, showInCarousel, carouselOrder, carouselImage } = req.body;
    
    const category = new Category({
      name,
      description,
      image,
      isActive: isActive !== undefined ? isActive : true,
      showInCarousel: showInCarousel || false,
      carouselOrder: carouselOrder || 0,
      carouselImage
    });
    
    await category.save();
    
    res.status(201).json({
      message: "Category created successfully",
      category
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
    
    res.json({
      message: "Category updated successfully",
      category
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
    
    res.json({
      message: "Category carousel settings updated successfully",
      category
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