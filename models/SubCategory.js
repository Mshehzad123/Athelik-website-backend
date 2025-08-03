import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Sub-category name is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Parent category is required"],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
subCategorySchema.index({ name: 'text', category: 'text' });

export default mongoose.model("SubCategory", subCategorySchema); 