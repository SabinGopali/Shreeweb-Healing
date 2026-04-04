import mongoose from 'mongoose';

export const connectMongo = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO;
    
    if (!mongoUri) {
      console.error('MongoDB URI is not defined in environment variables');
      console.error('Please set MONGODB_URI or MONGO in your .env file');
      process.exit(1);
    }

    // Connection options to fix warnings and improve reliability
    const options = {
      autoIndex: false, // Disable auto-indexing to prevent duplicate index warnings
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('✗ MongoDB Connection Error:');
    console.error(`  ${error.message}`);
    
    if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('querySrv ESERVFAIL')) {
      console.error('\nMongoDB Atlas SRV Connection Issue:');
      console.error('  1. Check your internet connection');
      console.error('  2. Verify the connection string is correct');
      console.error('  3. Ensure your IP is whitelisted in MongoDB Atlas');
      console.error('  4. Try using standard connection string instead of SRV');
    }
    
    process.exit(1);
  }
};
