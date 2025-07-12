const mongoose = require('mongoose');
const User = require('../models/Users');
require('dotenv').config();

const testPoints = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get a test user
    const testUser = await User.findOne({ email: 'hero@example.com' });
    if (!testUser) {
      console.log('Test user not found, creating one...');
      const newUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        points: 100
      });
      await newUser.save();
      console.log('Created test user with 100 points');
    } else {
      console.log(`Test user found: ${testUser.name} (${testUser.email})`);
      console.log(`Current points: ${testUser.points}`);
    }

    // Display all users and their points
    const allUsers = await User.find({}, 'name email points');
    console.log('\nAll users and their points:');
    allUsers.forEach(user => {
      console.log(`${user.name} (${user.email}): ${user.points} points`);
    });

    console.log('\nPoints system test completed!');
  } catch (error) {
    console.error('Error testing points:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the test
testPoints(); 