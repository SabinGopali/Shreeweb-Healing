import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from Backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MongoDB URI not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Cleanup script to remove buttonText and buttonLink fields from existing offerings
const cleanupOfferingsFields = async () => {
  try {
    await connectDB();

    // Remove buttonText and buttonLink fields from all documents
    const result = await mongoose.connection.db.collection('shreewebofferings').updateMany(
      {},
      {
        $unset: {
          buttonText: "",
          buttonLink: ""
        }
      }
    );

    console.log(`✅ Cleanup completed! Modified ${result.modifiedCount} offerings`);
    
    // Verify the cleanup
    const sampleDoc = await mongoose.connection.db.collection('shreewebofferings').findOne({});
    if (sampleDoc) {
      console.log('📋 Sample document after cleanup:');
      console.log('- Has buttonText:', 'buttonText' in sampleDoc);
      console.log('- Has buttonLink:', 'buttonLink' in sampleDoc);
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the cleanup
cleanupOfferingsFields();