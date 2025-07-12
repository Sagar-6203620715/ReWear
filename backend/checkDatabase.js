const mongoose = require('mongoose');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rewear';

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    console.log('Database URL:', MONGO_URI);
    console.log('Database name:', mongoose.connection.db.databaseName);

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n=== COLLECTIONS ===');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Check each collection for documents
    console.log('\n=== COLLECTION COUNTS ===');
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`${collection.name}: ${count} documents`);
      
      if (count > 0 && count <= 10) {
        // Show sample documents for small collections
        const sample = await mongoose.connection.db.collection(collection.name).find({}).limit(3).toArray();
        console.log(`  Sample documents:`);
        sample.forEach(doc => {
          console.log(`    - ${JSON.stringify(doc, null, 2)}`);
        });
      }
    }

    // Check if we're connected to the right database
    console.log('\n=== DATABASE INFO ===');
    console.log('Current database:', mongoose.connection.db.databaseName);
    console.log('Connection ready state:', mongoose.connection.readyState);

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the check
checkDatabase(); 