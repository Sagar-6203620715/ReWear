const mongoose = require('mongoose');
const User = require('../models/Users');

const createAdmin = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/course-comparator');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@rewear.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@rewear.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      profile: {
        bio: 'System Administrator',
        location: 'System'
      }
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@rewear.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    await mongoose.connection.close();
  }
};

createAdmin(); 