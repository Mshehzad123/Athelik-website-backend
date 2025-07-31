# Athelik Backend

This is the backend API for the Athelik e-commerce platform. It provides all the necessary endpoints for the admin dashboard and main website.

## Features

- **Product Management**: Create, update, delete, and manage products with variants
- **User Management**: Admin, manager, and viewer roles with authentication
- **Order Management**: Track orders and their status
- **Review System**: Manage product reviews
- **Coupon System**: Create and manage discount coupons
- **Bundle Management**: Create product bundles
- **Customer Management**: Track customer information
- **Settings Management**: Store configuration
- **Dashboard Statistics**: Get analytics and statistics
- **File Upload**: Handle product images and other files

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/ecommerce_admin
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

3. **Database**
   Make sure MongoDB is running on your system. The database will be created automatically.

4. **Start the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Default Users

The system creates default users on first run:

- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123
- **Viewer**: viewer@example.com / viewer123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login

### Products (Admin)
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/upload-images` - Upload product images

### Products (Public)
- `GET /api/public/products/public/all` - Get all active products
- `GET /api/public/products/public/:id` - Get product by ID

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Orders
- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id` - Update order

### Reviews
- `GET /api/reviews` - Get all reviews
- `PUT /api/reviews/:id` - Update review

### Coupons
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons` - Create coupon

### Bundles
- `GET /api/bundles` - Get all bundles
- `POST /api/bundles` - Create bundle

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

### Customers
- `GET /api/customers` - Get all customers
- `PUT /api/customers/:id` - Update customer

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## File Structure

```
Athelik-Backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── userController.js
│   ├── orderController.js
│   ├── reviewController.js
│   ├── couponController.js
│   ├── bundleController.js
│   ├── settingsController.js
│   ├── customerController.js
│   └── dashboardController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   ├── Review.js
│   ├── Coupon.js
│   ├── Bundle.js
│   ├── Settings.js
│   └── Customer.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── userRoutes.js
│   ├── orderRoutes.js
│   ├── reviewRoutes.js
│   ├── couponRoutes.js
│   ├── bundleRoutes.js
│   ├── settingsRoutes.js
│   ├── customerRoutes.js
│   └── dashboardRoutes.js
├── uploads/
├── index.js
├── package.json
└── README.md
```

## Integration with Frontend

The backend provides both authenticated routes (for admin dashboard) and public routes (for main website). The main website can fetch products using the public endpoints without authentication.

## Security

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- CORS enabled
- Helmet for security headers
- File upload validation 