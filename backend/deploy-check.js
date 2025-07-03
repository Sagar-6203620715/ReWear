#!/usr/bin/env node

const mongoose = require('mongoose');
const Course = require('./models/Course');
const Domain = require('./models/Domain');
const Section = require('./models/Section');

async function checkDeployment() {
  console.log('🔍 Checking deployment configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`- PORT: ${process.env.PORT || '9000 (default)'}`);
  console.log(`- MONGO_URI: ${process.env.MONGO_URI ? '✅ Set' : '❌ Not set'}`);
  console.log(`- FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set'}`);
  console.log(`- ADDITIONAL_FRONTEND_URLS: ${process.env.ADDITIONAL_FRONTEND_URLS || 'not set'}\n`);

  // Check database connection
  if (process.env.MONGO_URI) {
    try {
      console.log('🔌 Testing database connection...');
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Database connection successful\n');

      // Check collections
      console.log('📊 Database Collections:');
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      console.log(`- Collections found: ${collectionNames.join(', ')}\n`);

      // Check data counts
      console.log('📈 Data Counts:');
      const courseCount = await Course.countDocuments();
      const domainCount = await Domain.countDocuments();
      const sectionCount = await Section.countDocuments();
      console.log(`- Courses: ${courseCount}`);
      console.log(`- Domains: ${domainCount}`);
      console.log(`- Sections: ${sectionCount}\n`);

      // Check sample course data
      if (courseCount > 0) {
        console.log('🔍 Sample Course Data:');
        const sampleCourse = await Course.findOne().populate('domain section');
        if (sampleCourse) {
          console.log(`- Name: ${sampleCourse.name}`);
          console.log(`- Price: ₹${sampleCourse.price}`);
          console.log(`- Domain: ${sampleCourse.domain?.name || 'N/A'}`);
          console.log(`- Section: ${sampleCourse.section?.name || 'N/A'}`);
          console.log(`- Affiliate Link: ${sampleCourse.affiliate_link}`);
          console.log(`- Clicks: ${sampleCourse.clicks || 0}`);
          console.log(`- Revenue: $${sampleCourse.revenue || 0}\n`);
        }
      }

      // Check indexes
      console.log('🔍 Checking database indexes...');
      const courseIndexes = await Course.collection.getIndexes();
      console.log(`- Course indexes: ${Object.keys(courseIndexes).length} found`);
      Object.keys(courseIndexes).forEach(indexName => {
        console.log(`  - ${indexName}: ${JSON.stringify(courseIndexes[indexName].key)}`);
      });
      console.log('');

      await mongoose.disconnect();
      console.log('✅ Database check completed\n');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('');
    }
  }

  // Check CORS configuration
  console.log('🌐 CORS Configuration:');
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173', 
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'https://course-comparator.netlify.app',
    'https://your-frontend-domain.netlify.app'
  ];

  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  if (process.env.ADDITIONAL_FRONTEND_URLS) {
    const additionalUrls = process.env.ADDITIONAL_FRONTEND_URLS.split(',').map(url => url.trim());
    allowedOrigins.push(...additionalUrls);
  }

  console.log(`- Allowed origins: ${allowedOrigins.length} configured`);
  allowedOrigins.forEach(origin => {
    console.log(`  - ${origin}`);
  });
  console.log('');

  // Check package.json dependencies
  console.log('📦 Package Dependencies:');
  const packageJson = require('./package.json');
  const criticalDeps = ['express', 'mongoose', 'cors', 'helmet', 'socket.io'];
  criticalDeps.forEach(dep => {
    const version = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
    console.log(`- ${dep}: ${version || '❌ Not found'}`);
  });
  console.log('');

  console.log('✅ Deployment check completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Ensure all environment variables are set in your deployment platform');
  console.log('2. Verify the frontend URL is correctly configured');
  console.log('3. Test the API endpoints after deployment');
  console.log('4. Check CORS headers in browser developer tools');
}

checkDeployment().catch(console.error); 