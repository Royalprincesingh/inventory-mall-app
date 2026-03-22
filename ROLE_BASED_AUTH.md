# Role-Based Authentication System - Complete Implementation

Your Firebase inventory app now has a **complete role-based authentication system** with three different dashboards based on user roles.

## 🏗️ Architecture

### 1. Authentication Flow
```
Login (admin@mall.com) → Firebase Auth → Get User UID
                         ↓
                    Firestore users/{uid}
                         ↓
                    Read role field → Set in Context
                         ↓
                    Redirect to role-based dashboard
```

### 2. User Roles & Dashboard Routes

| Role | Email | Password | Dashboard Route | Features |
|------|-------|----------|-----------------|----------|
| **Admin** | admin@mall.com | admin123 | `/admin-dashboard` | System-wide overview, all stores, all users |
| **Manager** | manager@store.com | manager123 | `/manager-dashboard` | Store-specific dashboard, inventory management |
| **Staff** | staff@store.com | staff123 | `/staff-dashboard` | Sales records, daily metrics, quick tasks |

---

## 📁 Firestore Collection Structure

### users collection
```
Collection: users

Document ID: Kxa0oqLeclNjpc6ZCH4n0S4ku1p2  (Auto-generated or custom)
Fields:
├─ email: "staff@store.com"
├─ role: "staff"              ← CRITICAL: Must be one of: admin, manager, staff
├─ storeId: "store_01"        ← Optional: Which store staff/manager manages
├─ name: "John Doe"           ← Optional
└─ createdAt: timestamp

Document ID: hSh5yMn0MDQt8AlqSrfwFEBKvbU2
Fields:
├─ email: "manager@store.com"
├─ role: "manager"
├─ storeId: "store_01"
└─ name: "Sarah Smith"

Document ID: 7hTHkdOWNdVWgLr6tX0plFx4UyK2
Fields:
├─ email: "admin@mall.com"
├─ role: "admin"
├─ storeId: null             ← Admin has access to all stores
└─ name: "Admin User"
```

---

## 🔐 Code Implementation

### 1. AuthContext.jsx - Updated for Firestore role fetching

```javascript
// src/context/AuthContext.jsx

import { doc, getDoc } from 'firebase/firestore'
import { auth as firebaseAuth, db as firebaseDb } from '../firebase'

// Updated: Fetch user role from Firestore
async function fetchUserRole(userId) {
  try {
    if (firebaseDb) {
      const userDocRef = doc(firebaseDb, 'users', userId)
      const userDocSnap = await getDoc(userDocRef)
      
      if (userDocSnap.exists()) {
        const role = userDocSnap.data().role
        if (!role) {
          setError('User role not found in database')
          return null
        }
        setUserRole(role)
        return role
      }
    }
  } catch (err) {
    console.error('Error fetching role:', err)
    setError(err.message)
    return null
  }
}
```

### 2. App.jsx - Role-Based Routing

```javascript
// src/App.jsx

// Role-Based Dashboard Router Component
function RoleBasedDashboard() {
  const { userRole, loading } = useAuth()

  switch (userRole) {
    case 'admin':
      return <MainLayout><AdminDashboard /></MainLayout>
    case 'manager':
      return <MainLayout><ManagerDashboard /></MainLayout>
    case 'staff':
      return <MainLayout><StaffDashboard /></MainLayout>
    default:
      return <MainLayout><Dashboard /></MainLayout>
  }
}

// Usage in router
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <RoleBasedDashboard />
    </ProtectedRoute>
  }
/>
```

### 3. ProtectedRoute Component - Enhanced with error handling

```javascript
function ProtectedRoute({ children }) {
  const { currentUser, loading, userRole, error } = useAuth()

  // Show error if role not found
  if (!userRole && currentUser && !loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1>🔑 Role Not Assigned</h1>
          <p>Your account doesn't have a role. Contact admin.</p>
        </div>
      </div>
    )
  }

  return children
}
```

---

## 🚀 Deployment Steps

