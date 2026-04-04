import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('=== MongoDB Connection Test ===\n');

// Test 1: Check environment variable
const mongoUri = process.env.MONGO;
console.log('1. Environment Variable Check:');
console.log('   MONGO is set:', mongoUri ? '✓ YES' : '✗ NO');
if (mongoUri) {
  console.log('   Connection type:', mongoUri.includes('mongodb+srv') ? 'SRV (DNS)' : 'Standard');
  console.log('   Host:', mongoUri.match(/@([^/]+)/)?.[1] || 'unknown');
}
console.log('');

// Test 2: Try SRV connection
console.log('2. Testing SRV Connection (mongodb+srv://)...');
const srvUri = process.env.MONGO;

try {
  const conn = await mongoose.connect(srvUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
  });
  console.log('   ✓ SRV Connection SUCCESSFUL!');
  console.log('   Host:', conn.connection.host);
  console.log('   Database:', conn.connection.name);
  await mongoose.disconnect();
  console.log('   ✓ Disconnected successfully\n');
  process.exit(0);
} catch (error) {
  console.log('   ✗ SRV Connection FAILED');
  console.log('   Error:', error.message);
  console.log('');
  
  // Test 3: Try standard connection string
  console.log('3. Trying Standard Connection String...');
  console.log('   Converting SRV to standard format...');
  
  // Convert SRV to standard connection string
  const standardUri = srvUri
    .replace('mongodb+srv://', 'mongodb://')
    .replace('@cluster0.r1hgqus.mongodb.net/', '@cluster0-shard-00-00.r1hgqus.mongodb.net:27017,cluster0-shard-00-01.r1hgqus.mongodb.net:27017,cluster0-shard-00-02.r1hgqus.mongodb.net:27017/')
    .replace('?', '?ssl=true&');
  
  console.log('   Standard URI format created');
  console.log('');
  
  try {
    const conn2 = await mongoose.connect(standardUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
    console.log('   ✓ Standard Connection SUCCESSFUL!');
    console.log('   Host:', conn2.connection.host);
    console.log('   Database:', conn2.connection.name);
    console.log('');
    console.log('SOLUTION: Use this connection string in your .env file:');
    console.log(standardUri.substring(0, 50) + '...');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error2) {
    console.log('   ✗ Standard Connection ALSO FAILED');
    console.log('   Error:', error2.message);
    console.log('');
    
    // Provide troubleshooting steps
    console.log('=== TROUBLESHOOTING STEPS ===\n');
    console.log('1. Check MongoDB Atlas IP Whitelist:');
    console.log('   - Go to: https://cloud.mongodb.com/');
    console.log('   - Navigate to: Network Access → IP Access List');
    console.log('   - Add your current IP or use 0.0.0.0/0 for testing');
    console.log('');
    console.log('2. Verify Database User Credentials:');
    console.log('   - Username: sabingopali22_db_user');
    console.log('   - Check password is correct (special chars may need encoding)');
    console.log('');
    console.log('3. Check Network/Firewall:');
    console.log('   - Disable VPN if using one');
    console.log('   - Check corporate firewall settings');
    console.log('   - Try from a different network');
    console.log('');
    console.log('4. Test DNS Resolution:');
    console.log('   Run: nslookup cluster0.r1hgqus.mongodb.net');
    console.log('');
    process.exit(1);
  }
}
