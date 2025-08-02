import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: String,
  image: String,
  isActive: { 
    type: Boolean, 
    default: true 
  },
  // Carousel display settings
  showInCarousel: {
    type: Boolean,
    default: false
  },
  carouselOrder: {
    type: Number,
    default: 0
  },
  carouselImage: String, // Specific image for carousel display
  // Discount settings
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Section display settings
  displaySection: {
    type: String,
    enum: ['carousel', 'women', 'men', 'training', 'none'],
    default: 'none'
  },
  sectionOrder: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
});

const Category = mongoose.model("Category", categorySchema);

export default Category; 