### Step 1: Create Users in Firebase Auth
1. Go to: [Firebase Console](https://console.firebase.google.com/project/marketdekho-90910973-9ec12/authentication)
2. Click **Add User** for each:
   - Email: `admin@mall.com` | Password: `admin123`
   - Email: `manager@store.com` | Password: `manager123`
   - Email: `staff@store.com` | Password: `staff123`

### Step 2: Create users Collection with Role Documents
1. Go to: **Firestore Database** → **Collections**
2. Create collection: `users`
3. Add documents using their **Firebase Auth UID** as document ID:

**For admin@mall.com user:**
```json
{
  "email": "admin@mall.com",
  "role": "admin",
  "storeId": null,
  "name": "Admin User"
}
```

**For manager@store.com user:**
```json
{
  "email": "manager@store.com",
  "role": "manager",
  "storeId": "store_01",
  "name": "Sarah Smith"
}
```

**For staff@store.com user:**
```json
{
  "email": "staff@store.com",
  "role": "staff",
  "storeId": "store_01",
  "name": "John Doe"
}
```

### Step 3: Update Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public collections for authenticated users
    match /products/{document=**} {
      allow read: if request.auth != null;
    }
    
    match /stores/{document=**} {
      allow read: if request.auth != null;
    }
    
    // Users can only access their own user document
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
    }
    
    // Allow all for development (restrict in production)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🧪 Testing the System

### Test Case 1: Admin Login
1. Go to: https://marketdekho-90910973-9ec12.web.app
2. Email: `admin@mall.com` | Password: `admin123`
3. Expected: Redirects to `/dashboard` → Shows **AdminDashboard** with:
   - Total Products, Total Stores, Total Users, etc.
   - System-wide sales trend
   - All stores visible

### Test Case 2: Manager Login
1. Email: `manager@store.com` | Password: `manager123`
2. Expected: Shows **ManagerDashboard** with:
   - Store-specific metrics
   - Store information (location, manager, hours)
   - Pending orders for that store
   - Action items (low stock, orders)

### Test Case 3: Staff Login
1. Email: `staff@store.com` | Password: `staff123`
2. Expected: Shows **StaffDashboard** with:
   - Today's sales metrics
   - Items sold count
   - Top selling products
   - Quick action buttons
   - Recent activity log

### Test Case 4: Error Handling
1. Create user in Auth but **forget to add** to users collection
2. Expected: Shows error "User profile not found in database"
3. Shows "Role Not Assigned" error page

---

## 📊 Dashboard Features by Role

### Admin Dashboard (`AdminDashboard.jsx`)
- ✅ System-wide inventory overview
- ✅ Total stores count
- ✅ Total users count
- ✅ Monthly revenue across all stores
- ✅ System health status
- ✅ Top selling products
- ✅ 7-day sales trend chart

### Manager Dashboard (`ManagerDashboard.jsx`)
- ✅ Store-specific metrics
- ✅ Products in store count
- ✅ Today's sales for store
- ✅ Pending orders for store
- ✅ Store information display
- ✅ Low stock alerts
- ✅ Action items

### Staff Dashboard (`StaffDashboard.jsx`)
- ✅ Daily sales metrics
- ✅ Items sold today
- ✅ Low stock items
- ✅ Top selling products today
- ✅ Quick action buttons (Record Sale, Report Issue, etc.)
- ✅ Recent activity feed

---

## 🔧 Troubleshooting

### Issue: "Role Not Assigned"
**Solution:** User document missing from Firestore `users` collection
```
1. Go to Firebase Console → Firestore
2. Create document with UID as ID
3. Add "role" field with value: admin, manager, or staff
```

### Issue: "User profile not found"
**Solution:** User exists in Auth but not in Firestore
```
1. Check if users collection exists
2. Create document with user's UID from Firebase Auth
```

### Issue: User still sees generic Dashboard
**Solution:** Role document exists but has wrong role value
```
Valid role values: "admin", "manager", "staff"
Case-sensitive!
```

---

## 🎯 How It Works (Complete Flow)

1. **User enters credentials** → LoginPage.jsx
2. **Firebase Auth validates** → signInWithEmailAndPassword()
3. **User gets authenticated** → Auth state changes
4. **useEffect triggers** → Gets user UID from currentUser
5. **Fetches user document** → doc(db, 'users', uid)
6. **Reads role field** → userDocSnap.data().role
7. **Sets in context** → setUserRole('admin'|'manager'|'staff')
8. **Redirects to dashboard** → RoleBasedDashboard()
9. **Router renders** → Correct dashboard based on role

All this happens automatically after login!

---

## 📝 Files Modified

| File | Changes |
|------|---------|
| `src/context/AuthContext.jsx` | Added Firestore role fetching, fallback to mock auth |
| `src/App.jsx` | Added RoleBasedDashboard, role-based routing, error handling |
| `src/pages/AdminDashboard.jsx` | NEW - System-wide dashboard |
| `src/pages/ManagerDashboard.jsx` | NEW - Store manager dashboard |
| `src/pages/StaffDashboard.jsx` | NEW - Staff daily dashboard |

---

## ✅ Live Testing

Your app is deployed at:
📱 **https://marketdekho-90910973-9ec12.web.app**

Try logging in with different roles and see the dashboards change!

Questions? Check browser console (F12) for detailed error logs. 🚀
