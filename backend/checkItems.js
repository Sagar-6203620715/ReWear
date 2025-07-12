const mongoose = require('mongoose');
const Item = require('./models/Item');
const Swap = require('./models/Swap');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rewear';

async function checkItems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check all items and their status
    const allItems = await Item.find({}).populate('user', 'name');
    console.log(`\nTotal items in database: ${allItems.length}`);
    
    console.log('\n=== ITEM STATUS BREAKDOWN ===');
    const statusCounts = {};
    allItems.forEach(item => {
      const status = item.status || 'no-status';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      console.log(`- ${item.name} (ID: ${item._id}) | Status: ${item.status} | Active: ${item.isActive} | User: ${item.user?.name}`);
    });
    
    console.log('\n=== STATUS COUNTS ===');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`${status}: ${count}`);
    });

    // Check all swaps
    const allSwaps = await Swap.find({}).populate([
      { path: 'initiator', select: 'name' },
      { path: 'recipient', select: 'name' },
      { path: 'initiatorItem', select: 'name status' },
      { path: 'recipientItem', select: 'name status' }
    ]);
    
    console.log(`\n=== SWAPS ===`);
    console.log(`Total swaps: ${allSwaps.length}`);
    
    allSwaps.forEach(swap => {
      console.log(`\nSwap ID: ${swap._id}`);
      console.log(`Status: ${swap.status}`);
      console.log(`Initiator: ${swap.initiator?.name} → Recipient: ${swap.recipient?.name}`);
      console.log(`Initiator Item: ${swap.initiatorItem?.name} (Status: ${swap.initiatorItem?.status})`);
      console.log(`Recipient Item: ${swap.recipientItem?.name} (Status: ${swap.recipientItem?.status})`);
      console.log(`Created: ${swap.createdAt}`);
      if (swap.approvedAt) console.log(`Approved: ${swap.approvedAt}`);
    });

    // Check for items that might be part of swaps but have wrong status
    console.log('\n=== ITEMS THAT MIGHT BE SWAPPED ===');
    const itemsInSwaps = [];
    allSwaps.forEach(swap => {
      if (swap.initiatorItem) itemsInSwaps.push(swap.initiatorItem._id.toString());
      if (swap.recipientItem) itemsInSwaps.push(swap.recipientItem._id.toString());
    });
    
    const uniqueItemIds = [...new Set(itemsInSwaps)];
    console.log(`Items involved in swaps: ${uniqueItemIds.length}`);
    
    uniqueItemIds.forEach(itemId => {
      const item = allItems.find(i => i._id.toString() === itemId);
      if (item) {
        console.log(`- ${item.name} | Status: ${item.status} | Active: ${item.isActive}`);
      }
    });

  } catch (error) {
    console.error('Error checking items:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the check
checkItems(); 