#!/usr/bin/env node

import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const setupAdmin = async () => {
  console.log('🔧 ShreeWeb Admin Setup');
  console.log('========================');
  console.log('This script will help you set up admin credentials for ShreeWeb CMS.\n');

  try {
    // Get admin details
    const username = await question('Enter admin username: ');
    const email = await question('Enter admin email: ');
    let password = await question('Enter admin password (min 8 chars): ');

    // Validate inputs
    if (!username || username.length < 3) {
      console.log('❌ Username must be at least 3 characters long');
      process.exit(1);
    }

    if (!email || !email.includes('@')) {
      console.log('❌ Please enter a valid email address');
      process.exit(1);
    }

    if (!password || password.length < 8) {
      console.log('❌ Password must be at least 8 characters long');
      process.exit(1);
    }

    // Check if .env exists
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Remove existing ShreeWeb admin variables if they exist
    envContent = envContent.replace(/SHREEWEB_ADMIN_USERNAME=.*\n?/g, '');
    envContent = envContent.replace(/SHREEWEB_ADMIN_EMAIL=.*\n?/g, '');
    envContent = envContent.replace(/SHREEWEB_ADMIN_PASSWORD=.*\n?/g, '');

    // Add new variables
    const newVars = `
# ShreeWeb Admin Credentials
SHREEWEB_ADMIN_USERNAME=${username}
SHREEWEB_ADMIN_EMAIL=${email}
SHREEWEB_ADMIN_PASSWORD=${password}
`;

    envContent += newVars;

    // Write to .env file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Environment variables added to .env file');
    console.log('📝 You can now run: node scripts/seedShreeWebAdmin.js');
    console.log('🌐 Then access CMS at: http://localhost:5173/shreeweb/cms-loginonly');
    console.log('\n⚠️  Keep your credentials secure and never commit .env to version control!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
};

setupAdmin();