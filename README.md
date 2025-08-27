# E-commerce API Demo Project

This is a demo project showcasing how **imdone-cli** integrates Jira project management with local development workflows.

## Project Overview
A simple Node.js/Express e-commerce API with user authentication, product catalog, and order management.

## Features
- User registration and authentication
- Product catalog management
- Shopping cart functionality
- Order processing
- Admin dashboard

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Validation**: Joi
- **Testing**: Jest, Supertest

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- imdone-cli (for project management)

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Start development server
npm run dev
```

### Project Management with imdone-cli
This project uses imdone-cli to sync Jira issues with local markdown files:

```bash
# Pull latest issues from Jira
imdone pull

# View current sprint issues
ls backlog/current-sprint/

# Push updates back to Jira
imdone push
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

## Development Workflow

1. **Check Jira for assigned tasks**: `imdone pull`
2. **Work on feature locally**: Edit code, write tests
3. **Update issue status**: Edit the markdown file in `backlog/`
4. **Sync back to Jira**: `imdone push`

## Demo Scenarios

### Scenario 1: New Feature Development
- Story: "Add product rating system"
- Shows: Pull issue → Implement feature → Update status → Push to Jira

### Scenario 2: Bug Fix Workflow  
- Bug: "Cart total calculation incorrect"
- Shows: Investigate → Fix → Test → Document solution → Update Jira

### Scenario 3: Code Review Process
- Shows: Comment threads sync between Jira and local markdown files

## License
MIT
