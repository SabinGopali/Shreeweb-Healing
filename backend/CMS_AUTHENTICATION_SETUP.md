# ShreeWeb CMS Authentication Setup

## Backend Status
✅ Backend server running on: http://localhost:3000
✅ MongoDB connected successfully
✅ Authentication system configured

## Test Admin Account Created

### Login Credentials
- **Username:** `testadmin`
- **Email:** `test@admin.com`
- **Password:** `testpass123`
- **Role:** `super_admin`

### CMS Access
- **Login URL:** http://localhost:5173/shreeweb/cms-login
- **CMS Dashboard:** http://localhost:5173/shreeweb/cms

## Authentication Features

### Security Features
1. **JWT Token Authentication**
   - 7-day token expiration
   - HTTP-only cookies
   - Secure token storage

2. **Account Protection**
   - Password hashing with bcrypt (12 salt rounds)
   - Login attempt tracking
   - Account lockout after 5 failed attempts (2 hours)
   - Account activation status

3. **Role-Based Access Control**
   - `super_admin`: Full access to all features
   - `admin`: Limited access based on permissions

4. **Permissions System**
   - `canManageContent`: Manage CMS content
   - `canManageUsers`: Manage admin users
   - `canManageSettings`: Manage system settings
   - `canViewAnalytics`: View analytics dashboard

## API Endpoints

### Public Endpoints (No Auth Required)
- `POST /backend/shreeweb-auth/register` - Admin registration (⚠️ Temporary)
- `POST /backend/shreeweb-auth/login` - Admin login
- `POST /backend/shreeweb-auth/logout` - Admin logout

### Protected Endpoints (Auth Required)
- `GET /backend/shreeweb-auth/verify` - Verify token validity
- `GET /backend/shreeweb-auth/profile` - Get admin profile
- `PUT /backend/shreeweb-auth/profile` - Update admin profile
- `PUT /backend/shreeweb-auth/change-password` - Change password

### OTP Endpoints (Auth Required)
- `POST /backend/shreeweb-auth/send-email-otp` - Send email OTP
- `POST /backend/shreeweb-auth/verify-email-otp` - Verify email OTP
- `POST /backend/shreeweb-auth/send-password-otp` - Send password reset OTP
- `POST /backend/shreeweb-auth/verify-password-otp` - Verify password reset OTP
- `POST /backend/shreeweb-auth/send-2fa-otp` - Send 2FA OTP
- `POST /backend/shreeweb-auth/verify-2fa-otp` - Verify 2FA OTP

## Testing Authentication

### 1. Test Login
```bash
curl -X POST http://localhost:3000/backend/shreeweb-auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testadmin",
    "password": "testpass123"
  }'
```

### 2. Test Token Verification
```bash
curl -X GET http://localhost:3000/backend/shreeweb-auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Test Profile Access
```bash
curl -X GET http://localhost:3000/backend/shreeweb-auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Creating Additional Admin Users

### Method 1: Using Environment Variables
1. Add to `backend/.env`:
```env
SHREEWEB_ADMIN_USERNAME=newadmin
SHREEWEB_ADMIN_EMAIL=admin@example.com
SHREEWEB_ADMIN_PASSWORD=securepassword123
```

2. Run the seed script:
```bash
cd backend
npm run seed-shreeweb-admin
```

### Method 2: Using MongoDB Directly
Connect to your MongoDB database and insert a new admin document into the `shreewebadmins` collection.

## Security Recommendations

### For Production:
1. **Delete Test Admin**
   ```bash
   cd backend
   node scripts/deleteTestAdmin.js
   ```

2. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols

3. **Enable HTTPS**
   - Set `NODE_ENV=production` in `.env`
   - Use SSL certificates

4. **Configure CORS**
   - Restrict allowed origins
   - Update `CLIENT_URL` in `.env`

5. **Rotate JWT Secret**
   - Change `JWT_SECRET` regularly
   - Use a strong random string

6. **Enable Rate Limiting**
   - Add rate limiting middleware
   - Protect against brute force attacks

## Troubleshooting

### Cannot Login
1. Check if backend is running: http://localhost:3000/api/health
2. Verify admin account exists: `node scripts/checkShreeWebAdmins.js`
3. Check browser console for errors
4. Verify credentials are correct

### Token Expired
- Tokens expire after 7 days
- Login again to get a new token

### Account Locked
- Wait 2 hours for automatic unlock
- Or manually reset in MongoDB

### CORS Errors
- Check `CLIENT_URL` in backend `.env`
- Verify frontend URL matches CORS configuration

## Next Steps

1. ✅ Backend is running
2. ✅ Test admin account created
3. ✅ Authentication system ready
4. 🔄 Start frontend: `cd shreeweb && npm run dev`
5. 🔄 Access CMS: http://localhost:5173/shreeweb/cms-login
6. 🔄 Login with test credentials
7. 🔄 Begin managing content

---

**⚠️ IMPORTANT:** The test admin account is for development only. Delete it before deploying to production!
