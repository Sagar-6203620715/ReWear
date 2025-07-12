const mongoose = require('mongoose');
const User = require('../models/Users');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Sarah M.',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'customer'
  },
  {
    name: 'Mike R.',
    email: 'mike@example.com',
    password: 'password123',
    role: 'customer'
  },
  {
    name: 'Emma L.',
    email: 'emma@example.com',
    password: 'password123',
    role: 'customer'
  }
];

mongoose.connect('mongodb://localhost:27017/rewear')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          console.log(`User ${userData.email} already exists, skipping...`);
          continue;
        }
        
        // Create new user
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${userData.name} (${userData.email})`);
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error.message);
      }
    }
    
    console.log('\nAll users created successfully!');
  })
  .catch(err => {
    console.error('Error:', err);
  })
  .finally(() => {
    mongoose.disconnect();
  }); 