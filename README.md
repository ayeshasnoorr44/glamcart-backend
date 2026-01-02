# Glamcart Backend API

Express.js + TypeScript backend for the Glamcart virtual try-on application. Handles product catalog, image processing for virtual lipstick try-on, and user cart management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier available)
- Docker (for containerized deployment)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and settings
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Build & Production**
   ```bash
   npm run build
   npm start
   ```

## 🐳 Docker

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run
```

## 📋 API Endpoints

### Products
- `GET /api/products` - Get all products (filters: category, brand)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)

### Virtual Try-On
- `POST /api/try-on/apply` - Apply lipstick color to uploaded image
  - Multipart form: image file + productId + colorHex

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/:userId/add` - Add to cart
- `DELETE /api/cart/:userId/:productId` - Remove from cart

## 🗄️ Database Schema

### Product
- name, brand, description, price
- colors: [{ name, hex, imageUrl }]
- category: 'lipstick' | 'eyeshadow' | 'blush'
- stock, rating, reviews

### User
- email, name, photoUrl
- cart: [{ productId, colorHex, quantity }]

## 🔧 Tech Stack
- Express.js
- TypeScript
- Mongoose (MongoDB ODM)
- Sharp (image processing)
- Multer (file upload)

## 📦 Deployment

- **Platform**: DigitalOcean Droplet
- **Container**: Docker
- **CI/CD**: GitHub Actions
- **Database**: MongoDB Atlas

See [CI/CD README](./docs/DEPLOYMENT.md) for details.
