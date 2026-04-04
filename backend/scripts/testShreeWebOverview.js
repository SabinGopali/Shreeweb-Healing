import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectMongo } from '../utils/connectMongo.js';
import { getOverviewData } from '../controllers/shreeWebOverview.controller.js';

dotenv.config();

// Mock request and response objects
const mockReq = {
  admin: {
    _id: 'test-admin-id',
    username: 'test-admin',
    role: 'admin'
  }
};

const mockRes = {
  status: (code) => ({
    json: (data) => {
      console.log(`Response Status: ${code}`);
      console.log('Response Data:', JSON.stringify(data, null, 2));
      return mockRes;
    }
  })
};

const mockNext = (error) => {
  if (error) {
    console.error('Error:', error);
  }
};

async function testOverviewAPI() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectMongo();
    console.log('✅ Connected to MongoDB');

    console.log('\n🔄 Testing ShreeWeb Overview API...');
    await getOverviewData(mockReq, mockRes, mockNext);

    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

testOverviewAPI();