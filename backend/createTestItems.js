const mongoose = require('mongoose');
const Item = require('./models/Item');
const User = require('./models/Users');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rewear';

async function createTestItems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // First, create a test user if it doesn't exist
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      });
      await testUser.save();
      console.log('Created test user');
    }

    // Create test items
    const testItems = [
      {
        name: 'Blue Denim Jacket',
        category: 'Outerwear',
        size: 'M',
        condition: 'Excellent',
        description: 'A stylish blue denim jacket in excellent condition. Perfect for casual wear.',
        brand: 'Levi\'s',
        color: 'Blue',
        material: 'Denim',
        images: ['https://via.placeholder.com/400x500/0066cc/ffffff?text=Blue+Jacket'],
        user: testUser._id,
        location: 'New York',
        status: 'pending',
        isActive: true
      },
      {
        name: 'Black Leather Bag',
        category: 'Accessories',
        size: 'One Size',
        condition: 'Like New',
        description: 'A beautiful black leather bag that looks brand new. Great for everyday use.',
        brand: 'Coach',
        color: 'Black',
        material: 'Leather',
        images: ['https://via.placeholder.com/400x500/000000/ffffff?text=Black+Bag'],
        user: testUser._id,
        location: 'New York',
        status: 'pending',
        isActive: true
      },
      {
        name: 'Red Summer Dress',
        category: 'Dresses',
        size: 'S',
        condition: 'Good',
        description: 'A lovely red summer dress in good condition. Perfect for warm weather.',
        brand: 'H&M',
        color: 'Red',
        material: 'Cotton',
        images: ['https://via.placeholder.com/400x500/cc0000/ffffff?text=Red+Dress'],
        user: testUser._id,
        location: 'New York',
        status: 'pending',
        isActive: true
      },
      {
        name: 'White Sneakers',
        category: 'Shoes',
        size: '8',
        condition: 'Excellent',
        description: 'Clean white sneakers in excellent condition. Very comfortable.',
        brand: 'Nike',
        color: 'White',
        material: 'Canvas',
        images: ['https://via.placeholder.com/400x500/ffffff/000000?text=White+Sneakers'],
        user: testUser._id,
        location: 'New York',
        status: 'pending',
        isActive: true
      }
    ];

    console.log('Creating test items...');
    for (const itemData of testItems) {
      const item = new Item(itemData);
      await item.save();
      console.log(`Created: ${item.name}`);
    }

    console.log('\nTest items created successfully!');
    console.log('You can now:');
    console.log('1. Go to the admin panel and approve these items');
    console.log('2. Create swap requests between them');
    console.log('3. Test the swap approval functionality');

  } catch (error) {
    console.error('Error creating test items:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createTestItems(); 