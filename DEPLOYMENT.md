# Deployment Guide - Inventory Management System

Complete step-by-step guide to deploy the Inventory Management System to production.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Firebase Setup](#firebase-setup)
3. [Local Setup](#local-setup)
4. [Build & Optimization](#build--optimization)
5. [Deployment Steps](#deployment-steps)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)

## Pre-Deployment Checklist

- [ ] Firebase project created
- [ ] Firebase billing enabled (for production use)
- [ ] All team members have Firebase access
- [ ] Database backups configured
- [ ] SSL certificate ready (auto-provided by Firebase)
- [ ] Custom domain (optional but recommended)
- [ ] Admin users created with demo passwords changed
- [ ] All environment variables configured
- [ ] Performance testing completed
- [ ] Security audit done

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "inventory-mall-system")
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Required Services

#### Authentication
```
Firebase Console → Authentication → Sign-in method
```
- Enable "Email/Password"
- Enable "Google Sign-in" (optional)
- Add authorized domains (your domain name)

#### Firestore Database
```
Firebase Console → Firestore Database → Create Database
```
- Location: Select closest to users
- Rules: Use production mode
- Click "Create"

#### Cloud Storage (for product images)
```
Firebase Console → Storage → Create Bucket
```
- Default location: Same as Firestore
- Access rules: Private

#### Cloud Functions
```
Firebase Console → Functions
```
- Runtime: Node.js 18
- Memory: 256 MB
- Timeout: 60 seconds

### Step 3: Get Firebase Credentials

```
Firebase Console → Project Settings → Your Apps → Web
```

Copy the configuration object:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "1:000000000000:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

## Local Setup

### Step 1: Install Dependencies

```bash
cd inventory-mall-app
npm install

# Install Firebase CLI globally
npm install -g firebase-tools
```

### Step 2: Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 3: Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and verify:
- Login functionality works
- Dashboard loads correctly
- Firebase connection is successful
- All pages are accessible

## Build & Optimization

### Step 1: Create Production Build

```bash
npm run build
```

This creates an optimized `dist` folder with:
- Minified JavaScript
- Optimized CSS
- Production source maps (disabled for security)

### Step 2: Verify Build

```bash
npm run preview
```

Test the production build locally:
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Styling is correct
- [ ] Dark mode works
- [ ] Responsive design works
- [ ] Firebase connections work

### Step 3: Build Size Analysis

```bash
# Check build size
du -sh dist/

# Analyze bundles (optional)
npm install -g vite-bundle-analyzer
# Then configure in vite.config.js
```

Target: < 2MB gzipped

## Deployment Steps

### Step 1: Initialize Firebase Project

```bash
firebase init
```

Select the following when prompted:
- **Firestore**: Yes
- **Functions**: Yes
- **Hosting**: Yes
- **Project**: Select your Firebase project

### Step 2: Update Firebase Configuration

Edit `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|svg)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      },
      {
        "source": "/index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firebase/firestore.rules",
    "indexes": "firebase/firestore.indexes.json"
  },
  "functions": {
    "source": "firebase/functions",
    "runtime": "nodejs18"
  }
}
```

### Step 3: Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules --project your-project-id
```

Verify in Firebase Console:
- Rules are deployed
- No errors shown

### Step 4: Deploy Cloud Functions

```bash
cd firebase/functions
npm install
cd ../..

firebase deploy --only functions --project your-project-id
```

Monitor:
```bash
firebase functions:log --project your-project-id
```

### Step 5: Deploy to Firebase Hosting

```bash
# Login if needed
firebase login

# Deploy
firebase deploy --only hosting --project your-project-id
```

Your app is now live at:
```
https://your-project-id.web.app
```

### Step 6: Set Custom Domain (Optional)

```
Firebase Console → Hosting → Add custom domain
```

Follow the instructions to:
1. Verify domain ownership
2. Add DNS records
3. Wait for SSL certificate (up to 24 hours)

## Post-Deployment

### Step 1: Initialize Demo Data

Create demo users in Firebase Console:

**Super Admin**
- Email: admin@mall.com
- Password: [Strong password - change this!]
- Custom Claims: `{ "role": "super_admin" }`

**Store Manager**
- Email: manager@store.com
- Password: [Strong password - change this!]
- Custom Claims: `{ "role": "store_manager" }`

**Staff**
- Email: staff@store.com
- Password: [Strong password - change this!]
- Custom Claims: `{ "role": "staff" }`

### Step 2: Create Initial Data

Navigate to Firestore Database and create sample documents:

**Categories Collection**
```json
{
  "name": "Electronics",
  "description": "Electronic items",
  "status": "active"
}
```

**Stores Collection**
```json
{
  "name": "Store A",
  "location": "Level 1",
  "manager": "John Manager",
  "phone": "+1234567890",
  "status": "active"
}
```

**Suppliers Collection**
```json
{
  "name": "Supplier 1",
  "contactPerson": "John Doe",
  "phone": "+1234567890",
  "email": "supplier@example.com",
  "city": "New York",
  "status": "active"
}
```

### Step 3: Verify Deployment

Checklist:
- [ ] Website loads without errors
- [ ] Firebase authentication works
- [ ] Can login with demo credentials
- [ ] Dashboard displays correctly
- [ ] Can create/read/update/delete items
- [ ] Dark mode works
- [ ] Responsive design works on mobile
- [ ] All images load correctly
- [ ] Offline functionality (if applicable)

### Step 4: Test All Features

```bash
# Test checklist
- [ ] Login/Logout
- [ ] Add Product
- [ ] Edit Product
- [ ] Delete Product
- [ ] Search Products
- [ ] Add Store
- [ ] View Dashboard
- [ ] Generate Reports
- [ ] Export Data
- [ ] View Activity Logs
- [ ] Switch Theme (Dark/Light)
- [ ] Test on Mobile Browser
```

### Step 5: Setup Monitoring

```
Firebase Console → Monitoring
```

Enable:
- [ ] Performance monitoring
- [ ] Cloud Logging
- [ ] Error reporting
- [ ] Uptime checking

## Monitoring & Maintenance

### Daily Tasks

1. **Check error logs**
```bash
firebase functions:log --project your-project-id | tail -20
```

2. **Monitor Firestore usage**
- Firebase Console → Firestore → Metrics
- Check read/write operations
- Monitor storage usage

3. **Check hosting performance**
- Firebase Console → Hosting → Analytics
- Monitor page load time
- Check error rates

### Weekly Tasks

1. **Review activity logs**
- Check for suspicious activities
- Verify all actions are logged

2. **Database backup**
```bash
# Download backup
gsutil -m cp -r gs://your-project-id.appspot.com ./backups/
```

3. **Test recovery procedures**
- Verify backup integrity
- Test restore process

### Monthly Tasks

1. **Security audit**
- Review Firestore rules
- Check for unauthorized access
- Update security policies

2. **Performance optimization**
- Analyze slow queries
- Optimize indexes
- Clean up old data

3. **Cost review**
- Check Firebase billing
- Optimize storage
- Monitor function invocations

## Troubleshooting

### Deployment Failed: Permission Denied
```bash
firebase projects:list
firebase use your-project-id
```

### Build Error: Module Not Found
```bash
rm -rf node_modules
npm install
npm run build
```

### Firestore Rules Error
- Check rule syntax
- Verify collection names
- Test with Firebase Emulator
```bash
firebase emulators:start
```

### Performance Issues

1. Check Firestore indexes
```bash
firebase firestore:indexes
```

2. Monitor function execution
```bash
firebase functions:log --tail
```

3. Analyze bundle size
```bash
npm run build -- --analyze
```

## Rollback Procedure

If deployment has critical issues:

```bash
# Get previous version
firebase hosting:versions:list

# Rollback to previous version
firebase hosting:clone your-project-id:prev your-project-id

# Or deploy previous version
git checkout previous-commit
npm run build
firebase deploy --only hosting
```

## Backup & Recovery

### Manual Backup

```bash
# Firestore export
gcloud firestore export gs://your-bucket/backup-$(date +%s)

# Firebase import
gcloud firestore import gs://your-bucket/backup-xxx
```

### Automated Backups

Enable in Firestore:
```
Firestore → Backups → Available Backups
→ Create scheduled backup (daily/weekly)
```

## Performance Metrics Target

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 2s |
| Largest Contentful Paint | < 3s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 4s |
| Bundle Size | < 2MB |
| API Response Time | < 1s |
| Database Read Time | < 500ms |

## Contact & Support

- Firebase Support: https://firebase.google.com/support
- Documentation: https://firebase.google.com/docs
- Community: https://stackoverflow.com/questions/tagged/firebase

---

**Last Updated**: March 2024
**Deployment Guide Version**: 1.0
