// Test setup file
const mongoose = require('mongoose');

// Setup test database connection
beforeAll(async () => {
  const testDbUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ecommerce-demo-test';
  
  try {
    await mongoose.connect(testDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Test database connection failed:', error);
  }
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
