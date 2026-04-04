import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check both MONGO and MONGODB_URI
    const mongoUri = process.env.MONGO;
    
    console.log('Checking environment variables...');
    console.log('- MONGO:', process.env.MONGO ? 'SET ✓' : 'NOT SET ✗');
    console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'SET ✓' : 'NOT SET ✗');
    
    if (!mongoUri) {
      console.error('\n✗ MongoDB URI is not defined in environment variables');
      console.error('✗ Please check that backend/.env file exists and contains MONGO or MONGODB_URI');
      console.error('✗ Current working directory:', process.cwd());
      process.exit(1);
    }

    // Connection options to fix warnings and improve reliability
    const options = {
      autoIndex: false, // Disable auto-indexing to prevent duplicate index warnings
      serverSelectionTimeoutMS: 30000, // Timeout after 30s (increased for slow networks)
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 30000, // Connection timeout 30s
    };

    console.log('\nAttempting to connect to MongoDB...');
    console.log('Connection string:', mongoUri.substring(0, 40) + '...\n');
    
    const conn = await mongoose.connect(mongoUri, options);
    
    console.log('✓ MongoDB Connected Successfully!');
    console.log('✓ Host:', conn.connection.host);
    console.log('✓ Database:', conn.connection.name);
    console.log('✓ Connection state:', conn.connection.readyState);
    console.log('');
  } catch (error) {
    console.error('\n✗ MongoDB Connection Error:');
    console.error('Message:', error.message);
    console.error('Code:', error.code || 'N/A');
    
    // Provide helpful debugging information
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n✗ Connection Refused - Possible causes:');
      console.error('  1. MongoDB server is not running');
      console.error('  2. Incorrect host or port in connection string');
      console.error('  3. Firewall blocking the connection');
    } else if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('querySrv ESERVFAIL')) {
      console.error('\n✗ MongoDB Atlas SRV Connection Issue:');
      console.error('  1. Check your internet connection');
      console.error('  2. Whitelist your IP in MongoDB Atlas Network Access');
      console.error('  3. Verify the connection string is correct');
      console.error('  4. Try using standard connection string instead of SRV');
      console.error('\n  To whitelist IP: MongoDB Atlas → Network Access → Add IP Address');
    } else if (error.message.includes('Authentication failed')) {
      console.error('\n✗ Authentication Issue:');
      console.error('  1. Check username and password in connection string');
      console.error('  2. Ensure special characters in password are URL-encoded');
      console.error('  3. Verify database user has correct permissions');
    }
    
    console.error('\nSee backend/QUICK_FIX.md for detailed solutions\n');
    process.exit(1);
  }
};

export default connectDB;
