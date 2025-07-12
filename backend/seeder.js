const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/Users");
const Item = require("./models/Item");
const items = require("./data/items");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Item.deleteMany();

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    // Create sample users for items
    const sampleUsers = await User.create([
      {
        name: "Sarah M.",
        email: "sarah@example.com",
        password: "123456",
        role: "customer",
      },
      {
        name: "Emma L.",
        email: "emma@example.com",
        password: "123456",
        role: "customer",
      },
      {
        name: "Mike R.",
        email: "mike@example.com",
        password: "123456",
        role: "customer",
      },
      {
        name: "Alex K.",
        email: "alex@example.com",
        password: "123456",
        role: "customer",
      },
      {
        name: "Jessica P.",
        email: "jessica@example.com",
        password: "123456",
        role: "customer",
      },
      {
        name: "David T.",
        email: "david@example.com",
        password: "123456",
        role: "customer",
      },
      {
        name: "Maria G.",
        email: "maria@example.com",
        password: "123456",
        role: "customer",
      },
      {
        name: "Tom W.",
        email: "tom@example.com",
        password: "123456",
        role: "customer",
      }
    ]);

    // Prepare sample items with user IDs
    const sampleItems = items.map((item, index) => ({
      ...item,
      user: sampleUsers[index % sampleUsers.length]._id,
      status: 'available',
      isActive: true
    }));

    // Insert items
    await Item.insertMany(sampleItems);

    console.log("✅ Data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding the data", error);
    process.exit(1);
  }
};

seedData();
