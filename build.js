const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting ReWear monorepo build...');

try {
  // Install dependencies
  console.log('📦 Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('📦 Installing backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit', shell: true });
  
  console.log('📦 Installing frontend dependencies...');
  execSync('cd frontend && npm install', { stdio: 'inherit', shell: true });
  
  // Build frontend
  console.log('🔨 Building frontend...');
  execSync('cd frontend && npm run build', { stdio: 'inherit', shell: true });
  
  // Copy dist folder to root
  console.log('📁 Copying dist folder to root...');
  const frontendDist = path.join(__dirname, 'frontend', 'dist');
  const rootDist = path.join(__dirname, 'dist');
  
  if (fs.existsSync(rootDist)) {
    fs.rmSync(rootDist, { recursive: true });
  }
  
  if (fs.existsSync(frontendDist)) {
    fs.cpSync(frontendDist, rootDist, { recursive: true });
    console.log('✅ Dist folder copied successfully!');
  } else {
    console.error('❌ Frontend dist folder not found!');
    process.exit(1);
  }
  
  console.log('🎉 Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
