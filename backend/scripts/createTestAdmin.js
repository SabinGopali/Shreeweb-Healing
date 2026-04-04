import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ShreeWebAdmin from '../models/ShreeWebAdmin.model.js';
import { connectMongo } from '../utils/connectMongo.js';

dotenv.config();

const createTestAdmin = async () => {
  try {
    await connectMongo();
    console.log('Connected to MongoDB');

    // Delete any existing admin users (for testing purposes)
    await ShreeWebAdmin.deleteMany({});
    console.log('Cleared existing admin users');

    // Create a test admin user
    const testAdmin = new ShreeWebAdmin({
      username: 'testadmin',
      email: 'test@admin.com',
      password: 'testpass123', // This will be hashed automatically
      role: 'super_admin',
      isActive: true,
      profile: {
        firstName: 'Test',
        lastName: 'Admin'
      },
      permissions: {
        canManageContent: true,
        canManageUsers: true,
        canManageSettings: true,
        canViewAnalytics: true
      }
    });

    await testAdmin.save();
    console.log('✅ Test admin created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('Username: testadmin');
    console.log('Email: test@admin.com');
    console.log('Password: testpass123');
    console.log('');
    console.log('🌐 Access CMS at: http://localhost:5173/shreeweb/cms-loginonly');
    console.log('');
    console.log('⚠️  This is for testing only. Delete this user in production!');

  } catch (error) {
    console.error('Error creating test admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestAdmin();