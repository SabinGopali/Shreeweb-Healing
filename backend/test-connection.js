import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    const mongoUri = process.env.MONGO || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('✗ No MongoDB URI found in .env file');
      console.error('  Please set MONGO or MONGODB_URI in backend/.env');
      process.exit(1);
    }
    
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', mongoUri.substring(0, 30) + '...');
    console.log('');
    
    const startTime = Date.now();
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    const duration = Date.now() - startTime;
    
    console.log('✓ Connection successful!');
    console.log(`✓ Connected in ${duration}ms`);
    console.log('✓ Host:', mongoose.connection.host);
    console.log('✓ Database:', mongoose.connection.name);
    console.log('✓ Ready state:', mongoose.connection.readyState);
    console.log('');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✓ Found ${collections.length} collections in database`);
    if (collections.length > 0) {
      console.log('  Collections:', collections.map(c => c.name).join(', '));
    }
    
    await mongoose.connection.close();
    console.log('');
    console.log('✓ Connection closed successfully');
    console.log('✓ MongoDB is working correctly!');
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('✗ Connection failed!');
    console.error('✗ Error:', error.message);
    console.error('');
    
    if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('querySrv ESERVFAIL')) {
      console.error('DNS Resolution Issue:');
      console.error('  1. Check your internet connection');
      console.error('  2. Whitelist your IP in MongoDB Atlas Network Access');
      console.error('  3. Verify connection string is correct');
      console.error('  4. Try using standard connection string instead of SRV');
      console.error('');
      console.error('To whitelist your IP:');
      console.error('  → Go to MongoDB Atlas Dashboard');
      console.error('  → Click "Network Access"');
      console.error('  → Click "Add IP Address"');
      console.error('  → Add your current IP or 0.0.0.0/0 (for testing only)');
    } else if (error.message.includes('Authentication failed')) {
      console.error('Authentication Issue:');
      console.error('  1. Check username and password in connection string');
      console.error('  2. Ensure password special characters are URL-encoded');
      console.error('  3. Verify database user exists in MongoDB Atlas');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('Connection Refused:');
      console.error('  1. Check if MongoDB server is running');
      console.error('  2. Verify firewall settings');
      console.error('  3. Ensure correct host and port');
    }
    
    console.error('');
    console.error('See MONGODB_TROUBLESHOOTING.md for detailed solutions');
    process.exit(1);
  }
};

console.log('='.repeat(60));
console.log('MongoDB Connection Test');
console.log('='.repeat(60));
console.log('');

testConnection();
