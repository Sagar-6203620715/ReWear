const mongoose = require('mongoose');
const User = require('../models/Users');
require('dotenv').config();

const updateUserPoints = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update all users to have 100 points if they don't have points set
    const result = await User.updateMany(
      { points: { $exists: false } },
      { $set: { points: 100 } }
    );

    console.log(`Updated ${result.modifiedCount} users with 100 points`);

    // Also update users who have 0 points to 100
    const zeroPointsResult = await User.updateMany(
      { points: 0 },
      { $set: { points: 100 } }
    );

    console.log(`Updated ${zeroPointsResult.modifiedCount} users from 0 to 100 points`);

    // Display current user points
    const users = await User.find({}, 'name email points');
    console.log('\nCurrent user points:');
    users.forEach(user => {
      console.log(`${user.name} (${user.email}): ${user.points} points`);
    });

    console.log('\nPoints update completed successfully!');
  } catch (error) {
    console.error('Error updating user points:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
updateUserPoints(); 