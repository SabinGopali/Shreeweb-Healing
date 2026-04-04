# MongoDB Atlas Connection Troubleshooting Guide

## Fixed Issues

### 1. Duplicate Index Warnings
**Solution:** Added `autoIndex: false` to connection options in `config/db.js` and `utils/connectMongo.js`

This prevents Mongoose from automatically creating indexes that may already exist, eliminating duplicate index warnings.

### 2. Connection String Format
**Fixed:** Added database name to connection string
```
Before: mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
After:  mongodb+srv://user:pass@cluster.mongodb.net/shreeweb?retryWrites=true&w=majority&appName=Cluster0
```

## Common Connection Issues & Solutions

### Issue 1: ECONNREFUSED Error
**Symptoms:** `Error: connect ECONNREFUSED`

**Solutions:**
1. Check if MongoDB is running (for local connections)
2. Verify firewall settings
3. Ensure correct port (27017 for local, 27015-27017 for Atlas)

### Issue 2: querySrv ENOTFOUND / ESERVFAIL
**Symptoms:** `querySrv ENOTFOUND _mongodb._tcp.cluster0.xxxxx.mongodb.net`

**Solutions:**

#### A. Whitelist Your IP Address in MongoDB Atlas
1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" in left sidebar
3. Click "Add IP Address"
4. Either:
   - Click "Add Current IP Address" (recommended for development)
   - Or add "0.0.0.0/0" to allow all IPs (NOT recommended for production)
5. Click "Confirm"
6. Wait 1-2 minutes for changes to propagate

#### B. Check DNS Resolution
Test if DNS can resolve your cluster:
```bash
nslookup cluster0.r1hgqus.mongodb.net
```

If this fails, try:
- Restart your router/modem
- Change DNS servers (use Google DNS: 8.8.8.8, 8.8.4.4)
- Check if your ISP blocks MongoDB Atlas

#### C. Use Standard Connection String (Alternative)
If SRV continues to fail, use standard format:
```
MONGO=mongodb://sabingopali22_db_user:badass12345..@cluster0-shard-00-00.r1hgqus.mongodb.net:27017,cluster0-shard-00-01.r1hgqus.mongodb.net:27017,cluster0-shard-00-02.r1hgqus.mongodb.net:27017/shreeweb?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```

Get the standard connection string from:
1. MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Driver: Node.js"
5. Copy the connection string (choose standard, not SRV)

### Issue 3: Authentication Failed
**Symptoms:** `MongoServerError: Authentication failed`

**Solutions:**
1. Verify username and password are correct
2. URL-encode special characters in password:
   ```
   ! → %21    @ → %40    # → %23    $ → %24
   % → %25    ^ → %5E    & → %26    * → %2A
   ```
3. Check database user permissions in Atlas:
   - Go to "Database Access"
   - Ensure user has "Read and write to any database" or specific database access

### Issue 4: Timeout Errors
**Symptoms:** `MongoServerSelectionError: Server selection timed out`

**Solutions:**
1. Increase timeout in connection options (already set to 5000ms)
2. Check internet connection stability
3. Verify MongoDB Atlas cluster is running (not paused)
4. Try connecting from a different network

## Testing Your Connection

### Quick Test Script
Create `backend/test-connection.js`:
```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    const mongoUri = process.env.MONGO || process.env.MONGODB_URI;
    console.log('Testing connection to:', mongoUri.substring(0, 30) + '...');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✓ Connection successful!');
    console.log('✓ Host:', mongoose.connection.host);
    console.log('✓ Database:', mongoose.connection.name);
    
    await mongoose.connection.close();
    console.log('✓ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
```

Run with: `node backend/test-connection.js`

## Current Configuration

Your `.env` file should look like:
```env
PORT=3000
MONGO=mongodb+srv://sabingopali22_db_user:badass12345..@cluster0.r1hgqus.mongodb.net/shreeweb?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=Archphaze
```

## Next Steps

1. **Whitelist your IP** in MongoDB Atlas (most common issue)
2. **Test connection** using the test script above
3. **Check Atlas cluster status** - ensure it's not paused
4. **Verify credentials** - try logging into Atlas with same username/password
5. If all else fails, **create a new database user** with a simple password (no special characters)

## Production Recommendations

1. Use environment-specific connection strings
2. Enable IP whitelisting (don't use 0.0.0.0/0)
3. Use strong, unique passwords
4. Enable MongoDB Atlas monitoring
5. Set up connection pooling
6. Implement retry logic for transient failures
