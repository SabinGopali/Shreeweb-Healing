import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const mongoUri = process.env.MONGO;

console.log('Testing MongoDB Connection...\n');
console.log('Connection String:', mongoUri.substring(0, 60) + '...\n');

const options = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
};

console.log('Attempting connection (this may take up to 30 seconds)...\n');

try {
  const conn = await mongoose.connect(mongoUri, options);
  console.log('✓ SUCCESS! MongoDB Connected');
  console.log('✓ Host:', conn.connection.host);
  console.log('✓ Database:', conn.connection.name);
  console.log('✓ Ready State:', conn.connection.readyState);
  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.log('✗ FAILED:', error.message);
  console.log('\nPossible issues:');
  console.log('1. Network/Firewall blocking MongoDB Atlas (port 27017)');
  console.log('2. ISP blocking MongoDB connections');
  console.log('3. Cluster is paused in MongoDB Atlas');
  console.log('4. Database user credentials are incorrect');
  console.log('\nTry:');
  console.log('- Check if cluster is active in MongoDB Atlas dashboard');
  console.log('- Try from a different network (mobile hotspot)');
  console.log('- Verify database user password in Atlas');
  process.exit(1);
}
