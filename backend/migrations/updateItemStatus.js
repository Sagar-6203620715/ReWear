const mongoose = require('mongoose');
const Item = require('../models/Item');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rewear';

async function updateItemStatus() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all items that don't have a proper status
    const itemsToUpdate = await Item.find({
      $or: [
        { status: { $exists: false } },
        { status: null },
        { status: '' }
      ]
    });

    console.log(`Found ${itemsToUpdate.length} items without proper status`);

    // Update items to have 'available' status (legacy items)
    if (itemsToUpdate.length > 0) {
      const result = await Item.updateMany(
        {
          $or: [
            { status: { $exists: false } },
            { status: null },
            { status: '' }
          ]
        },
        { 
          $set: { 
            status: 'available',
            isActive: true
          } 
        }
      );

      console.log(`Updated ${result.modifiedCount} items to 'available' status`);
    }

    // Also update any items with 'available' status to 'approved' for immediate visibility
    const availableItemsToUpdate = await Item.find({ status: 'available' });
    console.log(`Found ${availableItemsToUpdate.length} items with 'available' status`);

    if (availableItemsToUpdate.length > 0) {
      const result = await Item.updateMany(
        { status: 'available' },
        { $set: { status: 'approved' } }
      );

      console.log(`Updated ${result.modifiedCount} items from 'available' to 'approved' status`);
    }

    // Get final counts
    const totalItems = await Item.countDocuments();
    const approvedItems = await Item.countDocuments({ status: 'approved' });
    const pendingItems = await Item.countDocuments({ status: 'pending' });
    const finalAvailableItems = await Item.countDocuments({ status: 'available' });

    console.log('\nFinal Item Status Counts:');
    console.log(`Total Items: ${totalItems}`);
    console.log(`Approved Items: ${approvedItems}`);
    console.log(`Pending Items: ${pendingItems}`);
    console.log(`Available Items: ${finalAvailableItems}`);

    console.log('\nMigration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
updateItemStatus(); 