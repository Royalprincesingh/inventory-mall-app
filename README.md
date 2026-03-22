# Inventory Management System - Shopping Mall

A modern, enterprise-grade inventory management web application built for large shopping malls. This system provides real-time inventory tracking, sales management, purchase order processing, and comprehensive analytics.

## 🎯 Features

### Core Features
- **Real-time Dashboard** with analytics and KPIs
- **Product Management** with SKU and barcode tracking
- **Multi-store Support** inside a single mall
- **Inventory Tracking** with low stock alerts
- **Purchase Order System** with supplier integration
- **Sales Management** with payment tracking
- **Profit & Loss Reports** with detailed metrics
- **Activity Logging** for audit trails
- **Role-based Access Control** (3 user roles)

### Advanced Features
- Dark/Light mode theme switching
- Mobile-responsive design
- Data export (CSV/JSON)
- Real-time inventory updates via Firebase
- Automatic reorder notifications
- Fast-moving and slow-moving product analysis
- Inventory valuation reports
- Secure Firebase authentication

## 🏗️ Architecture

```
Frontend: React.js + Tailwind CSS
State Management: Redux Toolkit + Context API
Backend: Firebase (Firestore, Auth, Hosting)
Charts: Recharts
Real-time: Firestore Listeners
Authentication: Firebase Auth with Custom Claims
```

## 👥 User Roles

### 1. **Super Admin (Mall Owner)**
- Full system access
- Create/manage stores
- Manage all users and roles
- Access all reports
- Configure system settings
- Manage suppliers

### 2. **Store Manager**
- Manage products for their store
- Create purchase orders
- View sales and inventory
- Generate reports
- Manage staff members
- Cannot delete users or change roles

### 3. **Staff / Employee**
- Record sales
- Track inventory movements
- View product information
- View basic reports
- Cannot modify products or orders

## 📁 Project Structure

```
inventory-mall-app/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   └── Dashboard.jsx   # Main dashboard
│   ├── pages/              # Page components
│   │   ├── LoginPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── StoresPage.jsx
│   │   ├── SuppliersPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── SalesPage.jsx
│   │   ├── ReportsPage.jsx
│   │   └── ActivityLogsPage.jsx
│   ├── context/            # Context API
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── redux/              # Redux store
│   │   ├── store.js
│   │   └── slices/
│   ├── services/           # Firebase services
│   │   ├── firebaseService.js
│   │   └── exportService.js
│   ├── utils/              # Utility functions
│   │   ├── helpers.js
│   │   └── roleUtils.js
│   ├── styles/             # CSS
│   │   └── index.css
│   ├── firebase.js         # Firebase config
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── firebase/              # Firebase configs
│   ├── firestore.rules
│   ├── functions.js
│   └── FIRESTORE_SCHEMA.md
├── public/                # Static assets
├── index.html            # HTML template
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── firebase.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase project (create at console.firebase.google.com)
- Git

### Installation

1. **Clone the repository**
```bash
cd inventory-mall-app
npm install
```

2. **Configure Firebase**
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

3. **Install Firebase CLI globally** (for deployment)
```bash
npm install -g firebase-tools
```

4. **Start development server**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@mall.com | admin123 |
| Store Manager | manager@store.com | manager123 |
| Staff | staff@store.com | staff123 |

⚠️ **Note**: Change these credentials in production!

## 🗄️ Firebase Setup

### 1. **Create Firebase Project**
- Go to [Firebase Console](https://console.firebase.google.com)
- Click "Add project"
- Follow the setup wizard

### 2. **Enable Authentication**
- In Firebase Console → Authentication → Sign-in method
- Enable "Email/Password"
- Enable "Google Sign-in" (optional)

### 3. **Create Firestore Database**
- Go to Firestore Database
- Click "Create database"
- Select "Start in production mode"
- Choose your region (closest to you)

### 4. **Deploy Firestore Rules**
```bash
firebase deploy --only firestore:rules --project your-project-id
```

### 5. **Deploy Cloud Functions**
```bash
firebase deploy --only functions --project your-project-id
```

### 6. **Create Demo Users**
Use Firebase Console or Admin SDK:
```javascript
// In Firebase Console → Authentication
// Create users manually or use provided admin script
```

### 7. **Initialize Demo Data**
```bash
# Run this in Firebase Console Functions
// See seed-data.js for initialization script
```

## 📊 Firestore Collections

The app uses the following Firestore collections:

- **users** - User accounts with roles
- **products** - Product inventory
- **categories** - Product categories
- **stores** - Mall store information
- **suppliers** - Supplier management
- **purchase_orders** - Purchase orders
- **sales** - Sales transactions
- **inventory_movements** - Inventory tracking
- **activity_logs** - Audit logs
- **notifications** - System notifications

See `firebase/FIRESTORE_SCHEMA.md` for detailed schema.

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Building Components

Components follow a consistent structure:

```jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { productService } from '../services/firebaseService'
import toast from 'react-hot-toast'

