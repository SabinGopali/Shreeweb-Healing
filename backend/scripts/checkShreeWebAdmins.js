import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ShreeWebAdmin from '../models/ShreeWebAdmin.model.js';
import { connectMongo } from '../utils/connectMongo.js';

dotenv.config();

const checkAdmins = async () => {
  try {
    await connectMongo();
    console.log('Connected to MongoDB');

    // Find all admin users
    const admins = await ShreeWebAdmin.find({}).select('-password');
    
    console.log('\n=== SHREEWEB ADMIN USERS ===');
    console.log(`Total ShreeWeb admin users found: ${admins.length}`);
    
    if (admins.length === 0) {
      console.log('❌ No ShreeWeb admin users found in the database!');
    } else {
      console.log('');
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ShreeWeb Admin Details:`);
        console.log(`   ID: ${admin._id}`);
        console.log(`   Username: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Active: ${admin.isActive ? '✅ Yes' : '❌ No'}`);
        console.log(`   Locked: ${admin.isLocked ? '🔒 Yes' : '✅ No'}`);
        console.log(`   Login Attempts: ${admin.loginAttempts || 0}`);
        console.log(`   Last Login: ${admin.lastLogin ? admin.lastLogin.toISOString() : 'Never'}`);
        console.log(`   Created: ${admin.createdAt.toISOString()}`);
        console.log('');
      });
    }

    // Also check main User collection for admin users
    const { default: User } = await import('../models/user.model.js');
    const mainAdmins = await User.find({
      $or: [
        { isAdmin: true },
        { role: 'admin' },
        { role: 'superadmin' }
      ]
    }).select('-password');

    console.log('\n=== MAIN SYSTEM ADMIN USERS ===');
    console.log(`Total main system admin users found: ${mainAdmins.length}`);
    
    if (mainAdmins.length === 0) {
      console.log('❌ No main system admin users found!');
    } else {
      console.log('');
      mainAdmins.forEach((user, index) => {
        console.log(`${index + 1}. Main System Admin Details:`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   IsAdmin: ${user.isAdmin ? '✅ Yes' : '❌ No'}`);
        console.log(`   IsSupplier: ${user.isSupplier ? '✅ Yes' : '❌ No'}`);
        console.log(`   Created: ${user.createdAt.toISOString()}`);
        console.log('');
      });
    }

    const totalAdminUsers = admins.length + mainAdmins.length;
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total users who can access ShreeWeb CMS: ${totalAdminUsers}`);
    console.log(`- ShreeWeb dedicated admins: ${admins.length}`);
    console.log(`- Main system admins: ${mainAdmins.length}`);

    if (totalAdminUsers === 0) {
      console.log('');
      console.log('To create an admin user:');
      console.log('1. Set environment variables in .env:');
      console.log('   SHREEWEB_ADMIN_USERNAME=your_username');
      console.log('   SHREEWEB_ADMIN_EMAIL=your_email@domain.com');
      console.log('   SHREEWEB_ADMIN_PASSWORD=your_secure_password');
      console.log('');
      console.log('2. Run: npm run seed-shreeweb-admin');
      console.log('');
      console.log('OR create a test admin: npm run create-test-admin');
    }

    // Check environment variables
    console.log('=== ENVIRONMENT VARIABLES ===');
    const envVars = {
      'SHREEWEB_ADMIN_USERNAME': process.env.SHREEWEB_ADMIN_USERNAME,
      'SHREEWEB_ADMIN_EMAIL': process.env.SHREEWEB_ADMIN_EMAIL,
      'SHREEWEB_ADMIN_PASSWORD': process.env.SHREEWEB_ADMIN_PASSWORD ? '[SET]' : '[NOT SET]'
    };

    Object.entries(envVars).forEach(([key, value]) => {
      console.log(`${key}: ${value || '[NOT SET]'}`);
    });

  } catch (error) {
    console.error('Error checking admins:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkAdmins();