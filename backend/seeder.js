const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("./models/Course");
const User = require("./models/Users");
const courses = require("./data/course");
const Section = require("./models/Section");
const Domain = require("./models/Domain");
const sectionData = require("./data/section");
const domainData = require("./data/domain");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    // Clear existing data
    await Course.deleteMany();
    await User.deleteMany();
    await Domain.deleteMany();
    await Section.deleteMany();

    // Insert sections
    const insertedSections = await Section.insertMany(sectionData);

    // Map section name to _id
    const sectionMap = {};
    insertedSections.forEach((section) => {
      sectionMap[section.name] = section._id;
    });

    // Replace section name in domainData with actual ObjectId
    const updatedDomains = domainData.map((domain) => ({
      ...domain,
      section: sectionMap[domain.sectionName], // make sure your domainData uses sectionName
    }));

    // Insert domains
    const insertedDomains = await Domain.insertMany(updatedDomains);

    // Map domain name to _id
    const domainMap = {};
    insertedDomains.forEach((domain) => {
      domainMap[domain.name] = domain._id;
    });

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    // Prepare sample courses with actual IDs
    const sampleCourses = courses.map((course) => ({
      ...course,
      domain: domainMap[course.domainName],     // use domainName in course data
      section: sectionMap[course.sectionName],  // use sectionName in course data
      user: adminUser._id,
    }));

    // Insert courses
    await Course.insertMany(sampleCourses);

    console.log("✅ Data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding the data", error);
    process.exit(1);
  }
};

seedData();
