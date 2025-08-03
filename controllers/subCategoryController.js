import SubCategory from "../models/SubCategory.js";

// Get all subcategories
export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().sort({ createdAt: -1 });
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform subcategories to include full image URLs
    const transformedSubCategories = subCategories.map(subCategory => ({
      _id: subCategory._id,
      name: subCategory.name,
      category: subCategory.category,
      description: subCategory.description,
      image: subCategory.image ? `${baseUrl}${subCategory.image}` : undefined,
      isActive: subCategory.isActive,
      createdAt: subCategory.createdAt
    }));
    
    res.json({ data: transformedSubCategories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get subcategories by parent category
export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const subCategories = await SubCategory.find({ 
      category: category,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform subcategories to include full image URLs
    const transformedSubCategories = subCategories.map(subCategory => ({
      _id: subCategory._id,
      name: subCategory.name,
      category: subCategory.category,
      description: subCategory.description,
      image: subCategory.image ? `${baseUrl}${subCategory.image}` : undefined,
      isActive: subCategory.isActive,
      createdAt: subCategory.createdAt
    }));
    
    res.json({ data: transformedSubCategories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new subcategory
export const createSubCategory = async (req, res) => {
  try {
    const { name, category, description, image, isActive } = req.body;
    
    const subCategory = new SubCategory({
      name,
      category,
      description,
      image,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await subCategory.save();
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform subcategory to include full image URLs
    const transformedSubCategory = {
      _id: subCategory._id,
      name: subCategory.name,
      category: subCategory.category,
      description: subCategory.description,
      image: subCategory.image ? `${baseUrl}${subCategory.image}` : undefined,
      isActive: subCategory.isActive,
      createdAt: subCategory.createdAt
    };
    
    res.status(201).json({
      message: "Sub-category created successfully",
      data: transformedSubCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update subcategory
export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const subCategory = await SubCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!subCategory) {
      return res.status(404).json({ message: "Sub-category not found" });
    }
    
    // Get the base URL for images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Transform subcategory to include full image URLs
    const transformedSubCategory = {
      _id: subCategory._id,
      name: subCategory.name,
      category: subCategory.category,
      description: subCategory.description,
      image: subCategory.image ? `${baseUrl}${subCategory.image}` : undefined,
      isActive: subCategory.isActive,
      createdAt: subCategory.createdAt
    };
    
    res.json({
      message: "Sub-category updated successfully",
      data: transformedSubCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete subcategory
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subCategory = await SubCategory.findByIdAndDelete(id);
    
    if (!subCategory) {
      return res.status(404).json({ message: "Sub-category not found" });
    }
    
    res.json({
      message: "Sub-category deleted successfully",
      data: subCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 