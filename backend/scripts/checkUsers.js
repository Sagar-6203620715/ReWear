const mongoose = require('mongoose');
const User = require('../models/Users');

// Connect to MongoDB using the same connection string as the server
mongoose.connect('mongodb://localhost:27017/rewear')
  .then(() => {
    console.log('Connected to MongoDB');
    return User.find({}, 'name email role');
  })
  .then(users => {
    console.log('\nUsers in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
  })
  .catch(err => {
    console.error('Error:', err);
  })
  .finally(() => {
    mongoose.disconnect();
  }); 