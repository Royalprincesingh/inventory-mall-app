# Inventory Management System for Shopping Malls

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%3E%3D18.0.0-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/firebase-enabled-orange.svg)](https://firebase.google.com/)

A comprehensive, enterprise-grade inventory management platform designed for multi-store shopping mall operations. Built with modern technologies, this system delivers real-time inventory tracking, sales management, purchase order processing, and advanced analytics capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [User Roles](#-user-roles)
- [Getting Started](#-getting-started)
- [Firebase Setup](#-firebase-setup)
- [Project Structure](#-project-structure)
- [Development Guide](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Support](#-support)

## 🎯 Features

### Core Capabilities
- **Real-Time Dashboard** — Interactive analytics hub with KPI tracking and performance metrics
- **Product Management** — Comprehensive SKU and barcode tracking system
- **Multi-Store Support** — Unified management of multiple store locations within a mall
- **Inventory Tracking** — Live inventory synchronization with intelligent low-stock alerts
- **Purchase Orders** — Streamlined supplier integration and order management
- **Sales Management** — Complete transaction tracking with payment reconciliation
- **Financial Reporting** — Profit & Loss statements with detailed financial metrics
- **Activity Logging** — Complete audit trail for compliance and security
- **Role-Based Access Control** — Three-tier permission system with fine-grained controls

### Advanced Capabilities
- **Theme Customization** — Dark and light mode switching with persistent preferences
- **Mobile-First Design** — Fully responsive interface optimized for all devices
- **Data Export** — Multi-format export capabilities (CSV, JSON)
- **Real-Time Updates** — Live Firestore synchronization for instant data consistency
- **Smart Reordering** — Automatic notifications for inventory replenishment
- **Product Analytics** — Fast-moving vs slow-moving product analysis
- **Inventory Valuation** — Precise stock valuation and cost tracking
- **Enterprise Security** — Firebase authentication with enhanced security features

## 🏗️ Architecture

The application follows a modular, scalable architecture optimized for performance and maintainability.

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend Layer                         │
│  React.js + Redux Toolkit + Context API + Tailwind CSS  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/WebSocket
┌──────────────────────▼──────────────────────────────────┐
│                 State Management                         │
│       Redux Store + React Context + Local Storage       │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────────┐
│              Backend Services Layer                      │
│    Firebase Authentication │ Firebase Cloud Functions   │
├──────────────────────────────────────────────────────────┤
│              Database Layer                              │
│          Firestore (NoSQL Document Database)            │
│              Real-Time Listeners                         │
└──────────────────────────────────────────────────────────┘

Technology Stack:
├── Frontend Framework:    React 18.x
├── Styling:               Tailwind CSS + PostCSS
├── State Management:      Redux Toolkit + Context API
├── Charts & Analytics:    Recharts
├── Authentication:        Firebase Auth
├── Database:              Cloud Firestore
├── Real-Time Updates:     Firestore Listeners
├── Build Tool:            Vite
└── Deployment:            Firebase Hosting
```

## 👥 User Roles & Permissions

The system implements a three-tier role-based access control (RBAC) model with specific permissions for each user type.

### 1. Super Admin (Mall Owner)
Complete system administration and strategic control

| Permission | Status |
|-----------|--------|
| Full system access | ✅ |
| Create and manage stores | ✅ |
| User and role management | ✅ |
| Access all reports and analytics | ✅ |
| System configuration | ✅ |
| Supplier management | ✅ |
| Audit log access | ✅ |

### 2. Store Manager
Store-level operations and inventory oversight

| Permission | Status |
|-----------|--------|
| Manage products for assigned store | ✅ |
| Create and track purchase orders | ✅ |
| View sales transactions and inventory | ✅ |
| Generate store-specific reports | ✅ |
| Manage staff members | ✅ |
| View activity logs | ✅ |
| Modify system-wide settings | ❌ |
| Manage other stores | ❌ |

### 3. Staff / Employee
Daily operational tasks

| Permission | Status |
|-----------|--------|
| Record sales transactions | ✅ |
| Track inventory movements | ✅ |
| View product information | ✅ |
| Access basic reports | ✅ |
| Modify products or orders | ❌ |
| View other stores' data | ❌ |
| Access supplier information | ❌ |

## 📁 Project Structure

```
inventory-mall-app/
│
├── src/                           # Application source code
│   ├── components/                # Reusable React components
│   │   ├── BarcodeScanner.jsx    # Barcode scanning utility
│   │   ├── Dashboard.jsx          # Main dashboard component
│   │   └── Sidebar.jsx            # Navigation sidebar
│   │
│   ├── pages/                     # Page components (routes)
│   │   ├── LoginPage.jsx          # Authentication page
│   │   ├── AdminDashboard.jsx     # Admin dashboard
│   │   ├── ManagerDashboard.jsx   # Manager dashboard
│   │   ├── ProductsPage.jsx       # Product management
│   │   ├── StoresPage.jsx         # Store management
│   │   ├── SuppliersPage.jsx      # Supplier management
│   │   ├── OrdersPage.jsx         # Purchase orders
│   │   ├── SalesPage.jsx          # Sales tracking
│   │   ├── SalesScanPage.jsx      # Barcode-based sales
│   │   ├── StockInPage.jsx        # Stock receipt
│   │   ├── StaffDashboard.jsx     # Staff interface
│   │   ├── ReportsPage.jsx        # Analytics and reports
│   │   ├── ActivityLogsPage.jsx   # Audit logs
│   │   └── ScanProductPage.jsx    # Product scanning
│   │
│   ├── context/                   # React Context providers
│   │   ├── AuthContext.jsx        # Authentication context
│   │   └── ThemeContext.jsx       # Theme management
│   │
│   ├── redux/                     # Redux state management
│   │   ├── store.js               # Redux store configuration
│   │   └── slices/
│   │       ├── authSlice.js       # Authentication state
│   │       ├── inventorySlice.js  # Inventory state
│   │       ├── ordersSlice.js     # Orders state
│   │       ├── storesSlice.js     # Stores state
│   │       └── suppliersSlice.js  # Suppliers state
│   │
│   ├── services/                  # Business logic layer
│   │   ├── firebaseService.js     # Main Firebase integration
│   │   ├── firebaseRealService.js # Real Firebase implementation
│   │   ├── firebaseMockService.js # Mock for testing
│   │   ├── barcodeService.js      # Barcode operations
│   │   ├── stockService.js        # Stock management
│   │   ├── inventoryLogService.js # Inventory logging
│   │   └── exportService.js       # Data export utilities
│   │
│   ├── utils/                     # Utility functions
│   │   ├── helpers.js             # General helper functions
│   │   └── roleUtils.js           # Role permission utilities
│   │
│   ├── styles/                    # Global styles
│   │   └── index.css              # Tailwind with custom styles
│   │
│   ├── firebase.js                # Firebase configuration
│   ├── firebase.mock.js           # Mock Firebase setup
│   ├── App.jsx                    # Root application component
│   └── main.jsx                   # Application entry point
│
├── firebase/                      # Firebase configuration & setup
│   ├── firebase.config.template.js # Config template
│   ├── firestore.rules            # Firestore security rules
│   ├── firestore.indexes.json     # Firestore indexes
│   ├── functions.js               # Cloud Functions
│   ├── import-data.js             # Data import scripts
│   ├── seed-data.js               # Demo data seeding
│   ├── sample-data.json           # Sample dataset
│   └── FIRESTORE_SCHEMA.md        # Database schema documentation
│
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite build configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── firebase.json                  # Firebase deployment config
│
└── Documentation Files
    ├── README.md                  # This file
    ├── API_DOCUMENTATION.md       # API reference
    ├── ARCHITECTURE.md            # Architecture deep-dive
    ├── FIRESTORE_SETUP.md         # Firestore configuration guide
    ├── QUICKSTART.md              # Quick start guide
    ├── DEPLOYMENT.md              # Deployment instructions
    ├── ROLE_BASED_AUTH.md         # Authentication details
    ├── BARCODE_SETUP.md           # Barcode system setup
    ├── BARCODE_SCANNING_GUIDE.md  # Barcode usage guide
    └── PROJECT_FILES.md           # Project file reference
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

| Requirement | Minimum Version | Download |
|------------|-----------------|----------|
| Node.js | 16.0.0 | [nodejs.org](https://nodejs.org/) |
| npm | 8.0.0 | Included with Node.js |
| Git | 2.30.0 | [git-scm.com](https://git-scm.com/) |
| Firebase Account | — | [firebase.google.com](https://firebase.google.com/) |

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/inventory-mall-app.git
cd inventory-mall-app
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Firebase Credentials
```bash
# Copy the environment template
cp .env.example .env.local
```

Edit `.env.local` with your Firebase project credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

⚠️ **Security Note**: Never commit `.env.local` or Firebase credentials to version control.

#### 4. Install Firebase CLI (Optional - for deployment)
```bash
npm install -g firebase-tools
```

#### 5. Start the Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

### Demo Account

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Super Admin | admin@mall.com | admin123 | Full system access |
| Store Manager | manager@store.com | manager123 | Store operations |
| Staff | staff@store.com | staff123 | Daily operations |

⚠️ **WARNING**: Change these credentials immediately in production. See [Security](#-security) section for best practices.

## 🗄️ Firebase Configuration

### Complete Setup Guide

#### Step 1: Create Firebase Project
1. Navigate to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create project"**
3. Enter project name: `Inventory Management System`
4. Enable Google Analytics (recommended)
5. Select or create Google Cloud project
6. Review and confirm project settings

#### Step 2: Enable Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **Email/Password** provider
3. Enable both "Email/Password" and "Email link" options
4. Save configuration

*Optional: Enable Google Sign-in for enhanced user experience*

#### Step 3: Create Firestore Database
1. Navigate to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (apply rules for security)
4. Select region closest to your physical location
5. Wait for database initialization (2-3 minutes)

#### Step 4: Configure Firestore Security Rules
```bash
firebase deploy --only firestore:rules --project your-project-id
```

Rules will be deployed from `firebase/firestore.rules`

#### Step 5: Create Firestore Indexes
```bash
firebase deploy --only firestore:indexes --project your-project-id
```

Indexes configuration is in `firebase/firestore.indexes.json`

#### Step 6: Deploy Cloud Functions (Optional)
```bash
firebase deploy --only functions --project your-project-id
```

See `firebase/functions.js` for available functions

#### Step 7: Create Demo Users
Using Firebase Console:
1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter credentials:
   - admin@mall.com / admin123
   - manager@store.com / manager123
   - staff@store.com / staff123
4. Set custom claims via Cloud Functions (see setup guide)

*Alternative: Use the admin script provided*

#### Step 8: Initialize Sample Data
```bash
# Run seeding script
node firebase/seed-data.js
```

### Firestore Database Schema

The application uses the following collections:

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| `users` | User accounts and authentication | email, role, store_id, created_at |
| `products` | Product inventory | sku, name, price, quantity, category_id |
| `categories` | Product classification | name, description, image_url |
| `stores` | Mall store locations | name, location, manager_id, status |
| `suppliers` | Vendor management | name, contact, email, payment_terms |
| `purchase_orders` | Purchase tracking | supplier_id, items, total, status |
| `sales` | Transaction records | store_id, items, total, payment_method |
| `inventory_movements` | Stock tracking | product_id, type, quantity, reference |
| `activity_logs` | Audit trail | user_id, action, resource, timestamp |
| `notifications` | System alerts | user_id, message, type, read_status |

📚 **Detailed Schema**: See [firebase/FIRESTORE_SCHEMA.md](firebase/FIRESTORE_SCHEMA.md)

## 🔧 Development Guide

### Available Scripts

```bash
# Start local development server with hot module replacement
npm run dev

# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Lint code for style and error issues
npm run lint

# Automatically fix linting issues
npm run lint:fix
```

### Development Standards

#### Vue Component Structure
```jsx
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useDispatch, useSelector } from 'react-redux'
import { productService } from '../services/firebaseService'
import toast from 'react-hot-toast'

export function MyComponent() {
  // Hooks
  const { currentUser } = useAuth()
  const dispatch = useDispatch()
  
  // State
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Effects
  useEffect(() => {
    fetchData()
  }, [currentUser])

  // Event handlers
  const handleAction = useCallback(async (item) => {
    try {
      setLoading(true)
      // Action logic
      toast.success('Action completed')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Render
  return (
    <div className="container">
      {/* JSX content */}
    </div>
  )
}
```

### Best Practices

1. **State Management**
   - Use Redux for global state (auth, inventory, orders)
   - Use Context API for theme and user preferences
   - Use local state for component-specific data

2. **Error Handling**
   - Always wrap Firebase calls in try-catch
   - Display user-friendly error messages via toast
   - Log errors to activity logs for debugging

3. **Performance**
   - Lazy load pages using React.lazy()
   - Memoize expensive computations
   - Avoid inline function definitions in JSX

4. **Security**
   - Never store sensitive data in Redux (no passwords, tokens)
   - Always use environment variables for configuration
   - Validate user input on frontend and backend

### Debugging

Enable verbose logging:
```javascript
// In App.jsx or development config
if (process.env.NODE_ENV === 'development') {
  window.__DEBUG__ = true
}
```

View logs in browser console for detailed information.

## 🎨 Styling & Design System

### Tailwind CSS Configuration

The application uses Tailwind CSS for rapid, consistent UI development.

**Configuration Files:**
- Primary config: `tailwind.config.js`
- CSS entry: `src/styles/index.css`
- PostCSS config: `postcss.config.js`

### Design System

#### Color Palette
```javascript
// Primary
colors.blue-600    // Primary actions
colors.blue-50     // Light backgrounds

// Secondary
colors.gray-600    // Secondary actions
colors.gray-50     // Neutral backgrounds

// Status
colors.emerald-600 // Success
colors.red-600     // Danger/Error
colors.amber-600   // Warning
colors.sky-600     // Info
```

#### Custom Component Classes
```css
/* Cards and containers */
.card              /* Elevated card component */
.input-field       /* Styled form input */
.badge             /* Status badge */
.button-primary    /* Primary button style */
.button-secondary  /* Secondary button style */
```

### Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | <640px | Single column, hamburger menu |
| Tablet | 640px - 1024px | Two columns |
| Desktop | >1024px | Three+ columns |
| Large | >1280px | Full featured layout |

### Dark Mode Implementation

Theme is managed via the `ThemeContext`:
```jsx
import { useTheme } from '../context/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
      {/* Content */}
    </div>
  )
}
```

All dark mode classes use Tailwind's `dark:` prefix.

## 🔒 Security

### Authentication & Authorization

#### Firebase Authentication
- Email/Password authentication with secure password hashing
- Custom claims for role-based access control
- Session management with automatic token refresh
- Automatic logout on token expiration
- Secure storage of tokens with secure flags

#### Authorization Layer
```javascript
// Role-based route protection
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

#### Firestore Security Rules
- Document-level access control
- Field-level permissions and masking
- User ID verification on write operations
- Role-based query restrictions

### Data Protection

#### Encryption
- TLS/SSL for all data in transit
- Firestore default encryption at rest
- Sensitive fields encrypted on backend

#### Password Security
- Minimum 8 characters required
- Enforced password reset after 90 days
- Password history prevents reuse
- Failed login throttling after 5 attempts

### Environment Security

#### Credentials Management
```bash
# ✅ DO: Use environment variables
VITE_FIREBASE_API_KEY=your_key

# ❌ DON'T: Hardcode credentials
const apiKey = "sk_live_xxx"
```

#### Git Configuration
```bash
# .gitignore entries
.env.local
.env.*.local
*.key
secrets/
```

### Best Practices

| Practice | Implementation |
|----------|----------------|
| **Principle of Least Privilege** | Users get minimum permissions needed |
| **Input Validation** | All user inputs validated on client and server |
| **Output Encoding** | XSS prevention through React's built-in escaping |
| **CSRF Protection** | Firebase handles CSRF tokens automatically |
| **Audit Logging** | All sensitive actions logged to activity_logs |
| **Rate Limiting** | Firebase implements automatic rate limiting |
| **Secure Headers** | CSP, X-Frame-Options configured in Firebase |

### Compliance

- ✅ GDPR compliant data handling
- ✅ Secure credential rotation policies
- ✅ Regular security audits
- ✅ Incident response procedures defined

## ⚡ Performance Optimization

### Frontend Optimization

| Technique | Implementation | Benefit |
|-----------|----------------|---------|
| **Code Splitting** | `React.lazy()` for route components | Reduced initial bundle size |
| **Lazy Loading** | Intersection Observer for images | Faster page load |
| **Asset Optimization** | Image compression, WebP format | Lower bandwidth usage |
| **Memoization** | `React.memo()`, `useMemo()`, `useCallback()` | Prevents unnecessary re-renders |
| **Tree Shaking** | ES6 modules with proper exports | Smaller production bundle |

### State Management Optimization

- Redux middleware for efficient updates
- Normalization of Redux state structure
- Selective re-rendering with useSelector
- Batched actions to reduce dispatch calls

### Database Optimization

#### Firestore Indexing
- Composite indexes for complex queries
- Auto-indexing for new fields
- Regular index review and cleanup
- Strategy: Query → Index creation

#### Query Optimization
```javascript
// ✅ Optimized: Filtered query with index
const query = query(productRef, 
  where('store_id', '==', storeId),
  where('stock', '<', threshold)
)

// ❌ Unoptimized: Fetch all and filter
const allProducts = await getDocs(productRef)
const filtered = allProducts.filter(...)
```

### Network Optimization

- Firestore listener batching to reduce connections
- Request debouncing and throttling
- Firestore offline persistence
- CDN delivery via Firebase Hosting

### Monitoring

View performance metrics:
```javascript
// Firestore read metrics
firebase.performance().start('product_query')
// ... query logic
firebase.performance().end()
```

## 🚢 Deployment Guide

### Prerequisites for Deployment
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project initialized: `firebase init`
- Production environment variables configured
- All tests passing: `npm run test`

### Deployment to Firebase Hosting

#### Step 1: Prepare for Production Build
```bash
# Create optimized production build
npm run build

# Verify build artifacts
ls -la dist/
```

#### Step 2: Authenticate with Firebase
```bash
# Login to Firebase account
firebase login

# Verify authentication
firebase projects:list
```

#### Step 3: Configure Deployment
```bash
# Initialize Firebase if not already done
firebase init hosting

# Select your project when prompted
# Configure public directory as 'dist'
# Configure as SPA (single page application)
```

#### Step 4: Deploy Application
```bash
# Deploy hosting only
firebase deploy --only hosting

# Deploy specific configuration
firebase deploy --only hosting,firestore:rules,firestore:indexes

# Deploy with message (for tracking)
firebase deploy -m "Release v1.0.0 - Production"
```

#### Step 5: Verify Deployment
```bash
# Your app is live at:
# https://your-project-id.web.app
# https://your-project-id.firebaseapp.com

# Check deployment status
firebase hosting:sites

# View logs
firebase hosting:log
```

### Deploy Cloud Functions

```bash
# Deploy all functions
firebase deploy --only functions --project your-project-id

# Deploy specific function
firebase deploy --only functions:myFunction

# View function logs
firebase functions:log
```

### Deploy Firestore Configuration

```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes

# Deploy both
firebase deploy --only firestore
```

### Continuous Deployment (CI/CD)

#### GitHub Actions Example
```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main, production ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Install dependencies
      run: npm install
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: ${{ secrets.GITHUB_TOKEN }}
        firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
        projectId: your-project-id
```

### Rollback & Recovery

```bash
# View deployment history
firebase hosting:versions:list

# Rollback to previous version
firebase hosting:clone production staging

# Delete specific version
firebase hosting:delete
```

### Environment-Specific Deployments

```bash
# Staging deployment
firebase deploy --only hosting --project inventory-mall-staging

# Production deployment
firebase deploy --only hosting --project inventory-mall-production
```

### Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Confirm database connectivity
- [ ] Check console for errors
- [ ] Verify HTTPS is enabled
- [ ] Test on multiple devices
- [ ] Review Firebase Console metrics

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Authentication Issues

**Problem**: "Authentication failed" or login not working

**Causes & Solutions**:
```bash
# 1. Verify Firebase credentials
cat .env.local
# Check all VITE_FIREBASE_* variables are present

# 2. Check authentication is enabled
# Navigate to: Firebase Console → Authentication → Sign-in method
# Ensure "Email/Password" is enabled

# 3. Clear authentication state
# Browser DevTools → Application → Storage → Clear All
# Restart application
```

#### Firestore Connection Issues

**Problem**: "Error: Firebase database is not initialized"

**Causes & Solutions**:
```bash
# 1. Verify database exists
firebase firestore:indexes

# 2. Check Firestore rules are deployed
firebase deploy --only firestore:rules

# 3. Verify security rules allow your user
# Firebase Console → Firestore → Rules tab
# Check user ID and role claims match rules

# 4. Test with simplified rules (for debugging only)
# match /{document=**} { allow read, write; }
```

#### Build & Compilation Issues

**Problem**: "npm run build" fails or "Module not found"

**Solutions**:
```bash
# 1. Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# 2. Clear Vite build cache
rm -rf dist node_modules/.vite

# 3. Check Node.js version
node -v  # Should be 16.0.0 or higher

# 4. Update npm
npm install -g npm@latest

# 5. Try verbose build output
npm run build -- --debug
```

**Problem**: "Port 5173 already in use"

**Solutions**:
```bash
# Find and kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or specify different port
npm run dev -- --port 3000
```

#### Development Server Issues

**Problem**: Hot Module Replacement (HMR) not working

**Solutions**:
```javascript
// In vite.config.js, ensure HMR is configured:
export default {
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    }
  }
}
```

#### Data Not Displaying

**Problem**: Data fetches but doesn't render

**Solutions**:
```javascript
// 1. Check Redux state
// Browser DevTools → Redux DevTools Extension
// Verify data is in store

// 2. Verify component is subscribed to state
const products = useSelector(state => state.inventory.products)
// Log to confirm

// 3. Check network tab
// DevTools → Network
// Verify Firestore requests are successful (200)
```

### Support Resources

| Issue Type | Resource |
|-----------|----------|
| Firebase Help | [Firebase Docs](https://firebase.google.com/docs) |
| React Issues | [React Docs](https://react.dev) |
| Vite Questions | [Vite Docs](https://vitejs.dev) |
| Tailwind CSS | [Tailwind Docs](https://tailwindcss.com) |

## 📚 API Documentation

### Authentication Service

```javascript
import { useAuth } from './context/AuthContext'

const {
  currentUser,      // Current Firebase user object
  userRole,         // User's role (admin, manager, staff)
  login,            // (email, password) => Promise
  logout,           // () => Promise
  signup,           // (email, password, role) => Promise
  updateProfile,    // (data) => Promise
  resetPassword     // (email) => Promise
} = useAuth()

// Example usage
const handleLogin = async () => {
  try {
    await login('admin@mall.com', 'admin123')
    // Redirected to dashboard
  } catch (error) {
    console.error('Login failed:', error.message)
  }
}
```

### Firebase Services

#### Product Service
```javascript
import { productService } from './services/firebaseService'

// Get all products
const products = await productService.getAllProducts()

// Get products for specific store
const storeProducts = await productService.getProductsByStore(storeId)

// Get low stock products
const lowStock = await productService.getLowStockProducts(threshold = 10)

// Add new product
await productService.addProduct({
  name: 'Product Name',
  sku: 'SKU123',
  price: 99.99,
  quantity: 100,
  category_id: 'cat_1'
})

// Update product
await productService.updateProduct(productId, { price: 89.99 })

// Delete product
await productService.deleteProduct(productId)
```

#### Sales Service
```javascript
import { salesService } from './services/firebaseService'

// Record sale
await salesService.recordSale({
  store_id: storeId,
  items: [{ product_id, quantity, price }],
  payment_method: 'cash',
  total: 500
})

// Get sales report
const report = await salesService.getSalesReport(dateRange)

// Track inventory movement
await salesService.trackInventoryMovement({
  product_id,
  type: 'sale',  // or 'stock_in', 'adjustment'
  quantity,
  reference_id
})
```

#### Store Service
```javascript
import { storeService } from './services/firebaseService'

// Get all stores
const stores = await storeService.getAllStores()

// Add store
await storeService.addStore({
  name: 'Store Name',
  location: 'Floor 2',
  manager_id: managerId
})

// Update store
await storeService.updateStore(storeId, { status: 'active' })
```

### Redux Store

```javascript
import { useDispatch, useSelector } from 'react-redux'

// Access state
const products = useSelector(state => state.inventory.products)
const loading = useSelector(state => state.inventory.loading)

// Dispatch actions
const dispatch = useDispatch()
dispatch(setProducts(productList))
dispatch(setLoading(true))

// Available slices:
// - authSlice: Authentication state
// - inventorySlice: Products and stock
// - ordersSlice: Purchase orders
// - storesSlice: Store information
// - suppliersSlice: Supplier data
```

### Export Service

```javascript
import { exportService } from './services/exportService'

// Export to CSV
exportService.exportToCSV(data, filename)

// Export to JSON
exportService.exportToJSON(data, filename)

// Export to PDF (if configured)
exportService.exportToPDF(data, filename)
```

### Admin Functions

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference with examples.

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

```bash
# 1. Fork and clone repository
git clone https://github.com/yourusername/inventory-mall-app.git

# 2. Create feature branch
git checkout -b feature/add-new-feature

# 3. Make your changes
# Write code, add tests, update documentation

# 4. Commit with clear messages
git commit -m "feat: add new feature description"
# Commit messages:
# feat: New feature
# fix: Bug fix
# docs: Documentation
# style: Formatting
# refactor: Code restructuring
# test: Test additions

# 5. Push to branch
git push origin feature/add-new-feature

# 6. Submit pull request
# Fill in PR template with description and tests
```

### Code Standards

- Follow ESLint configuration provided
- Use Prettier for code formatting
- Add unit tests for new features
- Update documentation for API changes
- Comments for complex logic

### Pull Request Process

1. Ensure builds pass and tests are green
2. Update documentation if needed
3. Address code review feedback
4. Get approval from maintainers
5. Merge with convention commits

### Issues & Bug Reports

When reporting issues:
1. Use clear, descriptive titles
2. Include steps to reproduce
3. Specify your environment (OS, Node version)
4. Attach error logs if applicable

## 📝 License

This project is **proprietary software**. All rights reserved.

For licensing inquiries, please contact: legal@inventorysystem.com

## 📄 Change Log

### v1.2.0 (2024-12-15)
- **Added**: Advanced analytics dashboard
- **Added**: Barcode scanner integration
- **Improved**: Performance optimization for large datasets
- **Fixed**: Real-time update synchronization issues

### v1.1.0 (2024-09-20)
- **Added**: Dark mode support
- **Added**: CSV export functionality
- **Added**: Low stock alert notifications
- **Improved**: UI/UX refinements

### v1.0.0 (2024-03-11)
- **Initial Release**
- Core inventory management features
- User authentication and RBAC
- Dashboard with analytics
- Reports generation
- Firebase integration

## 🗺️ Roadmap

### Q1 2025
- [ ] Mobile app (React Native / Flutter)
- [ ] Advanced forecasting with ML
- [ ] Multi-language support (I18n)

### Q2 2025
- [ ] Real-time SMS notifications
- [ ] Email reports with scheduling
- [ ] API for third-party integrations
- [ ] Inventory forecasting with ML

### Q3 2025
- [ ] Customer loyalty program integration
- [ ] Supplier portal
- [ ] Advanced RFID tracking
- [ ] Voice-controlled inventory search

### Q4 2025
- [ ] AI-powered demand prediction
- [ ] Automated reordering system
- [ ] Enhanced analytics with custom reports
- [ ] Mobile app launch

## 📞 Support & Contact

### Getting Help

| Channel | Contact | Response Time |
|---------|---------|----------------|
| Email Support | support@inventorysystem.com | 24-48 hours |
| Documentation | [Wiki](wiki/) | Self-service |
| Issues | [GitHub Issues](issues/) | 5-7 days |
| Urgent Issues | emergency@inventorysystem.com | 2-4 hours |

### Community

- **Slack Community**: [Join](slack-invite)
- **Discussion Forum**: [GitHub Discussions](discussions/)
- **Twitter**: [@InventoryMall](twitter)
- **LinkedIn**: [Company Page](linkedin)

## 🙏 Acknowledgments

Built with modern technologies and best practices in inventory management.

Special thanks to:
- Firebase team for excellent infrastructure
- React community for the framework
- Contributors and users for feedback

---

<div align="center">

**Built with ❤️ for modern retail management**

[🔝 Back to Top](#-table-of-contents)

© 2024 Inventory Management System. All rights reserved.

</div>
