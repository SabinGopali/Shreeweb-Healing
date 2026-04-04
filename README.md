# Vite React + Node.js Backend - ShreeWeb Healing

## Project Structure
```
├── frontend/          # Vite + React app
│   ├── src/
│   │   ├── shreeweb/  # ShreeWeb pages & components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── backend/           # Node.js + Express + MongoDB API
    ├── controllers/   # Route controllers
    ├── models/        # MongoDB models
    ├── routes/        # API routes
    ├── scripts/       # Utility scripts
    ├── config/        # Configuration files
    ├── index.js       # Main server file
    └── package.json
```

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

## Installation

### 1. Backend Setup
```bash
cd backend
npm install
```

### 2. Configure Environment
Create a `.env` file in the backend folder:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shreeweb
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

## Running the App

### Test MongoDB Connection First (Important!)
```bash
cd backend
npm run test-connection
```

If the test fails, see `backend/QUICK_FIX.md` for solutions.

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Server runs on http://localhost:3000

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173

## API Routes
All backend routes are prefixed with `/backend`:
- `/backend/shreeweb-auth` - Authentication
- `/backend/shreeweb-hero` - Hero section
- `/backend/shreeweb-offerings` - Offerings
- `/backend/shreeweb-cms` - CMS operations
- And more...

## Proxy Configuration
Frontend automatically proxies:
- `/api/*` → `http://localhost:3000`
- `/backend/*` → `http://localhost:3000`

## Useful Scripts

### Backend
```bash
npm run dev              # Start with hot reload
npm start                # Start production
npm run setup-shreeweb-admin  # Setup admin user
npm run create-test-admin     # Create test admin
```
