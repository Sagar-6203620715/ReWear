const mongoose = require('mongoose');
const Item = require('./models/Item');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rewear';

async function revertToApproved() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all listed items
    const listedItems = await Item.find({ status: 'listed' });
    console.log(`Found ${listedItems.length} listed items`);

    if (listedItems.length > 0) {
      console.log('Listed items to revert:');
      listedItems.forEach(item => {
        console.log(`- ${item.name} (ID: ${item._id})`);
      });

      // Change listed items back to approved
      const result = await Item.updateMany(
        { status: 'listed' },
        { 
          $set: { 
            status: 'approved',
            isActive: true
          } 
        }
      );

      console.log(`\nSuccessfully reverted ${result.modifiedCount} items to approved status`);
      console.log('Items are now "approved" and should be visible on the home page');
    } else {
      console.log('No listed items found');
    }

    // Check final status
    const approvedItems = await Item.find({ status: 'approved' });
    console.log(`\nTotal approved items: ${approvedItems.length}`);
    approvedItems.forEach(item => {
      console.log(`- ${item.name} | Status: ${item.status} | Active: ${item.isActive}`);
    });

  } catch (error) {
    console.error('Error reverting items:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
revertToApproved(); 