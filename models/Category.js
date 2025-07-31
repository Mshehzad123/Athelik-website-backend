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
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
});

const Category = mongoose.model("Category", categorySchema);

export default Category; 