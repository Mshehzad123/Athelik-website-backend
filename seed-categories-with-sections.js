import mongoose from "mongoose";
import Category from "./models/Category.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories");

    // Carousel categories (first 7)
    const carouselCategories = [
      {
        name: "Premium T-Shirts",
        description: "High-quality athletic t-shirts for all your workouts",
        image: "/uploads/images-1753852059312-462791769.png",
        carouselImage: "/uploads/images-1753852059312-462791769.png",
        showInCarousel: true,
        carouselOrder: 1,
        displaySection: "carousel",
        sectionOrder: 1,
        discountPercentage: 0,
        isActive: true
      },
      {
        name: "Sports Bras",
        description: "Comfortable and supportive sports bras for women",
        image: "/uploads/images-1753852069731-938864153.jpeg",
        carouselImage: "/uploads/images-1753852069731-938864153.jpeg",
        showInCarousel: true,
        carouselOrder: 2,
        displaySection: "carousel",
        sectionOrder: 2,
        discountPercentage: 15,
        isActive: true
      },
      {
        name: "Athletic Shorts",
        description: "Performance shorts for running and training",
        image: "/uploads/images-1753852837591-821548569.jpeg",
        carouselImage: "/uploads/images-1753852837591-821548569.jpeg",
        showInCarousel: true,
        carouselOrder: 3,
        displaySection: "carousel",
        sectionOrder: 3,
        discountPercentage: 0,
        isActive: true
      },
      {
        name: "Leggings",
        description: "High-performance leggings for all activities",
        image: "/uploads/images-1753853140626-754103485.jpeg",
        carouselImage: "/uploads/images-1753853140626-754103485.jpeg",
        showInCarousel: true,
        carouselOrder: 4,
        displaySection: "carousel",
        sectionOrder: 4,
        discountPercentage: 20,
        isActive: true
      },
      {
        name: "Tank Tops",
        description: "Lightweight tank tops for summer workouts",
        image: "/uploads/images-1753853149712-904239825.jpeg",
        carouselImage: "/uploads/images-1753853149712-904239825.jpeg",
        showInCarousel: true,
        carouselOrder: 5,
        displaySection: "carousel",
        sectionOrder: 5,
        discountPercentage: 0,
        isActive: true
      },
      {
        name: "Hoodies",
        description: "Warm and comfortable hoodies for cold weather",
        image: "/uploads/images-1753853457442-369380523.jpeg",
        carouselImage: "/uploads/images-1753853457442-369380523.jpeg",
        showInCarousel: true,
        carouselOrder: 6,
        displaySection: "carousel",
        sectionOrder: 6,
        discountPercentage: 25,
        isActive: true
      },
      {
        name: "Joggers",
        description: "Comfortable joggers for casual and athletic wear",
        image: "/uploads/images-1753853471974-485812337.jpeg",
        carouselImage: "/uploads/images-1753853471974-485812337.jpeg",
        showInCarousel: true,
        carouselOrder: 7,
        displaySection: "carousel",
        sectionOrder: 7,
        discountPercentage: 0,
        isActive: true
      }
    ];

    // Women section categories (next 4)
    const womenCategories = [
      {
        name: "T-Shirts & Tops",
        description: "Get ready for the ultimate style and performance combo with our women's gym t-shirts.",
        image: "/uploads/images-1753853611483-1069919.jpeg",
        carouselImage: "/uploads/images-1753853611483-1069919.jpeg",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "women",
        sectionOrder: 1,
        discountPercentage: 0,
        isActive: true
      },
      {
        name: "Running",
        description: "Running stuff so good it'll (almost) make you want to do cardio.",
        image: "/uploads/images-1753853694151-457587366.jpeg",
        carouselImage: "/uploads/images-1753853694151-457587366.jpeg",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "women",
        sectionOrder: 2,
        discountPercentage: 0,
        isActive: true
      },
      {
        name: "Ready for Lift(ing) Off",
        description: "These new rest day essentials make for perfect travel fits.",
        image: "/uploads/images-1753854028550-577336343.jpeg",
        carouselImage: "/uploads/images-1753854028550-577336343.jpeg",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "women",
        sectionOrder: 3,
        discountPercentage: 0,
        isActive: true
      },
      {
        name: "Extra 30% Off Last Chance Looks",
        description: "This bank holiday grab your new season staples and make it the kit you wear when you hit a PB.",
        image: "/uploads/images-1753854298417-100619416.jpeg",
        carouselImage: "/uploads/images-1753854298417-100619416.jpeg",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "women",
        sectionOrder: 4,
        discountPercentage: 30,
        isActive: true
      }
    ];

    // Men section categories (next 4)
    const menCategories = [
      {
        name: "Golden Era Fresh Legacy - Marvelous",
        description: "Premium men's athletic wear with classic styling",
        image: "/uploads/images-1753854304153-42779903.jpeg",
        carouselImage: "/uploads/images-1753854304153-42779903.jpeg",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "men",
        sectionOrder: 1,
        discountPercentage: 0,
        isActive: true
      },
      {
        name: '3" Jogger Shorts - Navy',
        description: "Comfortable and stylish jogger shorts for men",
        image: "/uploads/images-1753854384034-216936963.jpeg",
        carouselImage: "/uploads/images-1753854384034-216936963.jpeg",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "men",
        sectionOrder: 2,
        discountPercentage: 0,
        isActive: true
      },
      {
        name: "Sweat Tee - Paloma Grey Marl",
        description: "Premium sweat tee for men's workouts",
        image: "/uploads/images-1753854390540-311505371.jpeg",
        carouselImage: "/uploads/images-1753854390540-311505371.jpeg",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "men",
        sectionOrder: 3,
        discountPercentage: 0,
        isActive: true
      },
      {
        name: "Golden Era Fresh Legacy - Paloma",
        description: "Classic men's athletic wear with modern comfort",
        image: "/uploads/images-1753855121624-545063490.jpeg",
        carouselImage: "/uploads/images-1753855121624-545063490.jpeg",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "men",
        sectionOrder: 4,
        discountPercentage: 0,
        isActive: true
      }
    ];

    // Training section categories (next 4)
    const trainingCategories = [
      {
        name: "LIFTING",
        description: "Power through your strength training sessions",
        image: "/uploads/images-1753855128815-138456929.jpeg",
        carouselImage: "/uploads/images-1753855128815-138456929.jpeg",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "training",
        sectionOrder: 1,
        discountPercentage: 0,
        isActive: true
      },
      {
        name: "HIIT",
        description: "High-intensity interval training gear",
        image: "/uploads/images-1753870647103-537273966.png",
        carouselImage: "/uploads/images-1753870647103-537273966.png",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "training",
        sectionOrder: 2,
        discountPercentage: 15,
        isActive: true
      },
      {
        name: "RUNNING",
        description: "Built for speed and endurance",
        image: "/uploads/images-1753870657034-850700221.png",
        carouselImage: "/uploads/images-1753870657034-850700221.png",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "training",
        sectionOrder: 3,
        discountPercentage: 0,
        isActive: true
      },
      {
        name: "PILATES",
        description: "Flexible and comfortable for low-impact workouts",
        image: "/uploads/images-1754025555705-277325131.png",
        carouselImage: "/uploads/images-1754025555705-277325131.png",
        showInCarousel: false,
        carouselOrder: 0,
        displaySection: "training",
        sectionOrder: 4,
        discountPercentage: 20,
        isActive: true
      }
    ];

    // Combine all categories
    const allCategories = [
      ...carouselCategories,
      ...womenCategories,
      ...menCategories,
      ...trainingCategories
    ];

    // Insert all categories
    const result = await Category.insertMany(allCategories);
    console.log(`Successfully seeded ${result.length} categories`);

    console.log("Categories by section:");
    console.log(`Carousel: ${carouselCategories.length} categories`);
    console.log(`Women: ${womenCategories.length} categories`);
    console.log(`Men: ${menCategories.length} categories`);
    console.log(`Training: ${trainingCategories.length} categories`);

  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected");
  }
};

// Run the seeding
connectDB().then(() => {
  seedCategories();
}); 