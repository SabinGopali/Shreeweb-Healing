import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ShreeWebAdmin from '../models/ShreeWebAdmin.model.js';
import { connectMongo } from '../utils/connectMongo.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectMongo();
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await ShreeWebAdmin.findOne({ role: 'super_admin' });
    
    if (existingAdmin) {
      console.log('Super admin already exists:', existingAdmin.username);
      process.exit(0);
    }

    // Get admin credentials from environment variables
    const adminUsername = process.env.SHREEWEB_ADMIN_USERNAME;
    const adminEmail = process.env.SHREEWEB_ADMIN_EMAIL;
    const adminPassword = process.env.SHREEWEB_ADMIN_PASSWORD;

    if (!adminUsername || !adminEmail || !adminPassword) {
      console.error('❌ Missing required environment variables:');
      console.error('   SHREEWEB_ADMIN_USERNAME');
      console.error('   SHREEWEB_ADMIN_EMAIL');
      console.error('   SHREEWEB_ADMIN_PASSWORD');
      console.error('');
      console.error('Please set these environment variables before running the seed script.');
      process.exit(1);
    }

    // Validate password strength
    if (adminPassword.length < 8) {
      console.error('❌ Admin password must be at least 8 characters long');
      process.exit(1);
    }

    // Create super admin
    const superAdmin = new ShreeWebAdmin({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword, // This will be hashed automatically
      role: 'super_admin',
      isActive: true,
      profile: {
        firstName: 'ShreeWeb',
        lastName: 'Administrator'
      },
      permissions: {
        canManageContent: true,
        canManageUsers: true,
        canManageSettings: true,
        canViewAnalytics: true
      }
    });

    await superAdmin.save();
    console.log('✅ Super admin created successfully!');
    console.log('Username:', adminUsername);
    console.log('Email:', adminEmail);
    console.log('');
    console.log('⚠️  IMPORTANT: Keep your admin credentials secure!');
    console.log('🔒 Admin access is restricted to users with admin or super_admin roles only.');

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();