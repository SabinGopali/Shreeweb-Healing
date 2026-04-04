import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import ShreeWebAdmin from '../models/ShreeWebAdmin.model.js';
import { connectMongo } from '../utils/connectMongo.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const testLogin = async () => {
  try {
    await connectMongo();
    console.log('Connected to MongoDB');

    // Get credentials to test
    const username = await question('Enter username or email to test: ');
    const password = await question('Enter password to test: ');

    console.log('\n=== TESTING LOGIN ===');

    // Find admin by username or email
    const admin = await ShreeWebAdmin.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    });

    if (!admin) {
      console.log('❌ Admin not found in ShreeWebAdmin collection');
      
      // Try main User collection
      const { default: User } = await import('../models/user.model.js');
      const user = await User.findOne({
        $or: [
          { username: username.toLowerCase() },
          { email: username.toLowerCase() }
        ]
      });

      if (!user) {
        console.log('❌ User not found in main User collection either');
        console.log('');
        console.log('Available ShreeWeb admins:');
        const allAdmins = await ShreeWebAdmin.find({}).select('username email role isActive');
        allAdmins.forEach(a => {
          console.log(`  - Username: ${a.username}, Email: ${a.email}, Role: ${a.role}, Active: ${a.isActive}`);
        });
        
        console.log('');
        console.log('Available main system admins:');
        const allUsers = await User.find({ 
          $or: [
            { isAdmin: true },
            { role: 'admin' },
            { role: 'superadmin' }
          ]
        }).select('username email role isAdmin');
        allUsers.forEach(u => {
          console.log(`  - Username: ${u.username}, Email: ${u.email}, Role: ${u.role}, IsAdmin: ${u.isAdmin}`);
        });
        return;
      }

      if (!user.isAdmin && user.role !== 'admin' && user.role !== 'superadmin') {
        console.log('❌ User found but does not have admin privileges');
        console.log(`   Role: ${user.role}, IsAdmin: ${user.isAdmin}`);
        return;
      }

      console.log('✅ Admin user found in main User collection:');
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   IsAdmin: ${user.isAdmin}`);

      // Verify password for main User
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      
      if (!isPasswordValid) {
        console.log('❌ Password is incorrect');
        return;
      }

      console.log('✅ Login test successful for main User!');
      console.log('   All checks passed - this user should be able to login to ShreeWeb CMS');
      return;
    }

    console.log('✅ ShreeWeb Admin found:');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Active: ${admin.isActive}`);
    console.log(`   Locked: ${admin.isLocked}`);
    console.log(`   Login Attempts: ${admin.loginAttempts || 0}`);

    // Check if user has valid admin role
    if (!admin.role || !['admin', 'super_admin'].includes(admin.role)) {
      console.log('❌ Invalid role. Must be admin or super_admin');
      return;
    }

    // Check if account is locked
    if (admin.isLocked) {
      console.log('❌ Account is locked');
      return;
    }

    // Check if account is active
    if (!admin.isActive) {
      console.log('❌ Account is not active');
      return;
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ Password is incorrect');
      return;
    }

    console.log('✅ Login test successful for ShreeWeb Admin!');
    console.log('   All checks passed - this user should be able to login');

  } catch (error) {
    console.error('Error testing login:', error);
  } finally {
    rl.close();
    mongoose.connection.close();
  }
};

testLogin();