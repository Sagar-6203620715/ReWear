const mongoose = require('mongoose');
const Item = require('./models/Item');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rewear';

async function approveItems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all pending items
    const pendingItems = await Item.find({ status: 'pending' });
    console.log(`Found ${pendingItems.length} pending items`);

    if (pendingItems.length > 0) {
      console.log('Pending items:');
      pendingItems.forEach(item => {
        console.log(`- ${item.name} (ID: ${item._id})`);
      });

      // Approve all pending items (set status to 'listed')
      const result = await Item.updateMany(
        { status: 'pending' },
        { 
          $set: { 
            status: 'listed',
            isActive: true
          } 
        }
      );

      console.log(`\nSuccessfully approved ${result.modifiedCount} items`);
      console.log('Items are now "listed" and should be visible on the home page');
    } else {
      console.log('No pending items found');
    }

    // Check final status
    const listedItems = await Item.find({ status: 'listed' });
    console.log(`\nTotal listed items: ${listedItems.length}`);
    listedItems.forEach(item => {
      console.log(`- ${item.name} | Status: ${item.status} | Active: ${item.isActive}`);
    });

  } catch (error) {
    console.error('Error approving items:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
approveItems(); 