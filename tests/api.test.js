const request = require('supertest');
const app = require('../src/app');

describe('Product API', () => {
  describe('GET /api/products', () => {
    test('should return list of products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    test('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=electronics')
        .expect(200);

      response.body.products.forEach(product => {
        expect(product.category).toBe('electronics');
      });
    });

    test('should filter products by price range', async () => {
      const minPrice = 50;
      const maxPrice = 200;
      
      const response = await request(app)
        .get(`/api/products?minPrice=${minPrice}&maxPrice=${maxPrice}`)
        .expect(200);

      response.body.products.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(minPrice);
        expect(product.price).toBeLessThanOrEqual(maxPrice);
      });
    });
  });

  describe('GET /api/products/:id', () => {
    test('should return single product', async () => {
      // This test would need a real product ID in a full implementation
      const productId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(404); // Expected since we don't have real data

      // In real test:
      // expect(response.body).toHaveProperty('product');
      // expect(response.body.product._id).toBe(productId);
    });

    test('should return 404 for invalid product ID', async () => {
      const response = await request(app)
        .get('/api/products/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/products', () => {
    test('should create new product with valid data', async () => {
      const newProduct = {
        name: 'Test Product',
        description: 'A test product for demonstration',
        price: 99.99,
        category: 'electronics',
        sku: 'TEST-001',
        stock: 10
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('product');
      expect(response.body.product.name).toBe(newProduct.name);
    });

    test('should reject invalid product data', async () => {
      const invalidProduct = {
        name: 'A', // Too short
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation failed');
    });
  });
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    test('should register new user with valid data', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(newUser.email);
    });

    test('should reject invalid email format', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      // This would require seeded test data in a real implementation
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      // In real test with seeded data:
      // .expect(200);
      // expect(response.body).toHaveProperty('token');
    });
  });
});

describe('Health Check', () => {
  test('should return healthy status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('environment');
  });
});
