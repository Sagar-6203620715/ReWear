const mongoose = require('mongoose');
const Item = require('../models/Item');
const User = require('../models/Users');

const checkData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/course-comparator');
    console.log('Connected to MongoDB');

    // Check items
    const items = await Item.find({}, '_id name status isActive user');
    console.log('\n=== ITEMS ===');
    items.forEach(item => {
      console.log(`ID: ${item._id}`);
      console.log(`Name: ${item.name}`);
      console.log(`Status: ${item.status}`);
      console.log(`Active: ${item.isActive}`);
      console.log(`User: ${item.user}`);
      console.log('---');
    });

    // Check users
    const users = await User.find({}, '_id name email role');
    console.log('\n=== USERS ===');
    users.forEach(user => {
      console.log(`ID: ${user._id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log('---');
    });

    // Check for admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log('\n=== ADMIN USERS ===');
    if (adminUsers.length === 0) {
      console.log('No admin users found!');
      console.log('You need to create an admin user to access the admin panel.');
    } else {
      adminUsers.forEach(user => {
        console.log(`Admin: ${user.name} (${user.email})`);
      });
    }

    // Check item status distribution
    const statusCounts = await Item.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('\n=== ITEM STATUS DISTRIBUTION ===');
    statusCounts.forEach(status => {
      console.log(`${status._id}: ${status.count} items`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error checking data:', error);
    await mongoose.connection.close();
  }
};

checkData(); 