const mongoose = require('mongoose');
const User = require('../models/Users');
const Item = require('../models/Item');

mongoose.connect('mongodb://localhost:27017/rewear')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Get all users
    const users = await User.find({}, 'name email _id');
    console.log('\nUsers in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}): ${user._id}`);
    });
    
    // Get all items
    const items = await Item.find({}, 'name user status isActive');
    console.log('\nItems in database:');
    items.forEach(item => {
      console.log(`- ${item.name}: User=${item.user}, Status=${item.status}, Active=${item.isActive}`);
    });
    
    // Test fetching items for a specific user
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\nTesting items for user: ${testUser.name} (${testUser._id})`);
      
      const userItems = await Item.find({
        user: testUser._id,
        isActive: true
      });
      
      console.log(`Found ${userItems.length} items for this user:`);
      userItems.forEach(item => {
        console.log(`  - ${item.name}: Status=${item.status}, Active=${item.isActive}`);
      });
      
      // Filter for available items
      const availableItems = userItems.filter(item => 
        item.isActive && ['approved', 'available'].includes(item.status)
      );
      
      console.log(`\nAvailable items for swap: ${availableItems.length}`);
      availableItems.forEach(item => {
        console.log(`  - ${item.name}: Status=${item.status}`);
      });
    }
    
  })
  .catch(err => {
    console.error('Error:', err);
  })
  .finally(() => {
    mongoose.disconnect();
  }); 