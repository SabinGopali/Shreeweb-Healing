# How to Remove Admin Registration Feature

## ⚠️ IMPORTANT
The admin registration feature is **temporary** and should be removed after you've created your admin accounts.

## Why Remove It?
- Security: Public registration endpoints are a security risk
- Access Control: Only authorized personnel should have admin access
- Production Ready: Production systems should not allow self-registration

## Steps to Remove Registration

### 1. Remove Backend Registration Endpoint

**File:** `backend/routes/shreeWebAuth.route.js`

Remove this line:
```javascript
router.post('/register', register); // Temporary registration endpoint
```

**File:** `backend/controllers/shreeWebAuth.controller.js`

Remove the entire `register` function (lines with the registration logic).

Also remove the import if not used elsewhere:
```javascript
import {
  register,  // <-- Remove this
  login,
  logout,
  // ... rest
} from '../controllers/shreeWebAuth.controller.js';
```

### 2. Remove Frontend Registration Page

**Delete File:** `shreeweb/src/shreeweb/shreeweb/pages/ShreeWebCmsRegister.jsx`

**File:** `shreeweb/src/shreeweb/shreeweb/ShreeWebApp.jsx`

Remove the import:
```javascript
import ShreeWebCmsRegister from './pages/ShreeWebCmsRegister';  // <-- Remove this
```

Remove the route:
```javascript
<Route path="cms-register" element={<ShreeWebCmsRegister />} />  // <-- Remove this
```

### 3. Remove Registration Link from Login Page

**File:** `shreeweb/src/shreeweb/shreeweb/pages/ShreeWebCmsLogin.jsx`

Remove this section:
```javascript
{/* Registration Link */}
<div className="mt-6 text-center">
  <p className="text-sm text-stone-600">
    Don't have an admin account?{' '}
    <Link
      to="/shreeweb/cms-register"
      className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
    >
      Create one here
    </Link>
  </p>
  <p className="text-xs text-stone-500 mt-2">
    ⚠️ Registration is temporary and will be removed after setup
  </p>
</div>
```

### 4. Quick Removal Script

Create a script to automate the removal:

**File:** `backend/scripts/removeRegistration.js`

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔒 Removing admin registration feature...\n');

// 1. Delete frontend registration page
const registerPagePath = path.join(__dirname, '../../shreeweb/src/shreeweb/shreeweb/pages/ShreeWebCmsRegister.jsx');
if (fs.existsSync(registerPagePath)) {
  fs.unlinkSync(registerPagePath);
  console.log('✓ Deleted: ShreeWebCmsRegister.jsx');
} else {
  console.log('⚠ File not found: ShreeWebCmsRegister.jsx');
}

console.log('\n✅ Registration page removed!');
console.log('\n📝 Manual steps remaining:');
console.log('1. Remove registration route from backend/routes/shreeWebAuth.route.js');
console.log('2. Remove register function from backend/controllers/shreeWebAuth.controller.js');
console.log('3. Remove registration import and route from shreeweb/src/shreeweb/shreeweb/ShreeWebApp.jsx');
console.log('4. Remove registration link from shreeweb/src/shreeweb/shreeweb/pages/ShreeWebCmsLogin.jsx');
console.log('\nSee REMOVE_REGISTRATION.md for detailed instructions.');
```

Run with:
```bash
cd backend
node scripts/removeRegistration.js
```

## Alternative: Disable Registration Without Removing Code

If you want to keep the code but disable registration:

### Backend Approach

Add an environment variable check:

**File:** `backend/controllers/shreeWebAuth.controller.js`

```javascript
export const register = async (req, res, next) => {
  // Check if registration is enabled
  if (process.env.ALLOW_ADMIN_REGISTRATION !== 'true') {
    return next(errorHandler(403, 'Admin registration is disabled'));
  }
  
  // ... rest of registration logic
};
```

**File:** `backend/.env`

```env
# Set to 'true' to enable admin registration (development only)
ALLOW_ADMIN_REGISTRATION=false
```

### Frontend Approach

Hide the registration link:

**File:** `shreeweb/src/shreeweb/shreeweb/pages/ShreeWebCmsLogin.jsx`

```javascript
{/* Registration Link - Only show in development */}
{import.meta.env.DEV && (
  <div className="mt-6 text-center">
    {/* ... registration link ... */}
  </div>
)}
```

## Verification

After removal, verify:

1. **Test Registration Endpoint:**
```bash
curl -X POST http://localhost:3000/backend/shreeweb-auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

Should return: `404 Not Found` or `403 Forbidden`

2. **Test Registration Page:**
Visit: http://localhost:5173/shreeweb/cms-register

Should return: `404 Not Found` or redirect

3. **Check Login Page:**
Visit: http://localhost:5173/shreeweb/cms-login

Should NOT show "Create one here" link

## Creating New Admins After Removal

Use the backend script:

```bash
cd backend
node scripts/createTestAdmin.js
```

Or set environment variables and run:

```bash
cd backend
npm run seed-shreeweb-admin
```

## Rollback

If you need to restore registration:

1. Restore from git: `git checkout -- <files>`
2. Or keep a backup of the removed files
3. Or refer to this documentation to recreate

---

**Remember:** Remove registration before deploying to production!
