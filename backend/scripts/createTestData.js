const mongoose = require('mongoose');
const User = require('../models/Users');
const Item = require('../models/Item');

const createTestData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/course-comparator');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer',
      status: 'active',
      profile: {
        bio: 'Fashion enthusiast',
        location: 'New York, NY'
      }
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'customer',
      status: 'active',
      profile: {
        bio: 'Sustainable fashion lover',
        location: 'Los Angeles, CA'
      }
    });

    console.log('Created test users:', user1.name, 'and', user2.name);

    // Create test items for user1
    const item1 = await Item.create({
      name: 'Blue Denim Jacket',
      description: 'Classic blue denim jacket in excellent condition. Perfect for casual wear.',
      category: 'Outerwear',
      size: 'M',
      condition: 'Excellent',
      brand: 'Levi\'s',
      material: 'Denim',
      color: 'Blue',
      images: ['https://picsum.photos/seed/jacket1/400/500'],
      user: user1._id,
      status: 'approved',
      isActive: true
    });

    const item2 = await Item.create({
      name: 'Black T-Shirt',
      description: 'Comfortable black t-shirt made from organic cotton.',
      category: 'Tops',
      size: 'L',
      condition: 'Like New',
      brand: 'Nike',
      material: 'Cotton',
      color: 'Black',
      images: ['https://picsum.photos/seed/tshirt1/400/500'],
      user: user1._id,
      status: 'approved',
      isActive: true
    });

    // Create test items for user2
    const item3 = await Item.create({
      name: 'Red Summer Dress',
      description: 'Beautiful red summer dress perfect for warm weather.',
      category: 'Dresses',
      size: 'S',
      condition: 'Good',
      brand: 'H&M',
      material: 'Polyester',
      color: 'Red',
      images: ['https://picsum.photos/seed/dress1/400/500'],
      user: user2._id,
      status: 'approved',
      isActive: true
    });

    const item4 = await Item.create({
      name: 'White Sneakers',
      description: 'Clean white sneakers in great condition.',
      category: 'Shoes',
      size: 'M',
      condition: 'Excellent',
      brand: 'Adidas',
      material: 'Canvas',
      color: 'White',
      images: ['https://picsum.photos/seed/sneakers1/400/500'],
      user: user2._id,
      status: 'approved',
      isActive: true
    });

    console.log('Created test items:');
    console.log('-', item1.name, '(User:', user1.name, ')');
    console.log('-', item2.name, '(User:', user1.name, ')');
    console.log('-', item3.name, '(User:', user2.name, ')');
    console.log('-', item4.name, '(User:', user2.name, ')');

    console.log('\nTest data created successfully!');
    console.log('\nYou can now test the swap functionality:');
    console.log('1. Login with john@example.com / password123');
    console.log('2. Go to an item by jane@example.com');
    console.log('3. Try to create a swap');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating test data:', error);
    await mongoose.connection.close();
  }
};

createTestData(); 