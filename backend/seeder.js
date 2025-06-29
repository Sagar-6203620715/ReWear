const mongoose=require("mongoose");
const dotenv=require("dotenv");
const Course=require("./models/Course");
const User=require("./models/Users");
const courses=require("./data/course")
const Section = require("./models/Section");
const Domain = require("./models/Domain");
const sectionData = require("./data/section");
const domainData = require("./data/domain");


dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData=async()=>{
  try{
    await Course.deleteMany();
    await User.deleteMany();
    await Domain.deleteMany();
    await Section.deleteMany();

    // Create sections first
    const insertedSections = await Section.insertMany(sectionData);

    // Add section references to domains
    const sectionId = insertedSections.find(sec => sec.name === "Tech")._id;
    const updatedDomains = domainData.map(domain => ({
      ...domain,
      section: sectionId
    }));

    // Insert domains
    const insertedDomains = await Domain.insertMany(updatedDomains);

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin"
    });

    // Add domain and section references to courses
    const userID = adminUser._id;
    const sampleCourses = courses.map((course) => ({
      ...course,
      domain: new mongoose.Types.ObjectId(course.domain),
      section: new mongoose.Types.ObjectId(course.section),

      user: adminUser._id
    }));

    await Course.insertMany(sampleCourses);
    console.log("Data seeded successfully");
    process.exit();

  }catch(error){
    console.error("error seeding the data",error);
    process.exit();
  }
};

seedData();