export function MyComponent() {
  const { currentUser } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load data
  }, [])

  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

## 🎨 Styling

The project uses **Tailwind CSS** with custom configuration:

- Custom color palette (primary, secondary)
- Dark mode support
- Responsive utilities
- Custom component classes (.card, .input-field, .badge)

Styles are in `src/styles/index.css`

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Single column layout, sidebar collapses to hamburger
- **Tablet**: Two column layout
- **Desktop**: Three+ column layout

## 🔒 Security

### Authentication
- Firebase Authentication with email/password
- Custom claims for role-based access
- Session persistence with local storage
- Automatic logout on token expiration

### Authorization
- Role-based middleware for protected routes
- Firestore security rules for database access
- Field-level permissions in rules
- Activity audit logging

### Best Practices
- Never commit credentials to git
- Use environment variables for config
- Validate input on frontend and backend
- Use HTTPS in production
- Enable Firebase Advanced Security

## 📈 Performance Optimization

- Code splitting with React lazy loading
- Image optimization
- Firestore indexing for queries
- Redux for state management
- React Query for caching (optional)

## 🚢 Deployment

### Deploy to Firebase Hosting

1. **Build the project**
```bash
npm run build
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Configure your project**
```bash
firebase init  # Select your project
```

4. **Deploy**
```bash
firebase deploy
```

Your app will be live at:
```
https://your-project-id.web.app
```

### Deploy Cloud Functions
```bash
firebase deploy --only functions --project your-project-id
```

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules --project your-project-id
```

## 🐛 Troubleshooting

### Authentication Issues
- Check Firebase credentials in `.env.local`
- Verify authentication methods are enabled in Firebase Console
- Clear browser cache and local storage

### Firestore Issues
- Check database is in production mode
- Verify Firestore rules are deployed
- Check collection names match exactly
- Verify custom claims are set correctly

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version: `node -v` (should be 16+)

## 📚 API Documentation

### Authentication Service
```javascript
import { useAuth } from './context/AuthContext'

const { currentUser, login, logout, signup, userRole } = useAuth()
```

### Firebase Service
```javascript
import { productService, storeService, salesService } from './services/firebaseService'

// Products
await productService.getAllProducts()
await productService.addProduct(data)
await productService.updateProduct(id, data)
await productService.deleteProduct(id)
await productService.getLowStockProducts(threshold)

// Others similar structure...
```

### Redux Store
```javascript
import { useDispatch, useSelector } from 'react-redux'

const products = useSelector(state => state.inventory.products)
const dispatch = useDispatch()
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Submit pull request

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support, email: support@inventorysystem.com

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboards
- [ ] Multi-language support
- [ ] Barcode scanner integration
- [ ] SMS notifications
- [ ] Email reports
- [ ] API for third-party integrations
- [ ] Inventory forecasting with ML
- [ ] Customer loyalty integration

## 📄 Change Log

### v1.0.0 (2024-03-11)
- Initial release
- Core inventory management features
- User authentication and RBAC
- Dashboard with analytics
- Reports generation
- Firebase integration

---

**Built with ❤️ for modern retail management**
