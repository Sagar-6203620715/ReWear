const mongoose = require('mongoose');
const Item = require('../models/Item');
const User = require('../models/Users');

const createTestItemsForModeration = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/course-comparator');
    console.log('Connected to MongoDB');

    // Get existing users
    const users = await User.find({ role: 'customer' });
    if (users.length === 0) {
      console.log('No customer users found. Creating test users first...');
      await mongoose.connection.close();
      return;
    }

    const user1 = users[0]; // First customer user

    // Create items with different statuses for testing
    const testItems = [
      {
        name: 'Pending Review T-Shirt',
        description: 'This item is pending admin review',
        category: 'Tops',
        size: 'M',
        condition: 'Good',
        brand: 'Nike',
        material: 'Cotton',
        color: 'White',
        images: ['https://picsum.photos/seed/pending1/400/500'],
        user: user1._id,
        status: 'pending',
        isActive: true
      },
      {
        name: 'Flagged Inappropriate Item',
        description: 'This item has been flagged for review',
        category: 'Tops',
        size: 'L',
        condition: 'Fair',
        brand: 'Generic',
        material: 'Polyester',
        color: 'Black',
        images: ['https://picsum.photos/seed/flagged1/400/500'],
        user: user1._id,
        status: 'flagged',
        isActive: true,
        flagReason: 'Inappropriate content reported by user'
      },
      {
        name: 'Rejected Item',
        description: 'This item was rejected by admin',
        category: 'Bottoms',
        size: 'S',
        condition: 'Fair',
        brand: 'Unknown',
        material: 'Denim',
        color: 'Blue',
        images: ['https://picsum.photos/seed/rejected1/400/500'],
        user: user1._id,
        status: 'rejected',
        isActive: false,
        rejectionReason: 'Item does not meet community guidelines'
      },
      {
        name: 'Another Pending Item',
        description: 'Another item waiting for admin review',
        category: 'Dresses',
        size: 'M',
        condition: 'Excellent',
        brand: 'H&M',
        material: 'Cotton',
        color: 'Red',
        images: ['https://picsum.photos/seed/pending2/400/500'],
        user: user1._id,
        status: 'pending',
        isActive: true
      }
    ];

    // Create the test items
    for (const itemData of testItems) {
      const existingItem = await Item.findOne({ name: itemData.name });
      if (!existingItem) {
        await Item.create(itemData);
        console.log(`Created ${itemData.status} item: ${itemData.name}`);
      } else {
        console.log(`Item already exists: ${itemData.name}`);
      }
    }

    console.log('\nTest items created for moderation testing!');
    console.log('You can now test the admin panel with:');
    console.log('Email: admin@rewear.com');
    console.log('Password: admin123');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating test items:', error);
    await mongoose.connection.close();
  }
};

createTestItemsForModeration(); 