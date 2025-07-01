const mongoose = require('mongoose');
const User = require('./models/Users');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coursify')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const makeUserAdmin = async (email) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }

    if (user.role === 'admin') {
      console.log(`User ${email} is already an admin`);
      return;
    }

    user.role = 'admin';
    await user.save();
    
    console.log(`Successfully made ${email} an admin`);
  } catch (error) {
    console.error('Error making user admin:', error);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  console.log('Example: node makeAdmin.js admin@example.com');
  process.exit(1);
}

makeUserAdmin(email)
  .then(() => {
    console.log('Operation completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Operation failed:', err);
    process.exit(1);
  }); 