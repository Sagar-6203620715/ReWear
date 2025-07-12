const mongoose = require('mongoose');
const Item = require('./models/Item');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rewear';

async function removeSwappedItems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all swapped items
    const swappedItems = await Item.find({ status: 'swapped' });
    console.log(`Found ${swappedItems.length} swapped items`);

    if (swappedItems.length > 0) {
      console.log('Swapped items to be removed:');
      swappedItems.forEach(item => {
        console.log(`- ${item.name} (ID: ${item._id})`);
      });

      // Remove all swapped items
      const result = await Item.deleteMany({ status: 'swapped' });
      console.log(`Successfully removed ${result.deletedCount} swapped items`);
    } else {
      console.log('No swapped items found');
    }

    // Also remove any swaps that might be related
    const Swap = require('./models/Swap');
    const swaps = await Swap.find({ status: 'accepted' });
    console.log(`Found ${swaps.length} accepted swaps`);

    if (swaps.length > 0) {
      const swapResult = await Swap.deleteMany({ status: 'accepted' });
      console.log(`Successfully removed ${swapResult.deletedCount} accepted swaps`);
    }

    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the cleanup
removeSwappedItems(); 