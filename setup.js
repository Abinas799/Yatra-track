#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 YatraTrack Setup Script');
console.log('==========================\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`📦 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    return false;
  }
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 14) {
    log('❌ Node.js version 14 or higher is required', 'red');
    log(`Current version: ${nodeVersion}`, 'yellow');
    process.exit(1);
  }
  
  log(`✅ Node.js version check passed: ${nodeVersion}`, 'green');
}

function createEnvFile() {
  const envPath = path.join(__dirname, 'server', '.env');
  const envExamplePath = path.join(__dirname, 'server', 'env.example');
  
  if (fs.existsSync(envPath)) {
    log('⚠️  .env file already exists, skipping creation', 'yellow');
    return true;
  }
  
  if (!fs.existsSync(envExamplePath)) {
    log('❌ env.example file not found', 'red');
    return false;
  }
  
  try {
    fs.copyFileSync(envExamplePath, envPath);
    log('✅ .env file created from template', 'green');
    log('⚠️  Please update the .env file with your database credentials', 'yellow');
    return true;
  } catch (error) {
    log(`❌ Failed to create .env file: ${error.message}`, 'red');
    return false;
  }
}

function installDependencies() {
  log('\n📦 Installing dependencies...', 'blue');
  
  // Install root dependencies
  if (!runCommand('npm install', 'Installing root dependencies')) {
    return false;
  }
  
  // Install server dependencies
  if (!runCommand('cd server && npm install', 'Installing server dependencies')) {
    return false;
  }
  
  // Install client dependencies
  if (!runCommand('cd ../client && npm install', 'Installing client dependencies')) {
    return false;
  }
  
  // Return to root
  process.chdir(__dirname);
  
  return true;
}

function displayNextSteps() {
  log('\n🎉 Setup completed successfully!', 'green');
  log('\n📋 Next steps:', 'blue');
  log('1. Update server/.env with your database credentials', 'yellow');
  log('2. Create a MySQL database named "yatra_track"', 'yellow');
  log('3. Start the application:', 'yellow');
  log('   npm run dev', 'green');
  log('\n🌐 The application will be available at:', 'blue');
  log('   Frontend: http://localhost:3000', 'green');
  log('   Backend:  http://localhost:5000', 'green');
  log('\n📚 For more information, see README.md', 'blue');
}

function main() {
  try {
    log('🔍 Checking prerequisites...', 'blue');
    checkNodeVersion();
    
    log('\n📁 Creating environment file...', 'blue');
    createEnvFile();
    
    log('\n📦 Installing dependencies...', 'blue');
    if (!installDependencies()) {
      log('\n❌ Setup failed. Please check the errors above.', 'red');
      process.exit(1);
    }
    
    displayNextSteps();
    
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the setup
main(); 